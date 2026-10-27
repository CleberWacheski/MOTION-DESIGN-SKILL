#!/usr/bin/env node
/**
 * media-check.mjs — confere o arquivo FINAL antes de entregar (você não ouve; meça).
 *
 *   node <skill>/scripts/media-check.mjs out/video.mp4 [--expect-seconds 30] [--normalize]
 *
 * Mostra: duração, resolução, fps, codec, se há áudio, loudness integrado (LUFS),
 * true peak (dBTP) e avisos. Alvos: social/YouTube ≈ -14 LUFS, true peak ≤ -1 dBTP.
 * --normalize  gera <arquivo>.norm.mp4 com loudnorm (-14 LUFS / -1 dBTP), vídeo copiado.
 */
import { spawnSync } from "node:child_process";
import { existsSync, statSync } from "node:fs";

const args = process.argv.slice(2);
const f = args[0];
if (!f || !existsSync(f)) {
  console.error("Uso: node media-check.mjs <arquivo> [--expect-seconds N] [--normalize]");
  process.exit(1);
}
const opt = (n) => (args.indexOf(`--${n}`) >= 0 ? args[args.indexOf(`--${n}`) + 1] : undefined);
const warn = [];
let measured = null; // valores do 1º passe do loudnorm (reusados no --normalize)

const probe = JSON.parse(
  spawnSync("ffprobe", ["-v", "error", "-show_format", "-show_streams", "-of", "json", f], { encoding: "utf8" }).stdout || "{}",
);
const v = (probe.streams || []).find((s) => s.codec_type === "video");
const a = (probe.streams || []).find((s) => s.codec_type === "audio");
const dur = Number(probe.format?.duration || 0);
const size = statSync(f).size;

console.log(`Arquivo   ${f}  (${(size / 1e6).toFixed(1)} MB)`);
console.log(`Duração   ${dur.toFixed(2)}s`);
if (v) {
  const [n, d] = (v.r_frame_rate || "0/1").split("/").map(Number);
  console.log(`Vídeo     ${v.codec_name} ${v.width}×${v.height} @ ${(n / d).toFixed(2)}fps  pix_fmt=${v.pix_fmt}`);
  if (v.pix_fmt && v.pix_fmt !== "yuv420p" && v.codec_name === "h264") warn.push(`pix_fmt ${v.pix_fmt}: alguns players exigem yuv420p`);
  if (v.width % 2 || v.height % 2) warn.push("dimensões ímpares: H.264 exige pares");
}
if (size < 50_000) warn.push("arquivo muito pequeno — render pode ter falhado");
const exp = opt("expect-seconds");
if (exp && Math.abs(dur - Number(exp)) > 0.1) warn.push(`duração ${dur.toFixed(2)}s ≠ esperado ${exp}s`);

if (!a) {
  console.log("Áudio     (nenhum)");
  if (dur > 15) warn.push("vídeo > 15s sem som — intencional? (feeds sem som ok; explainer/launch normalmente pedem trilha)");
} else {
  const r = spawnSync("ffmpeg", ["-hide_banner", "-nostats", "-i", f, "-af", "loudnorm=I=-14:TP=-1:LRA=11:print_format=json", "-f", "null", "-"], {
    encoding: "utf8",
  });
  const m = (r.stderr || "").match(/\{[\s\S]*?\}/g);
  const j = m ? JSON.parse(m[m.length - 1]) : null;
  console.log(`Áudio     ${a.codec_name} ${a.sample_rate}Hz ${a.channels}ch`);
  if (j) {
    measured = j;
    const I = Number(j.input_i);
    const TP = Number(j.input_tp);
    console.log(`Loudness  ${I.toFixed(1)} LUFS integrado · true peak ${TP.toFixed(1)} dBTP · LRA ${Number(j.input_lra).toFixed(1)}`);
    if (I < -20) warn.push(`muito baixo (${I.toFixed(1)} LUFS); alvo ≈ -14 (use --normalize)`);
    if (I > -10) warn.push(`muito alto (${I.toFixed(1)} LUFS); alvo ≈ -14`);
    if (TP > -1) warn.push(`true peak ${TP.toFixed(1)} dBTP > -1: risco de clipping`);
    if (I < -60) warn.push("áudio praticamente mudo — a trilha/voz entrou?");
  }
}

if (args.includes("--normalize") && a) {
  const out = f.replace(/(\.\w+)$/, ".norm$1");
  // 2º passe com os valores medidos (linear = sem "bombear" o áudio); -ar 48000 porque o loudnorm reamostra internamente
  const m = measured;
  const filter = m
    ? `loudnorm=I=-14:TP=-1:LRA=11:measured_I=${m.input_i}:measured_TP=${m.input_tp}:measured_LRA=${m.input_lra}:measured_thresh=${m.input_thresh}:offset=${m.target_offset}:linear=true`
    : "loudnorm=I=-14:TP=-1:LRA=11";
  const r = spawnSync("ffmpeg", ["-y", "-loglevel", "error", "-i", f, "-c:v", "copy", "-af", filter, "-ar", "48000", "-c:a", "aac", "-b:a", "192k", out], { stdio: "inherit" });
  if (r.status === 0) console.log(`✓ Normalizado: ${out}`);
}

console.log(warn.length ? `\n⚠ Avisos:\n - ${warn.join("\n - ")}` : "\n✓ Sem avisos.");
console.log("(Áudio foi MEDIDO, não ouvido — diga isso na entrega.)");
