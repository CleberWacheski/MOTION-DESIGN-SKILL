# Remotion — guia técnico (testado com Remotion 4.0.537, out/2026)

A API do Remotion evolui rápido (ex.: `Interactive.*`, `@remotion/effects`, `@remotion/whisper-webgpu`, `Easing.spring`, `output: 'perceptual-scale'` são recentes). **Este arquivo cobre o núcleo estável.** Para APIs específicas/novas, consulte a fonte oficial antes de escrever:
- skills oficiais instaladas no projeto (`/remotion-best-practices`, `/remotion-docs`) — ver §1;
- ou a doc em Markdown: `https://www.remotion.dev/docs/<página>.md` (WebFetch).

## Índice
1. Setup
2. Regras de ouro (determinismo)
3. Estrutura de projeto e composição
4. Tempo: Sequence, Series, TransitionSeries, Loop, Freeze
5. Animação: interpolate, spring, Easing, cores
6. Assets: imagens, vídeo, áudio, fontes, GIF, Lottie, SVG
7. Duração dinâmica e vídeos parametrizados (templates)
8. Pacotes úteis
9. Studio (preview) e render
10. Erros comuns
11. Performance
12. Licença

---

## 1. Setup

- Node.js ^20.19 || ^22.13 || ≥24, npm, git; ffmpeg no PATH ajuda nos scripts da skill (o Remotion traz o próprio ffmpeg para render).
- **Projeto novo (recomendado):** `node <skill>/scripts/new-project.mjs <nome> [--vertical|--square]` → scaffold oficial + pacotes + kit + SPEC/STORYLINES/PROJECT.
- Manual: `npx create-video@latest --yes --blank --no-tailwind <nome> && cd <nome> && npm i`.
- Instalar pacotes Remotion SEMPRE com versão casada: `npx remotion add @remotion/transitions` (nunca `npm i @remotion/x` solto — versões diferentes quebram).
- **Skills oficiais do Remotion (recomendado instalar uma vez):** `npx skills add remotion-dev/skills` (ou o plugin do Claude Code: `claude plugin install remotion@remotion`). Use UMA das rotas. Dão `/remotion-best-practices`, `/remotion-docs` (busca a doc atual), `/remotion-captions`, `/remotion-render`, `/remotion-maps`, etc. Esta skill (motion-designer) é a camada de DIREÇÃO; as oficiais são a camada de API — se estiverem disponíveis, consulte-as para detalhes de API.
- O MCP antigo "remotion-documentation" foi descontinuado; use `/remotion-docs` ou a doc `.md`.
- Atualizar: `npx remotion upgrade`. Ver versões: `npx remotion versions`.

## 2. Regras de ouro (determinismo)

O Remotion renderiza cada frame isoladamente, fora de ordem, em várias abas. Tudo visível deve ser **função do frame**.

- Anime com `useCurrentFrame()` + `interpolate()`/`spring()`. **CSS `transition`/`animation`, classes `animate-*` do Tailwind, `requestAnimationFrame`, `setTimeout` NÃO renderizam corretamente.**
- **Nunca `Math.random()`** → use `random("seed-" + i)` do `remotion` (determinístico) ou o `hash01(i)` do kit.
- Nunca `Date.now()`/`new Date()` para animar.
- Pegue `fps`, `width`, `height`, `durationInFrames` de `useVideoConfig()`; converta segundos com `sec(s, fps)` (kit) ou `s * fps`. Nunca hardcode 30.
- Sempre **clamp** no `interpolate` (`extrapolateLeft/Right: "clamp"`), senão valores passam do alvo.
- Dados assíncronos (fetch, medir fonte): `delayRender()`/`continueRender()` ou `useDelayRender()`; prefira buscar em `calculateMetadata`.
- Assets em `public/` referenciados com `staticFile("pasta/arquivo.ext")`.
- Mídia/elementos pesados: `premountFor` nas Sequences (o template novo já define premount padrão de 2s no `remotion.config.ts`).

## 3. Estrutura recomendada

```
src/
  index.ts            registerRoot(RemotionRoot)
  Root.tsx            <Composition>s (16:9, 9:16…), <Folder>s
  Main.tsx            TransitionSeries com as cenas
  data.ts             TODO o texto/números/durações (copy separado de layout)
  voiceover.ts        gerado por scripts/tts.mjs (durações + palavras)
  scenes/             uma cena = um componente (Hook.tsx, Proof.tsx…)
  kit/                kit da skill (theme, motion, componentes, transições)
public/ audio/ voiceover/ images/ fonts/ sfx/ video/
SPEC.md STORYLINES.md PROJECT.md REVIEW.md
```

