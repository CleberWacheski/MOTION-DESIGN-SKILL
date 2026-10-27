#!/usr/bin/env node
/**
 * new-project.mjs — cria um projeto Remotion pronto para motion design.
 *
 *   node <skill>/scripts/new-project.mjs <nome-do-projeto> [--vertical | --square] [--fps 30] [--no-add]
 *   (--no-add: não instala os pacotes extras; o create-video já instala as dependências base. Requer git.)
 *
 * O que faz:
 *  1. scaffold oficial (create-video --blank) na pasta <nome-do-projeto>
 *  2. instala pacotes úteis: @remotion/transitions, @remotion/google-fonts, @remotion/media, @remotion/captions
 *  3. copia o kit da skill para src/kit (tema, motion, componentes, transições)
 *  4. cria src/Main.tsx + src/data.ts (copy/dados separados do layout) e registra a composição "Main"
 *  5. cria SPEC.md, STORYLINES.md, PROJECT.md (estado do projeto) e pastas em public/
 *
 * Depois: cd <nome> && npx remotion studio
 */
import { spawnSync } from "node:child_process";
import { cpSync, existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const skill = resolve(here, "..");
const args = process.argv.slice(2);
const name = args[0];
if (!name || name.startsWith("--")) {
  console.error("Uso: node new-project.mjs <nome> [--vertical|--square] [--fps 30] [--no-add]");
  process.exit(1);
}
const has = (f) => args.includes(f);
const val = (f, d) => (args.indexOf(f) >= 0 ? args[args.indexOf(f) + 1] : d);
const fps = Number(val("--fps", 30));
const [width, height] = has("--vertical") ? [1080, 1920] : has("--square") ? [1080, 1080] : [1920, 1080];

const run = (cmd, a, cwd) => {
  console.log(`$ ${cmd} ${a.join(" ")}`);
  const r = spawnSync(cmd, a, { cwd, stdio: "inherit", shell: process.platform === "win32" });
  if (r.status !== 0) {
    console.error(`✗ Falhou: ${cmd} ${a.join(" ")}`);
    process.exit(r.status ?? 1);
  }
};

const dir = resolve(name);
if (existsSync(dir)) {
  console.error(`✗ A pasta ${dir} já existe. Escolha outro nome (não sobrescrevo trabalho existente).`);
  process.exit(1);
}

run("npx", ["-y", "create-video@latest", "--yes", "--blank", "--no-tailwind", name], process.cwd());
// create-video --yes já roda o npm install; aqui só adicionamos pacotes com versão casada
if (!has("--no-add")) {
  run("npx", ["remotion", "add", "@remotion/transitions", "@remotion/google-fonts", "@remotion/media", "@remotion/captions"], dir);
}

// kit
cpSync(join(skill, "assets", "remotion-kit", "kit"), join(dir, "src", "kit"), { recursive: true });

// pastas de mídia
for (const p of ["audio", "voiceover", "images", "fonts", "sfx", "video"]) mkdirSync(join(dir, "public", p), { recursive: true });

// documentos do projeto
for (const f of ["SPEC.md", "STORYLINES.md", "PROJECT.md"]) {
  const src = join(skill, "assets", "templates", f);
  if (existsSync(src)) writeFileSync(join(dir, f), readFileSync(src, "utf8").replaceAll("{{NOME}}", name).replaceAll("{{W}}", String(width)).replaceAll("{{H}}", String(height)).replaceAll("{{FPS}}", String(fps)));
}

// arquivos iniciais
const starter = join(skill, "assets", "remotion-kit", "starter");
cpSync(join(starter, "data.ts"), join(dir, "src", "data.ts"));
cpSync(join(starter, "Main.tsx"), join(dir, "src", "Main.tsx"));
writeFileSync(
  join(dir, "src", "Root.tsx"),
  readFileSync(join(starter, "Root.tsx"), "utf8").replaceAll("{{W}}", String(width)).replaceAll("{{H}}", String(height)).replaceAll("{{FPS}}", String(fps)),
);
// remove o Composition.tsx do template em branco, se existir e não for usado
const blank = join(dir, "src", "Composition.tsx");
if (existsSync(blank)) writeFileSync(blank, "// (substituído por Main.tsx — pode apagar este arquivo)\nexport {};\n");

// remotion.config.ts: BT.709 → H.264 sai yuv420p faixa TV (padrão de plataformas), em vez de yuvj420p
const rc = join(dir, "remotion.config.ts");
if (existsSync(rc)) {
  const cur = readFileSync(rc, "utf8");
  if (!cur.includes("setColorSpace")) writeFileSync(rc, cur + '\n// motion-designer: cor padrão de entrega\nConfig.setColorSpace("bt709");\n');
}

// .gitignore extra
const gi = join(dir, ".gitignore");
const extra = "\nout/\nsnapshots/\n.env\n";
writeFileSync(gi, (existsSync(gi) ? readFileSync(gi, "utf8") : "") + extra);

console.log(`\n✓ Projeto criado em ${dir}  (${width}×${height} @ ${fps}fps)`);
console.log(`  Próximo: cd ${name} && npx remotion studio`);
