# Look — tipografia, cor, composição e materiais para VÍDEO

Deixado sozinho, o mesmo briefing sai com o mesmo look sempre ("void escuro, glow, texto pequeno no meio"). Proibir o default só o empurra para o próximo default. O que quebra isso é **input de fora**, nesta ordem: o design spec do projeto → uma marca real → uma referência que o usuário deu → o mundo do próprio assunto. Decida o look ANTES da primeira cena, como números na linha LOOK do SPEC.

## 1. Fontes do look

- **Design spec do projeto** (`DESIGN.md`, `design.md`, `brand.json`): hex, famílias e pesos são normativos; copie exatamente. Tamanhos/espaçamentos de web são seus para escalar para vídeo (borda de 1px e sombra de 6% somem na tela).
- **Marca a partir de um site:** visite (navegador/WebFetch), capture screenshots, copy real, logo (SVG/PNG oficial), cores e fontes. Nunca redesenhe logo de memória; nunca use quadrado colorido no lugar de ícone de app.
- **Imagens anexadas:** tire paleta e tipo do que você vê.
- **Referência (vídeo/imagem):** extraia a GRAMÁTICA, não o conteúdo — duração dos planos, como títulos entram/saem, transições, papéis da paleta, escala/peso do tipo. Anote o que mediu vs. o que chutou.
- **Do assunto:** sua época, seus materiais, onde seria exibido (um vídeo sobre café pode ser papel kraft, carimbo e tinta marrom; sobre finanças, papel-moeda, guilhoché, verde-tinta).

## 2. Look construído a partir de um MEIO

Um look se sustenta quando é as regras de UM meio, não uma paleta. Exemplo — risografia:
- **papel:** uma cor chapada com ruído de fibra, sem gradientes;
- **tinta A:** toda palavra a ser lida e toda linha estrutural;
- **tinta B:** um acento fluorescente, um foco por quadro;
- **sobreimpressão:** onde as tintas se cruzam surge uma 3ª cor; a chapa B fica 3px fora de registro;
- **retícula:** todo gradiente vira pontos.

E o movimento vem do mesmo meio: o quadro é IMPRESSO chapa por chapa, não "fade in". Escreva qualquer look assim. Exemplos de meios: papel e tinta, recorte de papel/colagem, risografia, jornal, blueprint/planta técnica, UI do produto real, quadro-negro/giz, massinha (clay), estúdio 3D, fotografia + tipo, terminal/código, mapa cartográfico, cartaz suíço (grid internacional), neobrutalismo.

| A palavra | Vira |
|---|---|
| premium | um material com números: papel acetinado com 2% de grão, produto sobre fundo infinito com sombra de contato 0,55 |
| moderno | uma câmera e um sistema tipográfico: push de 30 frames num ease, display a 9% da altura do quadro com tracking -2% |
| limpo | um grid e uma ração: 12 colunas, margens de 96px, accent em uma palavra por plano |
| dinâmico | cortes no beat, troca de layout no compasso, um movimento-herói por plano |
| divertido | springs damping 0,45–0,6 em posição/escala (nunca opacidade/cor), poses 10–30% exageradas |
| cinematográfico | lente e luz: enquadramento 35mm, key superior-esquerda, rim por trás, vinheta 6% |

## 3. Tipografia para vídeo

- **Tamanhos (a 1080 de altura / lado curto):** título ~8–9% da altura (≈ 84–100px; linhas "quietas" 4–6% ≈ 43–65px); palavra-herói pode ocupar 60–90% da largura; apoio importante ≥ 44px; **nada legível abaixo de ~28px** (2,6% do lado curto). Use `typeScale(width,height)` do kit.
- Texto demais? **Corte palavras, nunca encolha o tipo.**
- **Uma ou duas linhas** por vez. Linha de título ≤ 6 palavras.
- **Display grande pede tracking negativo** (-2% a -4%) e line-height apertado (0,95–1,05).
- Números: `font-variant-numeric: tabular-nums` (contagem não treme).
- Pesos: display 700–900 lê melhor em movimento e em celular; corpo 400–600.
- **Contraste:** texto sobre vídeo/imagem precisa de chão (faixa sólida, sombra, scrim local) ou contorno (`-webkit-text-stroke` + `paint-order: stroke fill`).
- **Defaults que denunciam IA:** Inter, Space Grotesk, Instrument Serif, Geist, JetBrains Mono. Use quando a marca usa, não por padrão. Alternativas com personalidade (Google Fonts): Archivo / Archivo Black, Bricolage Grotesque, Familjen Grotesk, Schibsted Grotesk, Unbounded, Syne, Anton, Bebas Neue (condensada, cartaz), Fraunces, Newsreader, Playfair Display, DM Serif Display, IBM Plex (técnico), Space Mono (retro-tech).
- Carregue fontes com `@remotion/google-fonts` (`loadFont()` de `@remotion/google-fonts/<Nome>`) ou local via `@font-face` + `staticFile`. Fonte que não carregou = fallback silencioso no render: sempre confira um frame renderizado.

## 4. Cor

- **Papéis, não paleta:** chão (ground), tinta (ink), tinta suave, UM accent racionado (uma palavra/elemento por plano, o payoff, o end card), cores semânticas (positivo/negativo) só para dados.
- Fundo escuro só com motivo (o assunto é noite/cinema/terminal) e com textura.
- **Fatos de vídeo:** gradiente linear de tela cheia em fundo escuro faz **banding** no H.264 → prefira sólido, radial suave, ou sólido + grão (3–6%). Accent a 5% de opacidade some na compressão: 15–25% para atmosfera, saturação total para o foco.
- Cores muito saturadas (vermelho puro #FF0000) "sangram" no H.264/yuv420p (subamostragem de croma): dessature um pouco e evite texto fino vermelho sobre azul.
- Contraste de texto ≥ 4.5:1 (WCAG) para leitura em celular sob luz.

## 5. Composição

- Vídeo, não página web: decida o que o olho vê PRIMEIRO em cada cena e construa o quadro em volta disso.
- **Safe areas:** conteúdo dentro de 90% (action-safe), texto e chave dentro de 80% (title-safe). Em 16:9 (1920×1080): title-safe = 10% (192px laterais, 108px topo/base) — `safeArea()` do kit. Em quadros de 1080 de largura (vertical/quadrado): texto-chave ≥ 80px das laterais e ≥ 100px de topo/base; no vertical vale a zona universal de `formatos-plataformas.md`. Vertical: ver `formatos-plataformas.md`.
- Herói ≥ 40% da altura ou largura. Evite "tudo centralizado": use assimetria, alinhamento à esquerda, grid.
- Não adicione elementos redundantes (molduras, labels de canto, ícones em círculos).
- Profundidade com camadas: fundo (lento), meio, frente (rápido); sombra de contato faz objetos "tocarem" o chão.
- Imagens/screenshots: mostre o pedaço que o beat usa em 1,6–2× do tamanho real; texto continua ≥ 26px após qualquer push. UI de produto nunca inclinada em 3D (só conteúdo gerado inclina).

## 6. Tema no código

Todo look vira `Theme` (`kit/theme.ts`): cores, fontes, pesos, tracking, raio, grão. Componentes nunca inventam cor. Para re-branding basta trocar o tema. Para variações (cena escura no meio), sobrescreva o tema localmente com `<ThemeProvider theme={{...t, colors:{...}}}>`.

Presets em `themePresets` são PONTOS DE PARTIDA (jornal, riso, brutal, produto, noturno) — não fallback automático.
