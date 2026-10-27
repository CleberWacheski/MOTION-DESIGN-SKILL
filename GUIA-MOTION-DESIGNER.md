# Guia — skill `motion-designer`

Uma skill que transforma o Claude em **diretor + roteirista + designer + dev de motion design**. Você chama pelo nome, passa uma ideia (ou pesquisa, livro, código, planilha, URL, roteiro) e ela conduz tudo: história → storylines → SPEC → projeto Remotion → narração/som → cenas → revisão visual → render → checagem final.

---

## 1. Instalação

**Pré-requisitos no Mac**
```bash
brew install node ffmpeg          # Node ≥ 20.19 (ou 22.13+) e ffmpeg/ffprobe
pip3 install edge-tts             # opcional: narração GRÁTIS em pt-BR
```

**Claude Code (terminal/desktop)**: copie a pasta da skill para a pasta de skills:
```bash
mkdir -p ~/.claude/skills
cp -R ~/Documents/PROJETOS/"MOTION DESIGN"/motion-designer ~/.claude/skills/
```
(ou para `.claude/skills/` dentro de um projeto específico). Reinicie a sessão.

**Claude (app/claude.ai)**: use o arquivo `motion-designer.skill` (botão "Save skill" no card do arquivo, ou faça upload em Configurações → Capacidades → Skills).

**Recomendado (uma vez, complementa a skill com a API oficial sempre atualizada):**
```bash
npx skills add remotion-dev/skills     # skills oficiais do Remotion (/remotion-docs etc.)
```
Opcional: `npx skills add greensock/gsap-skills` e `npx skills add heygen-com/hyperframes` se for usar HyperFrames.

**Chaves (opcionais)** — no seu shell (`~/.zshrc`):
```bash
export ELEVENLABS_API_KEY=...   # melhor voz pt-BR + legendas com tempo exato
export OPENAI_API_KEY=...       # alternativa de voz (gpt-4o-mini-tts)
```

## 2. Como usar

Fale naturalmente, citando a skill:

- `motion-designer: vídeo de 40s explicando juros compostos para iniciantes, com narração`
- `use a motion-designer e transforma este PDF de pesquisa em um Reels de 30s`
- `motion-designer: resumo animado do livro "Hábitos Atômicos" em 60s, vertical`
- `motion-designer: vídeo de lançamento para o meu app (site: https://…), sem narração, só trilha`
- `motion-designer: transforma este PR/repositório em um vídeo de changelog`
- `motion-designer: vinheta de 5s com a logo (anexada) para o meu canal`
- `motion-designer, faz direto sem perguntas: …` → ela escolhe a melhor storyline, constrói, revisa e renderiza.

O que acontece:
1. **Intake** — lê/pesquisa a fonte, acha "a única coisa" e os fatos com fonte.
2. **3 storylines** diferentes (mundo, dispositivo, forma) com recomendação → você escolhe (ou ela segue, no modo direto).
3. **SPEC.md** — o briefing com números (cores hex, fontes, tamanhos, eases, durações, plano a plano, lista de proibidos).
4. **Projeto** (`new-project.mjs`) com o kit pronto + **Remotion Studio** aberto para você acompanhar.
5. **Narração primeiro** (se houver) — a voz vira o relógio do vídeo.
6. **Cenas** construídas com o kit e as receitas.
7. **Revisão** com contact sheets (ela "vê" os frames), notas P0/P1/P2, correções.
8. **Render** quando você aprovar + `media-check` (duração, cor, loudness) + `REVIEW.md`.

Para ajustes depois, é só pedir ("título maior", "mais lento", "troca o accent por verde") — ela lê `PROJECT.md`/`SPEC.md`/`REVIEW.md` e mexe só no necessário. Texto e números ficam em `src/data.ts`, cores/fontes em `src/kit/theme.ts`.

**Comandos que você mesmo pode rodar dentro de um projeto:**
```bash
npx remotion studio                                   # preview ao vivo
node <skill>/scripts/snapshot.mjs Main                # contact sheet do vídeo
npx remotion render Main out/video.mp4 --codec=h264 --crf=18 --color-space=bt709
node <skill>/scripts/media-check.mjs out/video.mp4 --normalize
```

## 3. O que tem dentro

