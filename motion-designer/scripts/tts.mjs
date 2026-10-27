#!/usr/bin/env node
/**
 * tts.mjs — gera a narração POR CENA e um manifesto com durações + tempos por palavra.
 * A narração vira o RELÓGIO do vídeo: as cenas são cronometradas pelo áudio real.
 *
 *   node <skill>/scripts/tts.mjs voiceover.json [--provider elevenlabs|openai|edge|say] [--voice <id>]
 *
 * voiceover.json:
 *   {
 *     "provider": "elevenlabs",            // opcional (padrão: elevenlabs se houver chave → edge → openai → say)
 *     "voice": "<voice_id ou nome>",       // opcional
 *     "language": "pt-BR",
 *     "scenes": [ { "id": "hook", "text": "Você já reparou..." }, ... ]
 *   }
 *
 * Saída (na raiz do projeto Remotion):
 *   public/voiceover/<id>.mp3
 *   src/voiceover.ts  →  export const VOICEOVER = [{ id, file, seconds, words: [{text,startMs,endMs}] }]
 *
 * Provedores:
 *  - elevenlabs : melhor qualidade em pt-BR; usa o endpoint with-timestamps → legendas exatas.
 *                 env ELEVENLABS_API_KEY. Voz padrão: defina "voice" (voice_id da sua conta).
 *  - openai     : env OPENAI_API_KEY; modelo gpt-4o-mini-tts; vozes: alloy, ash, coral, sage, nova...
 *  - edge       : GRÁTIS, sem chave (Microsoft neural): `pip install edge-tts`.
 *                 vozes pt-BR: pt-BR-FranciscaNeural, pt-BR-AntonioNeural, pt-BR-ThalitaMultilingualNeural
 *  - say        : macOS offline (rascunho): voz "Luciana" (pt-BR). Requer ffmpeg.
 * Tempos por palavra: exatos no elevenlabs; estimados (proporcionais) nos demais —
 * para legendas exatas nesses casos, transcreva com Whisper (references/audio-voz-legendas.md).
 */
import { spawnSync } from "node:child_process";
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const args = process.argv.slice(2);
const file = args[0];
if (!file || !existsSync(file)) {
  console.error("Uso: node tts.mjs voiceover.json [--provider elevenlabs|openai|edge|say] [--voice id]");
  process.exit(1);
}
const opt = (n) => (args.indexOf(`--${n}`) >= 0 ? args[args.indexOf(`--${n}`) + 1] : undefined);
const cfg = JSON.parse(readFileSync(file, "utf8"));
const has = (cmd, a = ["--version"]) => spawnSync(cmd, a, { stdio: "ignore" }).status === 0;

let provider = opt("provider") ?? cfg.provider;
if (!provider) {
  if (process.env.ELEVENLABS_API_KEY) provider = "elevenlabs";
  else if (has("edge-tts", ["--help"])) provider = "edge";
  else if (process.env.OPENAI_API_KEY) provider = "openai";
  else if (process.platform === "darwin") provider = "say";
  else {
    console.error("Nenhum provedor disponível. Opções: ELEVENLABS_API_KEY, OPENAI_API_KEY, `pip install edge-tts`, ou macOS (say).");
    process.exit(1);
  }
}
const voice = opt("voice") ?? cfg.voice;
const outDir = join("public", "voiceover");
mkdirSync(outDir, { recursive: true });

const ffprobeSeconds = (p) => {
  const r = spawnSync("ffprobe", ["-v", "error", "-show_entries", "format=duration", "-of", "default=nw=1:nk=1", p], { encoding: "utf8" });
  const s = Number((r.stdout || "0").trim());
  if (r.status !== 0 || !(s > 0)) {
    console.error(`✗ Não consegui medir a duração de ${p}. Instale ffmpeg/ffprobe (macOS: brew install ffmpeg).`);
    process.exit(1);
  }
  return s;
};

/** distribui o tempo pelas palavras proporcionalmente ao nº de caracteres (estimativa) */
const estimateWords = (text, seconds) => {
  const words = text.split(/\s+/).filter(Boolean);
  const weights = words.map((w) => w.length + 2); // +2 ≈ espaço/pausa
  const total = weights.reduce((a, b) => a + b, 0);
  const lead = 0.05 * seconds; // pequena respiração inicial
  const span = seconds * 0.95 - lead;
  let t = lead;
  return words.map((w, i) => {
    const d = (weights[i] / total) * span;
    const out = { text: w, startMs: Math.round(t * 1000), endMs: Math.round((t + d) * 1000) };
    t += d;
    return out;
  });
};