```tsx
// Root.tsx
<Composition id="Main" component={Main} durationInFrames={mainDuration(30)} fps={30} width={1920} height={1080} defaultProps={{}} />
```

- O mesmo componente pode ser registrado em 16:9 e 9:16 — mas **recomponha** para vertical (layout empilhado, tipo ~1,35× maior), não apenas estique. Use `height > width` para ramificar o layout.
- `<Still>` para thumbnails/imagens (render com `npx remotion still`).

## 4. Tempo

```tsx
import { Sequence, Series, AbsoluteFill } from "remotion";
// Sequence: desloca o tempo dos filhos (dentro dela, useCurrentFrame() começa em 0)
<Sequence from={sec(2, fps)} durationInFrames={sec(3, fps)} premountFor={fps}>
  <Titulo />
</Sequence>
// layout="none" se não quiser o AbsoluteFill automático

// Series: cenas em fila, sem sobreposição
<Series>
  <Series.Sequence durationInFrames={90}><A /></Series.Sequence>
  <Series.Sequence durationInFrames={120} offset={-10}><B /></Series.Sequence>
</Series>
```

**TransitionSeries** (`@remotion/transitions`) — cenas consecutivas com transições:

```tsx
import { TransitionSeries, linearTiming, springTiming } from "@remotion/transitions";
import { fade } from "@remotion/transitions/fade";
import { slide } from "@remotion/transitions/slide";
<TransitionSeries>
  <TransitionSeries.Sequence durationInFrames={90}><A /></TransitionSeries.Sequence>
  <TransitionSeries.Transition presentation={whip({ direction: "left" })} timing={linearTiming({ durationInFrames: 12, easing: EASE.move })} />
  <TransitionSeries.Sequence durationInFrames={120}><B /></TransitionSeries.Sequence>
  <TransitionSeries.Overlay durationInFrames={20}><LightLeak /></TransitionSeries.Overlay>  {/* não encurta */}
  <TransitionSeries.Sequence durationInFrames={90}><C /></TransitionSeries.Sequence>
</TransitionSeries>
```

- **Transições SOBREPÕEM cenas → duração total = soma das cenas − soma das transições.** Overlays não mudam o total. Separe overlay e transição por uma cena.
- `springTiming({config:{damping:200}})` sem duração explícita depende do fps; use `.getDurationInFrames({fps})`.
- Prontos: `fade`, `slide({direction:"from-left"|...})`, `wipe`, `flip`, `clockWipe`, `iris`, `none` + vários shader (ver principios-motion §8). Custom: objeto `{component, props}` (exemplos em `kit/transitions`).
- Outros: `<Loop durationInFrames>` (repete), `<Freeze frame>` (congela), `<Track>` (itens não sobrepostos com posições independentes, editáveis no Studio).

## 5. Animação

```tsx
const frame = useCurrentFrame();
const { fps } = useVideoConfig();
const p = interpolate(frame, [0, 0.6 * fps], [0, 1], {
  extrapolateLeft: "clamp", extrapolateRight: "clamp",
  easing: Easing.bezier(0.16, 1, 0.3, 1),
});
// múltiplos keyframes: easing pode ser array com n-1 itens (versões recentes)
const s = spring({ frame: frame - 10, fps, config: { damping: 200 } }); // 0→1
const cor = interpolateColors(p, [0, 1], ["#8C867D", "#141414"]);
```

- Prefira `transform`/`opacity`/`filter`/`clip-path` a `left/top/width/height` (layout é mais lento e treme).
- Versões recentes aceitam as propriedades individuais `scale`, `translate`, `rotate` (melhor para edição no Studio) e `Easing.spring({damping})` dentro do `interpolate`. Escala percebida: `output: 'perceptual-scale'` em animações de `scale` (recente — confirme na doc da versão).
- `posterize: 3` no interpolate = amostra a cada 3 frames (stop-motion intencional).
- Motion blur: `@remotion/motion-blur` (`<CameraMotionBlur>`/`<Trail>`) ou `filter: blur()` proporcional à velocidade (kit: `velocity()` + `motionBlur()`).

## 6. Assets

