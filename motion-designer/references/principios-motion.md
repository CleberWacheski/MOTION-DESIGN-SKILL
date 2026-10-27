# Princípios de motion — tempo, easing, coreografia, transições

Valores medidos/consagrados (filmes oficiais da HyperFrames, Material Design 3, Apple HIG, LottieFiles motion-design skill, 12 princípios da Disney). São PADRÕES: uma referência do usuário ou uma escolha intencional vence.

## Índice
1. Personalidade de movimento (escolha UMA)
2. Duração e ritmo
3. Easing por papel
4. Springs
5. Coreografia (quem se move, quando)
6. Os 12 princípios aplicados a motion graphics
7. Lei da costura (continuidade entre cenas)
8. Transições com causa (catálogo)
9. Movimento sustentado (o que fazer entre a entrada e a saída)
10. Tradução de feedback do usuário → mudança concreta

---

## 1. Personalidade (uma por projeto, 90% do tempo)

| Arquétipo | Duração típica (UI/objeto) | Ease assinatura | Overshoot | Palavras-chave |
|---|---|---|---|---|
| **Premium** | 350–600ms | `cubic-bezier(0.4,0,0.2,1)` / expo.out longo | 0% | elegante, minimal, luxo, sofisticado |
| **Corporativo** | 200–400ms | `cubic-bezier(0.2,0,0,1)` | 0–3% | limpo, profissional, dashboard, B2B |
| **Playful** | 150–300ms | back.out / spring damping 0.45–0.6 | 10–20% | divertido, fofo, amigável, criança |
| **Enérgico** | 100–250ms | expo.out | 15–30% | dinâmico, ousado, esporte, música |

Defina 3 constantes da marca: (1) **ease assinatura** para 80% das animações; (2) **paleta de 3 durações** (rápida/padrão/lenta); (3) **um padrão de entrada**. Momentos específicos podem pegar emprestado de outro arquétipo (ex.: corporativo usa playful só no "sucesso").

No kit: `EASE.premium`, `EASE.snappy`, `EASE.arrive`, `SPRING.premium`, `SPRING.playful`…

## 2. Duração e ritmo (vídeo, não UI)

- **Movimento rápido** (passagem, chicote): 0,3–0,6s, com motion blur no pico de velocidade (6–12px em texto, 15–20px tela cheia; o ideal é só no eixo do movimento — `filter: blur()` é uniforme, para direcional use SVG `feGaussianBlur stdDeviation="b 0"` ou `@remotion/motion-blur`).
- **Entrada única** ≤ ~0,8s. Build mais longo = stagger de vários elementos, não um elemento lento.
- **Chega devagar, sai limpo:** ease-out de cauda longa na chegada; saída 40–50% mais curta, um movimento só (nunca desliza-para-sai).
- **Overlap:** o próximo elemento começa quando o anterior está 30–50% concluído. Totalmente sequencial = robótico; tudo junto = barato.
- **Stagger:** letras 1 frame; palavras 60–120ms; itens de lista 40–80ms; **orçamento total ≤ 500ms** (com 8+ itens aperte o delay).
- **Ritmo do filme:** algo novo a cada **2–4s**. Montagens cortam a cada 0,13–0,8s; uma demo segura um enquadramento 7–10s enquanto a UI age; planos médios 1,8–3s com movimento interno.
- **Pausa antes do clímax:** 0,3–0,75s de quietude entre a ação principal e o resultado (a "vírgula dramática"). Payoff em velocidade normal.
- **Distância escala duração:** 100px = 1×, 200px = 1,3×, 400px = 1,6×, tela cheia = 1,8–2×.
- **Grade de beats com música:** frames/beat = fps×60/BPM; calcule cada beat pelo índice (`beatFrame(i,bpm,fps)`), nunca somando arredondado (a 128 BPM e 30fps isso desvia 2 frames em 32 beats). Corte no beat; troque o layout no compasso (4 beats).
- Entradas "rápidas demais" parecem glitch: atrasar o vídeo todo em ~1s muitas vezes resolve.

## 3. Easing por papel

| Papel | Curva | Kit |
|---|---|---|
| Chegada (título, objeto pousando) | expo.out / power4.out — `cubic-bezier(0.16,1,0.3,1)` | `EASE.arrive` |
| Chegada enfática | MD3 emphasized `(0.05,0.7,0.1,1)` | `EASE.emphasized` |
| Saída / zoom-through (acelera) | power3.in `(0.55,0,0.75,0.06)` | `EASE.leave` |
| Câmera, pan, inundação de cor | power2.inOut `(0.45,0,0.55,1)` | `EASE.move` |
| Premium | `(0.4,0,0.2,1)` | `EASE.premium` |
| Corporativo | `(0.2,0,0,1)` | `EASE.snappy` |
| Overshoot leve | back.out(1.4–1.7) ≈ `(0.34,1.56,0.64,1)` | `EASE.overshoot` |
| Linear | SÓ rotação contínua, progresso, velocidade constante que é o ponto | `EASE.linear` |