```
motion-designer/
├── SKILL.md                     fluxo, princípios inegociáveis, mapa de arquivos
├── references/                  conhecimento (carregado sob demanda)
│   ├── direcao-criativa.md      história, storylines, gancho, beats, copy, tells de IA, cada tipo de fonte
│   ├── tipos-de-video.md        explainer, lançamento, dados, social, livro, pesquisa, código, música…
│   ├── principios-motion.md     tempo, easing, springs, coreografia, lei da costura, transições
│   ├── look-tipografia-cor.md   look a partir de um meio, tipo para vídeo, cor, composição
│   ├── remotion-tecnico.md      setup, regras, API essencial, render, erros comuns, licença
│   ├── receitas-de-cenas.md     18 receitas (número, gráfico, UI+cursor, diagrama, mito…)
│   ├── audio-voz-legendas.md    TTS, música, SFX, níveis, legendas
│   ├── formatos-plataformas.md  formatos, zonas seguras, specs de export
│   ├── revisao-qa.md            processo de revisão + checklist de entrega
│   └── engines-alternativas.md  Remotion vs HyperFrames vs Manim vs Claude Motion…
├── scripts/
│   ├── new-project.mjs          cria projeto pronto (kit, pacotes, SPEC, BT.709)
│   ├── snapshot.mjs             frames → contact sheet com timestamps
│   ├── tts.mjs                  narração por cena + durações + tempos por palavra
│   └── media-check.mjs          valida e normaliza o arquivo final
└── assets/
    ├── remotion-kit/kit/        componentes testados (Remotion 4.0.537)
    ├── remotion-kit/starter/    Main/Root/data iniciais
    └── templates/               SPEC.md, STORYLINES.md, PROJECT.md
```

**Kit de componentes**: `KineticText` (5 modos de entrada: blur, ink, mask, rise, letters), `CountUp`, `BarChart`, `Cursor` (clique com squash), `Camera` (push/pan com intenção), `Highlighter`, `LineDraw` (diagramas/setas), `Background` + `Grain` (anti-banding), `Captions` (estilo TikTok), `EndCard`, `Typewriter`, `SafeAreaGuide`, transições `whip`, `zoomThrough`, `irisAt`, `dipCut`, `colorFlood`, presets de easing/spring por papel, `readFrames()` (tempo de leitura), `beatFrame()` (grade de música).

**Testado de verdade** nesta sessão: projeto criado com o script, tipos sem erro, vídeo demo de 18s renderizado em 16:9 e 9:16, transições e legendas conferidas frame a frame, narração → durações → legendas → render com áudio → normalização (-25,8 → -14,2 LUFS). A revisão pegou e corrigiu 3 defeitos reais no caminho (frame 0 vazio, end card estourando no vertical, cor `yuvj420p`).

## 4. O que a pesquisa mostrou (resumo)

**Remotion é a única opção?** Não, mas é a melhor padrão para você:
- **Remotion** (React, desde 2020): maior ecossistema, os modelos o conhecem melhor (em comparações práticas, o mesmo prompt deu resultado melhor e mais barato que no HyperFrames), skills oficiais para agentes, Studio de preview, render determinístico, Lambda para escala. **Grátis para indivíduos e empresas até 3 pessoas**; acima disso, licença paga (Creators ~US$25/seat/mês).
- **HyperFrames** (HeyGen, open source desde mar/2026, Apache-2.0): HTML + GSAP, feito "para agentes", com ferramentas ótimas de checagem (`lint`, `check`, `snapshot`, `capture` de sites). Ainda jovem (v0.8) e menos maduro. Use se licença Remotion virar problema ou se tiver base HTML/GSAP.
- **Manim**: o melhor para matemática/ciência (estilo 3Blue1Brown); entra como clipe dentro do Remotion.
- **Claude Motion** (Anthropic, lançado em 08/out/2026, beta só em Team/Enterprise): motion por chat, sem código, exporta MP4. Ótimo para peças curtas únicas; não serve para template/lote/vídeos longos.
- **Motion Canvas** (parado desde fev/2025) e **Revideo** (virou motor do Midrender): não recomendados para começar.
- **Geração de vídeo por IA** (Runway, Luma, Veo…) e **avatares** (HeyGen) se somam como b-roll/apresentador; não substituem motion como código.