- **Imagens:** `<Img src={staticFile("images/x.png")} />` (espera carregar antes do frame). Versões novas também têm `<CanvasImage>` (aceita `effects`).
- **Vídeo/áudio:** `import { Video, Audio } from "@remotion/media"` (recomendado nas versões atuais; `OffthreadVideo`/`Audio` de `remotion` ainda existem). Props úteis: `trimBefore`, `trimAfter`, `volume` (número ou função do frame para fade), `playbackRate`, `loop`, `muted`.
  ```tsx
  <Audio src={staticFile("audio/trilha.mp3")} volume={(f) => interpolate(f, [0, 30, dur - 45, dur], [0, 0.14, 0.14, 0], {extrapolateLeft:"clamp", extrapolateRight:"clamp"})} />
  ```
- **Fontes:** `import { loadFont } from "@remotion/google-fonts/Archivo"; const { fontFamily } = loadFont("normal", { weights: ["500","800"], subsets: ["latin"] });` — chame no topo do módulo. Local: `@font-face` com `staticFile("fonts/x.woff2")` + espera via `delayRender` ou `@remotion/fonts` (`loadFont({family, url})`).
- **GIF/APNG/WebP animado:** `<AnimatedImage>` (remotion) ou `@remotion/gif`.
- **Lottie:** `@remotion/lottie` (`<Lottie animationData={json} />`, sincronizado ao frame). Fonte de animações: LottieFiles. Ícones animados e personagens de After Effects entram por aqui.
- **SVG:** inline em JSX — anime `pathLength`/`strokeDashoffset` (kit: `LineDraw`), `d` com `@remotion/paths` (`interpolatePath`, `evolvePath`), formas com `@remotion/shapes`.
- **3D:** `@remotion/three` (React Three Fiber) com `<ThreeCanvas>`; anime a partir do frame, nunca `useFrame` do R3F.
- **Anotações à mão:** `@remotion/rough-notation` (`<Highlight>`, `<Circle>`, `<Underline>`… com `progress` dirigido pelo frame).
- **Mapas:** skill oficial `/remotion-maps` (Mapbox, MapLibre, MapTiler, Cesium).
- **Efeitos de pixel (recentes):** `@remotion/effects` — `vignette()`, `glow()`, `lightLeak()`, `noise()`, `halftone()`, `chromaticAberration()`, `lut()`… em componentes que aceitam `effects` ou dentro de `<HtmlInCanvas>`. Confirme a API na doc; prefira CSS simples quando bastar.

## 7. Duração dinâmica e templates

- `calculateMetadata` na `<Composition>` define `durationInFrames`, `width/height`, `props`, `defaultOutName` antes do render — use para casar a duração com a narração (some os `seconds` do `voiceover.ts` + respiros − transições) ou com um vídeo de entrada.
- **Vídeo parametrizado:** `schema={z.object({...})}` (zod) na Composition → props editáveis no Studio e render em lote: `npx remotion render Main out/x.mp4 --props='{"titulo":"..."}'` ou `--props=./props.json`. Lote de variações = script Node chamando `@remotion/renderer` (`renderMedia`) em loop.

## 8. Pacotes úteis

`@remotion/transitions` · `@remotion/google-fonts` · `@remotion/fonts` · `@remotion/media` · `@remotion/captions` · `@remotion/whisper-webgpu` (transcrição local; antes era `@remotion/install-whisper-cpp`) · `@remotion/lottie` · `@remotion/three` · `@remotion/shapes` · `@remotion/paths` · `@remotion/noise` (ruído Perlin determinístico) · `@remotion/motion-blur` · `@remotion/rough-notation` · `@remotion/media-utils` (visualização de áudio: `useAudioData`, `visualizeAudio`) · `@remotion/layout-utils` (`fitText`, `measureText`) · `@remotion/player` (embutir em app web) · `@remotion/lambda` (render na AWS).

Bibliotecas da comunidade (lista em remotion.dev/docs/resources): Remocn, RemotionUI, Remotion Bits, Onda (70 componentes/18 transições), snapcn (UI de software), remotion-animated, remotion-animate-text, remotion-subtitle, remotion-transition-series, OpenGL transitions, remotion-qa (checa legibilidade de texto/tempo). Avalie antes de adotar; o kit da skill já cobre o essencial sem dependências.

## 9. Studio e render

