# Engines — Remotion é a única opção? (panorama out/2026)

**Resposta curta:** não é a única, mas é a **melhor padrão** para você: mais madura (desde 2020), maior ecossistema, a que os modelos mais "conhecem" (resultado melhor com o mesmo prompt em comparações práticas), skills oficiais para agentes, render determinístico com Chrome+FFmpeg embutido, e grátis para indivíduos/empresas até 3 pessoas. Use as outras quando o caso pedir.

## Matriz de decisão

| Situação | Use |
|---|---|
| Padrão: explainer, lançamento, dados, kinetic type, social, template reutilizável | **Remotion** |
| Empresa > 3 pessoas sem querer licença Remotion; ou base HTML/CSS/GSAP existente; ou quer o "loop de agente" com lint/check/snapshot embutidos | **HyperFrames** (Apache-2.0) |
| Matemática, física, algoritmos, provas, geometria (estilo 3Blue1Brown) | **Manim** (Community Edition, Python) |
| Animação rápida e única, sem código, conta Team/Enterprise do Claude | **Claude Motion** (claude.ai) |
| Personagem/ilustração vetorial de After Effects | Lottie dentro do Remotion (`@remotion/lottie`) |
| Animação interativa de app com state machine | Rive (há `@remotion/rive` para render) |
| Edição de footage (cortar podcast, talking head) | Remotion (`@remotion/media`, captions) ou FFmpeg direto; editor tradicional para muito material |
| Geração de vídeo realista (pessoas, cenas filmadas) | modelos generativos (Runway, Luma, Veo, Kling…) — fora do escopo "motion como código"; podem gerar b-roll que entra no Remotion |
| Avatar/apresentador | HeyGen (avatar) + overlays em Remotion/HyperFrames |
| Vídeo em lote via API sem código (milhares de variações) | Remotion Lambda/`renderMedia`; SaaS: Shotstack, Creatomate, JSON2Video, Plainly (AE) |

## Remotion (padrão)

React/TSX; animação = função do frame (`useCurrentFrame`, `interpolate`, `spring`). Studio com preview e edição; Player embutível em apps; render local, servidor, AWS Lambda, Cloud Run. Licença: grátis até 3 pessoas; acima, Creators ~US$25/seat/mês, Automators US$0,01/render (mín. US$100/mês), Enterprise ≥ US$500/mês (out/2026). Skills oficiais: `npx skills add remotion-dev/skills`. Detalhes: `remotion-tecnico.md`.

## HyperFrames (HeyGen, open source desde mar/2026, v0.8.x)

"Escreva HTML. Renderize vídeo. Feito para agentes." Composições em HTML/CSS com `data-start`/`data-duration` em segundos e uma timeline GSAP pausada por composição (`window.__timelines[id] = tl`); headless Chrome + FFmpeg, determinístico. Requer Node 22+ e FFmpeg instalado.
- Instalar skills: `npx skills add heygen-com/hyperframes` (router `/hyperframes` + ~20 skills: launch, explainer, music-to-video, captions, slideshow, figma, remotion-to-hyperframes…).
- CLI: `npx hyperframes init <dir>`, `capture <url>` (extrai cores/fontes/copy/screenshots de um site!), `lint`, `check --json` (lint+runtime+layout+contraste), `snapshot --review`, `keyframes`, `preview`, `render --quality draft|looks|delivery`, `render --batch rows.json`, `tts`, `transcribe`, `beats`, `normalize-audio`, `media-treatment`, `remove-background`, `lambda`/`cloudrun`/`cloud`.
- Regras do contrato: todo elemento temporizado tem `class="clip"` + `data-start` + `data-duration`; nada de `Date.now()`, `Math.random()` sem seed, fetch, timers, `repeat:-1`; nunca anime `display/visibility` num `.clip` (anime um filho); paths de assets relativos à raiz.
- Prós: Apache-2.0 sem taxa em qualquer porte; ferramentas de QA/visão para o agente muito boas; `capture` de marca; registry de blocos/transições.
- Contras: jovem (pré-1.0, muda rápido), ecossistema menor, relatos de resultados mais "web-like" e trechos sem animação em vídeos longos; usa mais tentativa-erro.
- Quando escolher: o usuário pede, ou licença Remotion é problema, ou o material já é HTML/GSAP.
- GSAP agora é 100% grátis (inclui SplitText, MorphSVG etc., desde 2025 sob a Webflow); skills oficiais: `npx skills add greensock/gsap-skills`.

## Manim (Community Edition)

Python; perfeito para matemática/ciência (fórmulas LaTeX, gráficos de funções, transformações geométricas, `Transform` entre objetos). `pip install manim` (+ LaTeX e FFmpeg). Render: `manim -pqh cena.py MinhaCena` (`-ql` rascunho, `-qk` 4K). Bom para inserir como clipe dentro de um vídeo Remotion (render MP4/MOV transparente com `-t` e importe com `<Video>`).

## Claude Motion (claude.ai)

Lançado em 08/out/2026, beta, **só planos Team e Enterprise** (no Enterprise o admin habilita). Você descreve, o Claude escreve a animação como código (sem modelo de vídeo), edita por chat ou no editor embutido, exporta MP4 ou compartilha link; integra com Adobe, Descript, HeyGen, Runway, Luma etc. Bom para peças curtas e únicas (gráfico animado, explicação de 30s). Não é feito para vídeos longos, lote/API ou controle total do código. Se a sua conta tiver, é a via mais rápida para algo pequeno; para tudo que é recorrente, template, longo ou versionado, Remotion.

## Motion Canvas / Revideo

Motion Canvas (MIT; generators, editor com áudio) — último release no npm em fev/2025: **parado**, não recomendado para começar hoje. Revideo (fork MIT com render headless e API de servidor) virou o motor do produto Midrender; roadmap segue o produto. Só use se o usuário já tiver projetos nele.

## Outras ferramentas que se somam (não substituem)

- **Lottie/LottieFiles**: biblioteca de animações vetoriais prontas (ícones, personagens) → `@remotion/lottie`.
- **Rive**: animações interativas → `@remotion/rive`.
- **Three.js / React Three Fiber**: 3D → `@remotion/three`.
- **D3**: calcular escalas e paths de gráficos (animação continua pelo frame).
- **Figma**: exporte SVG/PNG dos frames; tokens viram `theme.ts`.
- **FFmpeg**: cortar/concatenar/converter/normalizar fora do Remotion.
- **After Effects + Plainly/Nexrender**: quando um motion designer humano já entregou o .aep e só se quer variar texto em lote.