/** converte alinhamento por caractere (ElevenLabs) em palavras */
const wordsFromAlignment = (al) => {
  const words = [];
  let cur = null;
  al.characters.forEach((ch, i) => {
    const s = al.character_start_times_seconds[i];
    const e = al.character_end_times_seconds[i];
    if (/\s/.test(ch)) {
      if (cur) words.push(cur);
      cur = null;
    } else {
      if (!cur) cur = { text: "", startMs: Math.round(s * 1000), endMs: 0 };
      cur.text += ch;
      cur.endMs = Math.round(e * 1000);
    }
  });
  if (cur) words.push(cur);
  return words;
};

const results = [];
for (const scene of cfg.scenes) {
  const mp3 = join(outDir, `${scene.id}.mp3`);
  let words = null;
  console.log(`→ [${provider}] ${scene.id}: "${scene.text.slice(0, 60)}${scene.text.length > 60 ? "…" : ""}"`);

  if (provider === "elevenlabs") {
    const key = process.env.ELEVENLABS_API_KEY;
    if (!key) throw new Error("Defina ELEVENLABS_API_KEY");
    if (!voice) throw new Error('Defina "voice" (voice_id) no voiceover.json ou --voice');
    const res = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voice}/with-timestamps`, {
      method: "POST",
      headers: { "xi-api-key": key, "Content-Type": "application/json" },
      body: JSON.stringify({
        text: scene.text,
        model_id: cfg.model ?? "eleven_multilingual_v2",
        voice_settings: cfg.voice_settings ?? { stability: 0.5, similarity_boost: 0.75, style: 0.3 },
      }),
    });
    if (!res.ok) throw new Error(`ElevenLabs ${res.status}: ${await res.text()}`);
    const json = await res.json();
    writeFileSync(mp3, Buffer.from(json.audio_base64, "base64"));
    if (json.alignment) words = wordsFromAlignment(json.alignment);
  } else if (provider === "openai") {
    const key = process.env.OPENAI_API_KEY;
    if (!key) throw new Error("Defina OPENAI_API_KEY");
    const res = await fetch("https://api.openai.com/v1/audio/speech", {
      method: "POST",
      headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        model: cfg.model ?? "gpt-4o-mini-tts",
        voice: voice ?? "coral",
        input: scene.text,
        instructions: cfg.instructions ?? "Fale em português do Brasil, tom natural e confiante, ritmo de narrador de vídeo explicativo.",
        response_format: "mp3",
      }),
    });
    if (!res.ok) throw new Error(`OpenAI ${res.status}: ${await res.text()}`);
    writeFileSync(mp3, Buffer.from(await res.arrayBuffer()));
  } else if (provider === "edge") {
    const r = spawnSync("edge-tts", ["--voice", voice ?? "pt-BR-FranciscaNeural", "--text", scene.text, "--write-media", mp3], { stdio: "inherit" });
    if (r.status !== 0) throw new Error("edge-tts falhou (pip install edge-tts)");
  } else if (provider === "say") {
    const aiff = mp3.replace(/\.mp3$/, ".aiff");
    let r = spawnSync("say", ["-v", voice ?? "Luciana", "-o", aiff, scene.text], { stdio: "inherit" });
    if (r.status !== 0) throw new Error("say falhou");
    r = spawnSync("ffmpeg", ["-y", "-loglevel", "error", "-i", aiff, "-codec:a", "libmp3lame", "-q:a", "2", mp3], { stdio: "inherit" });
    if (r.status !== 0) throw new Error("ffmpeg falhou ao converter aiff→mp3");
  } else throw new Error(`Provedor desconhecido: ${provider}`);

  const seconds = ffprobeSeconds(mp3);
  if (!words) words = estimateWords(scene.text, seconds);
  results.push({ id: scene.id, file: `voiceover/${scene.id}.mp3`, seconds: Number(seconds.toFixed(3)), text: scene.text, words });
  console.log(`  ✓ ${seconds.toFixed(2)}s`);
}

mkdirSync("src", { recursive: true });
const ts = `// Gerado por tts.mjs (${provider}) — não edite à mão; rode o script de novo.
// Tempos de palavras ${provider === "elevenlabs" ? "EXATOS (alinhamento ElevenLabs)" : "ESTIMADOS — use Whisper para legendas precisas"}.
export type VoWord = { text: string; startMs: number; endMs: number };
export type VoScene = { id: string; file: string; seconds: number; text: string; words: VoWord[] };
export const VOICEOVER: VoScene[] = ${JSON.stringify(results, null, 2)};
export const voById = (id: string) => VOICEOVER.find((v) => v.id === id)!;
`;
writeFileSync(join("src", "voiceover.ts"), ts);
writeFileSync(join(outDir, "manifest.json"), JSON.stringify(results, null, 2));
const total = results.reduce((a, r) => a + r.seconds, 0);
console.log(`\n✓ ${results.length} cenas, ${total.toFixed(2)}s de fala → src/voiceover.ts`);
console.log("  Dica: duração da cena = seconds da fala + 0.3–0.8s de respiro (e some as sobreposições das transições).");