- **Preview primeiro, sempre:** `npx remotion studio` (ou `npm run dev`) assim que o projeto rodar; mantenha aberto enquanto constrói, para o usuário acompanhar e corrigir. Composição específica: `http://localhost:3000/<id>`. Sem navegador disponível: use `scripts/snapshot.mjs`.
- **Não renderize o MP4 final sem o usuário pedir/aprovar.** Para você mesmo ver: snapshots/contact sheets.
- Render final (H.264 universal):
  ```bash
  npx remotion render Main out/video.mp4 --codec=h264 --crf=18 --color-space=bt709
  ```
  `--color-space=bt709` faz sair `yuv420p` em faixa TV com BT.709 marcado — o padrão que YouTube/redes esperam. Sem ele o Remotion 4.0.537 entrega `yuvj420p` (faixa cheia), que alguns players exibem com contraste/cor errados (testado; `--pixel-format=yuv420p` sozinho NÃO resolve com frames JPEG). O `new-project.mjs` já grava `Config.setColorSpace("bt709")` no `remotion.config.ts`.
- Outras saídas:
  - transparente para editor (Premiere/DaVinci/AE): `--codec=prores --prores-profile=4444 --pixel-format=yuva444p10le --image-format=png` (+ fundo transparente na composição)
  - WebM transparente: `--codec=vp9 --pixel-format=yuva420p --image-format=png`
  - GIF: `--codec=gif --every-nth-frame=2`
  - frame único: `npx remotion still Main out/thumb.png --frame=45`
  - alguns frames: `npx remotion render Main out/frames --frames=0,90,180 --image-format=png`
  - só áudio: `--codec=mp3`
  - trecho: `--frames=120-240`
  - rascunho rápido: `--scale=0.5 --crf=28`
- Qualidade: `--crf` 16–20 (menor = melhor), `--concurrency` ajusta paralelismo (padrão ~metade dos núcleos), `--image-format=jpeg` (padrão, mais rápido) vs `png` (precisão/transparência).
- Em servidores/containers sem Chrome: `--browser-executable=<caminho do chrome/headless_shell>`.
- Depois do render: `node <skill>/scripts/media-check.mjs out/video.mp4 --expect-seconds N`.

## 10. Erros comuns

| Sintoma | Causa provável | Correção |
|---|---|---|
| Animação funciona no Studio, some/treme no render | CSS transition/animation, rAF, Math.random | dirigir pelo frame; `random(seed)` |
| Frame preto/branco no início de uma cena | mídia não pré-carregada | `premountFor`, `<Img>` em vez de `<img>` |
| Fonte errada no render | fonte não carregou antes do frame | `loadFont` no topo do módulo; conferir still renderizado |
| `Failed to load font … fonts.gstatic.com` | sem internet/rede bloqueada no render | baixe o .woff2 para `public/fonts/` e use `@remotion/fonts` (`loadFont({family, url: staticFile(...)})`) em `kit/fonts.ts` |
| Duração errada com transições | esqueceu de subtrair sobreposições | total = Σ cenas − Σ transições |
| Valores "passando do ponto" | interpolate sem clamp | `extrapolateLeft/Right: "clamp"` |
| `Cannot find module @remotion/x` / conflito de versão | instalou versão diferente | `npx remotion add @remotion/x` |
| Texto embaçado em scale | escala via `scale` em elemento com texto pequeno | renderize o texto no tamanho final; anime menos escala |
| Banding no fundo | gradiente linear escuro | sólido/radial + grão |
| Render lento | blur/box-shadow pesados, muitos elementos, imagens gigantes | reduzir blur, pré-redimensionar imagens, `--concurrency` |
| Áudio dessincronizado | tempo calculado com fps fixo diferente do comp | sempre `fps` de `useVideoConfig()` |

## 11. Performance

`filter: blur()` grande e `box-shadow` grande custam caro por frame; pré-redimensione imagens para o tamanho de uso; evite centenas de nós DOM animados (use canvas/SVG para partículas); medir texto/DOM fora do render loop; `--scale` para rascunhos.

## 12. Licença

Remotion é gratuito para indivíduos, ONGs e empresas com até 3 pessoas. Empresas maiores precisam de licença (out/2026: Creators ~US$25/seat/mês; Automators US$0,01/render com mínimo US$100/mês; Enterprise a partir de US$500/mês). Confirme em remotion.pro/license se o uso for comercial em empresa > 3 pessoas. Alternativa Apache-2.0 sem taxa: HyperFrames (`engines-alternativas.md`).