O mesmo `ease-out 0,5s` em tudo é o default chapado que deixa o filme com cara de gerado. **Proibidos em UI/títulos:** bounce.out, elastic.out exagerado.

Material também sugere curva: rígido (metal) 1,2× duração, 0% overshoot; papel 1×, 3–5%; elástico 0,8×, 15–25%; fluido 1,5×, 5%; gás 2×, 0%.

## 4. Springs

- Por **damping ratio**: 1,0 nunca quica; 0,7–0,85 lê como premium; 0,4–0,6 playful; < 0,3 cartoon.
- No Remotion: `spring({frame, fps, config:{damping, stiffness, mass}})`. `damping: 200` = empurrão sem quique (padrão seguro). Ver `SPRING` no kit.
- **Posição e escala podem quicar; opacidade e cor nunca.**
- Reação proporcional à massa: elementos grandes rebatem mais devagar, pequenos estalam.

## 5. Coreografia

- **Herói primeiro:** o elemento principal entra primeiro/mais forte; os de apoio são mais sutis em tudo.
- **Um movimento-herói por plano.** Movimentos secundários viajam 50–70% da distância, começam 100–200ms depois; o resto fica PARADO.
- **Origem espacial consistente:** tudo entra da mesma direção (ou de um ponto comum). Direções misturadas = caos.
- **Regra do 1/3 (densidade):** com 3+ elementos, no máximo 1/3 em movimento ao mesmo tempo.
- **Regra do 1/3 (distância):** nenhum movimento cruza mais de 1/3 da tela sem uma mudança de keyframe (arco, variação de velocidade).
- **Contra-movimento:** herói vai para a direita → fundo desliza para a esquerda a 20–30% da velocidade (profundidade). Parallax: frente 1×, meio 0,5×, fundo 0,2×.
- **Movimento causal:** cada movimento é lançado pelo anterior — clique → squash → solta spring → voo → impacto → recuo → revelação. Efeitos começam NO frame da causa, nunca "logo depois".
- **Título pousado fica morto de parado.** O movimento migra para o próximo elemento, a câmera ou o mundo atrás.
- Arcos > linhas retas para coisas orgânicas; retas para UI/mecânico.
- Hero do plano ocupa ≥ 40% da altura ou largura do quadro. Objeto pequeno no meio do vazio nunca é um plano — aproxime, corte ou dê um mundo.

## 6. Os 12 princípios (Disney) aplicados

| Princípio | Em motion graphics |
|---|---|
| Squash & stretch | botão clicado (0,97 → 1,04/0,96 → 1); personagem pousando. Nunca em texto de leitura |
| Antecipação | recuo de 2–4 frames antes de um movimento grande (cursor recua antes de arrastar) |
| Encenação (staging) | um foco por quadro; o resto escurece/desfoca/para |
| Pose a pose / direto | keyframes explícitos (pose a pose) para controle; simulação para partículas |
| Follow-through / overlap | filhos chegam 50–150ms depois do pai (sombra depois do card, conteúdo depois do container) |
| Slow in / slow out | easing — nunca linear em deslocamento espacial |
| Arcos | trajetórias curvas para objetos "vivos" |
| Ação secundária | sombra que encolhe enquanto o objeto sobe; ícone que desce 2px no clique |
| Timing | define peso e emoção (ver tabelas) |
| Exagero | 10–30% em playful; 0% em premium |
| Desenho sólido | volume/perspectiva consistentes; sombras de contato |
| Apelo | formas claras, silhueta legível, personalidade consistente |

## 7. Lei da costura (continuidade)

Para o vídeo parecer UM movimento de câmera contínuo, não uma pilha de slides:

1. **Eixo:** x continua x, y continua y, Z continua Z.
2. **Direção:** nunca espelhe. Em Z, direção = sinal da mudança de escala (crescer = empurrar para frente; encolher = recuar). Saída que encolhe + entrada que cresce do pequeno = vetor espelhado (o erro mais comum).
3. **Velocidade:** velocidade inicial da entrada ≈ velocidade final da saída (eases espelhados: saída `power3.in` + entrada `power3.out`).
4. **Fase:** o corte acontece NO MEIO do movimento dos dois lados. Assentar antes do corte ou começar do repouso depois dele = beat morto.

**A corrente:** escolha UMA direção dominante (ex.: esquerda = "próximo"). Outras direções são reservadas e têm significado: para cima = elevação/conclusão; Z para frente = aprofundar; Z para trás = chegada de algo maior; explosão de escala = sair de um mundo. Nunca alterne direções consecutivas (ping-pong parece erro). Mudança de direção precisa de causa visível (clique, impacto) ou de virada de capítulo.

