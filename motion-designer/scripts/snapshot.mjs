#!/usr/bin/env node
/**
 * snapshot.mjs — "ver o vídeo" sem renderizar o MP4 inteiro.
 * Renderiza frames escolhidos de uma composição Remotion e monta uma CONTACT SHEET
 * (grade de miniaturas com timestamp) para revisão visual (abra o PNG com Read).
 *
 * Uso (rode na raiz do projeto Remotion):
 *   node <skill>/scripts/snapshot.mjs <CompositionId> [opções]
 *
 * Opções:
 *   --at 0.5,2,4.2        segundos específicos
 *   --every 1.5           um frame a cada N segundos (padrão: 8–16 amostras)
 *   --seams 3.2,6.4       pontos de corte: gera -0.2s, 0, +0.2s de cada um
 *   --cols 4              colunas da grade
 *   --out snapshots       pasta de saída (padrão: snapshots/<id>-<timestamp>)
 *   --scale 0.5           escala das imagens (padrão 0.5)
 *   --browser <path>      executável do Chrome/headless_shell (opcional)
 *   --props '{"a":1}'     input props (JSON)
 *
 * Requer: ffmpeg no PATH. Sem dependências npm.
 */
import { spawnSync } from "node:child_process";
import { copyFileSync, existsSync, mkdirSync, readdirSync, renameSync } from "node:fs";
import { join } from "node:path";

const args = process.argv.slice(2);
const id = args[0];
if (!id || id.startsWith("--")) {
  console.error("Uso: node snapshot.mjs <CompositionId> [--at 1,2,3 | --every 1.5 | --seams 3.2,6] [--cols 4]");
  process.exit(1);
}
const opt = (name, def) => {
  const i = args.indexOf(`--${name}`);
  return i >= 0 ? args[i + 1] : def;
};
const browser = opt("browser");
const props = opt("props");
const cols = Number(opt("cols", 4));
const scale = Number(opt("scale", 0.5));
const stamp = new Date().toISOString().replace(/[:.]/g, "-").slice(0, 19);
const outDir = opt("out", join("snapshots", `${id}-${stamp}`));
mkdirSync(outDir, { recursive: true });

// chama o CLI local do Remotion direto com o Node (funciona em macOS, Linux e Windows, sem shell)
const cli = join("node_modules", "@remotion", "cli", "remotion-cli.js");
if (!existsSync(cli)) {
  console.error("Rode na raiz de um projeto Remotion (node_modules/@remotion/cli não encontrado; rode npm install).");
  process.exit(1);
}
const remotion = (a, o) => spawnSync(process.execPath, [cli, ...a], o);
const common = [];
if (browser) common.push(`--browser-executable=${browser}`);
if (props) common.push(`--props=${props}`);

// 1) metadados (fps, duração) via `remotion compositions`
const listing = remotion(["compositions", ...common], { encoding: "utf8" }).stdout || "";
const line = listing.split("\n").find((l) => l.trim().startsWith(id + " ") || l.trim().split(/\s+/)[0] === id);
if (!line) {
  console.error(`Composição "${id}" não encontrada. Saída:\n${listing}`);
  process.exit(1);
}
const parts = line.trim().split(/\s+/);
const fps = Number(parts[1]);
const total = Number(parts[3]);
const durSec = total / fps;

// 2) quais segundos?
let secs = [];
if (opt("at")) secs = opt("at").split(",").map(Number);
else if (opt("seams")) {
  for (const s of opt("seams").split(",").map(Number)) secs.push(s - 0.2, s, s + 0.2);
} else {
  const every = Number(opt("every", Math.max(0.5, durSec / 12)));
  for (let s = 0; s < durSec; s += every) secs.push(Number(s.toFixed(3)));
  secs.push(Math.max(0, durSec - 1 / fps)); // último frame
}
const frames = [...new Set(secs.map((s) => Math.min(total - 1, Math.max(0, Math.round(s * fps)))))].sort((a, b) => a - b);

