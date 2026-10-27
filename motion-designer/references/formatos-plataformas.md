# Formatos, plataformas e especificações de entrega

## Formatos padrão

| Destino | Proporção | Resolução | fps | Duração típica |
|---|---|---|---|---|
| YouTube / apresentação / site | 16:9 | 1920×1080 (4K: 3840×2160) | 30 (60 p/ UI rápida) | 30s–3min (explainer), 15–45s (lançamento) |
| TikTok / Reels / Shorts | 9:16 | 1080×1920 | 30 | 15–60s (Shorts ≤ 3 min; gancho em 1s) |
| Feed Instagram / LinkedIn | 4:5 ou 1:1 | 1080×1350 / 1080×1080 | 30 | 15–45s |
| X/Twitter | 16:9 ou 1:1 | 1920×1080 / 1080×1080 | 30 | ≤ 2:20 |
| Vinheta/intro | 16:9 | 1920×1080 | 30 | 3–8s |
| Slides animados p/ apresentação | 16:9 | 1920×1080 | 30 | por slide |
| Overlay p/ editor de vídeo | 16:9 (transparente) | 1920×1080 | 30 (casar com o projeto) | — |

Padrão quando ninguém disse nada: **1920×1080, 30fps, pt-BR**. Diga a premissa em uma linha.

## Zonas seguras verticais (1080×1920)

| Plataforma | Topo | Base | Esq. | Dir. |
|---|---|---|---|---|
| TikTok (orgânico) | 108 | 320 | 60 | 120 |
| TikTok (anúncio) | 108 | 370 | 60 | 120 |
| Instagram Reels | 210 | 310 | — | 84 |
| YouTube Shorts | 120 | 300 (360 c/ descrição aberta) | — | 96 |

**Zona universal:** x 60–960, y 210–1600 (900×1390). Todo texto, rosto, logo e CTA dentro dela. Nada de texto sob o trilho de ações da direita. Abaixo de ~1600 só textura/decoração. O `SafeAreaGuide` do kit desenha isso no Studio (`showGuides`). Verifique na prévia da plataforma antes de publicar — as UIs mudam.

## Vertical não é horizontal espremido

- Recomponha: um sujeito, centralizado, empilhado; painéis lado a lado viram sequência vertical.
- Tipo ~1,35× maior que no 16:9; nada legível < 28px; afirmação ≈ 5 palavras por linha.
- Ritmo mais rápido: planos de 1–2s, beat novo a cada 2–4s, payoff antes do swipe.
- Frame 0 = thumbnail e gancho (rosto, resultado ou frase forte já na tela).
- Muitos assistem mudos: legende a fala; a imagem carrega o gancho sem som.
- Loop (último frame cortando para o primeiro) é escolha, não padrão.

## 16:9 (title/action safe)

Texto dentro de 80% (title-safe: 192px laterais, 108px topo/base a 1080p), ação dentro de 90%.

## Especificações de exportação

| Uso | Comando Remotion |
|---|---|
| Universal (YouTube, redes, WhatsApp) | `--codec=h264 --crf=18 --color-space=bt709` (+ áudio AAC padrão) |
| Rascunho para aprovação | `--codec=h264 --crf=28 --scale=0.5` |
| Overlay transparente p/ Premiere/DaVinci/FCP | `--codec=prores --prores-profile=4444 --pixel-format=yuva444p10le --image-format=png` |
| Web transparente | `--codec=vp9 --pixel-format=yuva420p --image-format=png` |
| Master alta qualidade | `--codec=prores --prores-profile=hq` |
| GIF (README, Slack) | `--codec=gif --every-nth-frame=2 --scale=0.5` (curto!) |
| Thumbnail | `npx remotion still <id> out/thumb.png --frame=<f>` (1280×720 p/ YouTube via composição própria) |

Bitrate alvo aproximado H.264 1080p30: 8–12 Mbps (o CRF 18 costuma cair aí). Para upload no YouTube, mais bitrate ajuda (ele recomprime).

## Variações de um mesmo vídeo

Registre composições irmãs (`Main-16x9`, `Main-9x16`, `Main-1x1`) reaproveitando cenas, com layout que ramifica por `height > width`. Para versões em lote (idiomas, clientes, dados): props + zod schema + render por script (`remotion-tecnico.md` §7).