**As ideias de motion que mais elevam a qualidade** (estão na skill):
1. História antes de animação: uma única coisa, um exemplo concreto do início ao fim, números reais com fonte.
2. Frame 0 = thumbnail; os 2 primeiros segundos são os mais densos.
3. Todo adjetivo vira número no SPEC ("premium" = material + sombra + grão com valores).
4. Um movimento-herói por plano; título pousado fica parado; nada de "flutuar/respirar" para encher tempo.
5. Easing por papel (chegada expo.out, saída acelera, câmera inOut), saídas mais curtas que entradas, stagger ≤ 500ms.
6. Continuidade: uma direção dominante, 2–4 transições com causa, cortes no meio do movimento.
7. Look a partir de um MEIO (papel, risografia, UI real…), não do default de IA (fundo escuro + glow + gradiente roxo + 3 cards).
8. Narração é o relógio; SFX só com causa, 1 frame depois da imagem; -14 LUFS.
9. Preview antes de render; medir antes de entregar; revisar como diretor exigente.

## 5. Boas práticas suas (como diretor)

- Dê **restrições concretas**: duração, formato, público, onde vai passar, texto que deve aparecer exatamente, cores/fontes/logo, o que NÃO pode aparecer.
- **Mostre referências** (link de vídeo, print, logo, screenshots reais do produto) — referência é o que mais tira o vídeo do "look genérico".
- Aprove **os primeiros 10–20s** antes de deixar construir o resto; itere uma coisa por vez.
- Use o modo direto quando não quiser escolher storyline; use o modo diretor quando o vídeo importa.
- **Reaproveite**: um projeto que ficou bom vira template (troque `data.ts` e `theme.ts`). Peça "transforma isso em template com props" para gerar variações em lote.
- Para marcas, mantenha um `DESIGN.md` com hex, fontes e logo na pasta — a skill lê e respeita.
- Não peça para reproduzir personagens/marcas de terceiros, letras de música ou trechos longos de livros (ela vai recusar e propor algo original).

## 6. Ideias de vídeos para fazer com a skill

- Série "1 ideia de livro por vídeo" (vertical, 45s, narração + legendas).
- Explicadores de finanças pessoais com números reais (juros compostos, inflação, reserva de emergência).
- Resumo animado de pesquisas/notícias da sua área com gráfico que se constrói.
- Vídeos de changelog/lançamento a partir de PRs e releases.
- Vinhetas, intros e end cards do seu canal (com versão transparente para o editor).
- Cards animados de dados (relatórios mensais) como template alimentado por planilha.
- Legendas cinéticas para cortes de podcast/talking head.
- Slides animados para apresentações (cada slide = uma cena).
- Tutoriais de software com cursor e zoom em UI real.

## 7. Limites a saber

- A skill não "ouve": o som é medido (loudness/presença), não avaliado de ouvido — revise você o áudio.
- Fontes do Google precisam de internet no preview/render (offline: fonte local).
- Remotion evolui rápido; a skill cobre o núcleo estável e manda consultar a doc/skills oficiais para APIs novas. Para atualizar um projeto: `npx remotion upgrade`.
- Claude Motion e preços citados são de out/2026 — confira antes de decisões comerciais.

## Fontes principais

- Remotion Agent Skills — https://www.remotion.dev/docs/ai/skills (repo: github.com/remotion-dev/skills)
- Remotion + Claude Code (Tella) — https://www.tella.com/blog/how-to-use-remotion-agent-skills-with-claude-code
- Remotion — licença/preços — https://www.remotion.dev/docs/license/pricing
- Remotion — recursos/templates — https://www.remotion.dev/docs/resources
- HyperFrames (HeyGen) — https://github.com/heygen-com/hyperframes · https://themenonlab.blog/blog/heygen-hyperframes-video-as-code
- HyperFrames vs Remotion — https://www.wireflow.ai/blog/hyperframes-vs-remotion · https://www.woshipm.com/ai/6408883.html
- Remotion vs Motion Canvas vs Revideo — https://www.pkgpulse.com/guides/remotion-vs-motion-canvas-vs-revideo-programmatic-video-2026
- Alternativas ao Remotion — https://www.wireflow.ai/blog/best-remotion-alternatives-in-2026
- Claude Motion — https://eesel.ai/blog/claude-motion · https://www.layer3labs.io/comparisons/claude-motion-vs-remotion · https://www.eesel.ai/blog/claude-motion-alternatives
- LottieFiles Motion Design Skill — https://github.com/lottiefiles/motion-design-skill
- GSAP skills oficiais — https://github.com/greensock/gsap-skills · GSAP 100% grátis — https://webflow.com/updates/gsap-becomes-free
- claude-code-video-toolkit — https://github.com/digitalsamba/claude-code-video-toolkit
- Zonas seguras verticais 2026 — https://adaptlypost.com/blog/social-media-safe-zones-2026-complete-guide
- Kinetic typography (NYFA) — https://nyfa.edu/student-resources/make-good-kinetic-typography-animation-video