// 3) render dos frames (uma chamada só)
console.log(`→ ${id}: ${frames.length} frames @ ${fps}fps (${durSec.toFixed(2)}s)`);
const r = remotion(
  ["render", id, outDir, `--frames=${frames.join(",")}`, "--image-format=png", `--scale=${scale}`, "--log=error", ...common],
  { stdio: "inherit" },
);
if (r.status !== 0) process.exit(r.status ?? 1);

// renomeia para t=SS.SSs
const files = readdirSync(outDir).filter((f) => f.endsWith(".png")).sort();
const named = [];
for (const f of files) {
  const m = f.match(/(\d+)\.png$/);
  if (!m) continue;
  const fr = Number(m[1]);
  const name = `t${(fr / fps).toFixed(2).padStart(6, "0")}s_f${String(fr).padStart(5, "0")}.png`;
  renameSync(join(outDir, f), join(outDir, name));
  named.push({ name, fr });
}

// 4) contact sheet com ffmpeg (rótulo de tempo em cada célula)
const hasFfmpeg = spawnSync("ffmpeg", ["-version"]).status === 0;
if (!hasFfmpeg) {
  console.log(`Frames em ${outDir} (instale ffmpeg para gerar a contact sheet).`);
  process.exit(0);
}
const rows = Math.ceil(named.length / cols);
const labeled = join(outDir, "_labeled");
mkdirSync(labeled, { recursive: true });
named.forEach((n, i) => {
  const label = `t=${(n.fr / fps).toFixed(2)}s  f${n.fr}`;
  const dst = join(labeled, `${String(i).padStart(4, "0")}.png`);
  const lab = spawnSync("ffmpeg", [
    "-y", "-loglevel", "error", "-i", join(outDir, n.name),
    "-vf", `drawbox=x=0:y=0:w=iw:h=44:color=black@0.65:t=fill,drawtext=text='${label}':x=14:y=9:fontsize=26:fontcolor=white`,
    dst,
  ]);
  // ffmpeg sem freetype/fontconfig não tem drawtext: usa o frame sem rótulo (nome do arquivo tem o tempo)
  if (lab.status !== 0 || !existsSync(dst)) copyFileSync(join(outDir, n.name), dst);
});
// grade = hstack por linha + vstack (mais confiável que o filtro tile em sequências curtas)
const probe = spawnSync("ffprobe", ["-v", "error", "-select_streams", "v:0", "-show_entries", "stream=width,height", "-of", "csv=p=0", join(labeled, "0000.png")], { encoding: "utf8" });
const [cw, ch] = (probe.stdout || "960,540").trim().split(",").map(Number);
const inputs = [];
named.forEach((_, i) => inputs.push("-i", join(labeled, `${String(i).padStart(4, "0")}.png`)));
const blanks = rows * cols - named.length;
for (let k = 0; k < blanks; k++) inputs.push("-f", "lavfi", "-i", `color=c=0x777777:s=${cw}x${ch}:d=1`);
const fl = [];
for (let i = 0; i < rows * cols; i++) fl.push(`[${i}:v]format=rgb24,pad=${cw + 8}:${ch + 8}:4:4:color=0x777777[c${i}]`);
const rowLabels = [];
for (let r = 0; r < rows; r++) {
  const cells = Array.from({ length: cols }, (_, c) => `[c${r * cols + c}]`).join("");
  fl.push(cols > 1 ? `${cells}hstack=inputs=${cols}[r${r}]` : `${cells}null[r${r}]`);
  rowLabels.push(`[r${r}]`);
}
fl.push(rows > 1 ? `${rowLabels.join("")}vstack=inputs=${rows}[out]` : `${rowLabels[0]}null[out]`);
const sheet = join(outDir, "_contact-sheet.png");
const ff = spawnSync("ffmpeg", ["-y", "-loglevel", "error", ...inputs, "-filter_complex", fl.join(";"), "-map", "[out]", "-frames:v", "1", sheet], {
  stdio: "inherit",
});
if (ff.status === 0 && existsSync(sheet)) console.log(`✓ Contact sheet: ${sheet}`);
else console.log(`Frames em ${outDir} (falha ao montar a contact sheet; veja os PNGs individuais).`);