**Carregadores:** o olho segue objetos. As melhores costuras passam um objeto concreto pelo corte na mesma posição e velocidade (o cursor no meio do caminho, um container que encolhe e acopla no próximo layout, uma marca que voa para o seu lugar).

## 8. Transições com causa (catálogo)

Use **2–4 tipos por filme** e repita-os; cada um causado por algo na tela. No máximo 1/3 das costuras entre beats são cortes secos; mundos nunca fazem crossfade entre si.

| Transição | Construção | No kit / Remotion |
|---|---|---|
| **Chicote (whip)** | as duas cenas deslizam juntas 0,13–0,4s com blur de pico no meio; a que chega pousa borrada e nitidifica | `whip({direction})` |
| **Zoom através** | câmera vai até um botão com blur (0,6s), o botão escala de ~8% a ~250% em 0,35s (ease-in forte); seu preenchimento vira o próximo quadro | `zoomThrough()` |
| **Objeto vira mundo** | pílula/card cresce além do quadro em 0,65s (inOut), raio diminuindo; o entorno desfoca ~15px | composição manual (Camera + scale) |
| **Morph** | um container alarga e vira o próximo (ícone → caixa de prompt, ~110 → ~880px em 0,2s) com blur horizontal 12 → 0 | manual |
| **Carregar através** | o resultado encolhe 1 → 0,6 com blur de pico 6px e pousa dentro do próximo app | manual |
| **Inundação de cor** | o herói fica; o chão inteiro troca de cor em ~0,4s (inOut) | `colorFlood({color})` |
| **Íris do clique** | `clip-path: circle()` abre do ponto clicado em ~0,15–0,35s | `irisAt({x,y})` |
| **Dip cut** | a saída escurece ~40% por 3 frames antes do corte seco — o corte parece intencional | `dipCut()` |
| **Blur swap num palco** | sai: opacidade→0 com ~8px blur em 0,13–0,2s; entra: blur→0 em 0,13s; o chão não corta | KineticText `exitAt` + nova entrada |
| **Match cut** | uma forma se mantém (círculo → lente → logo) enquanto tudo em volta troca | manual |
| Fade / slide / wipe / flip / clockWipe / iris | prontos | `@remotion/transitions/*` |

O pacote `@remotion/transitions` (v4.0.5xx) também traz `blurSlide`, `zoomBlur`, `crossZoom`, `filmBurn`, `dissolve`, `swap`, `pushCut`, `zoomInOut`, `ripple`, `crosswarp`, `bookFlip` — vários são shaders (exigem HtmlInCanvas/WebGL); teste o render antes de depender deles.

## 9. Movimento sustentado (entre a entrada e a saída)

Loops ociosos (respirar, flutuar, pulsar glow) como "movimento" são **banidos** em títulos e UI — parecem "o vídeo está esperando". Uma cena que termina de entrar com segundos sobrando é bug de planejamento: adicione história, não balanço. Cada fase pertence a uma rota:

| Rota | O que é |
|---|---|
| Revelações em etapas | segure conteúdo e pague nos beats da narração — o quadro continua ganhando informação |
| Câmera com intenção | escala+pan mapeados: estabelece aberto → viaja → chega no sujeito (`<Camera>`) |
| Vida sequenciada da UI | o produto se comporta: progresso avança, destaques andam, contadores sobem |
| Sequências animadas | elementos encenam um beat: um card se arquiva numa pilha, um resultado se monta |
| Ação guiada por cursor | cursor grande leva o olho até um gatilho; o CLIQUE dispara o próximo beat |

Exceções aceitáveis: órbita lenta do fundo/palco (3–5°/s), footage tocando, personagem atuando (respiração de personagem é atuação), mundo 3D girando, grão de filme.

Teste: pause em qualquer segundo — algo significativo deve estar no meio do voo.

## 10. Traduzindo feedback do usuário

| O usuário diz | Mude |
|---|---|
| "rápido demais" | desacelere todo zoom/pan para 0,7× da velocidade; só isso |
| "acelera" | acelere o conteúdo E encurte o beat na mesma proporção; beats seguintes sobem |
| "os títulos se mexem" | pouse-os e segure-os parados até sair |
| "parece slide/PowerPoint" | entre na próxima cena por um objeto na tela; corte movimentos no meio do voo |
| "parece barato/genérico" | ache os tells (direcao-criativa §8), troque o look por um MEIO (papel, riso, produto) |
| "está poluído" | remova 1/3 do movimento; mantenha os que guiam o olho |
| "sem graça/flat" | falta camada secundária (sombra, follow-through) ou câmera com intenção |
| "não dá para ler" | mais tempo (0,5s+0,3s/palavra), menos palavras, tipo maior — nunca encolher o tipo |
