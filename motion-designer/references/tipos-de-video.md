# Tipos de vídeo — a forma de cada um

Leia a linha do tipo que bate com o pedido. Para história/beats gerais: `direcao-criativa.md`.

## Índice
1. Explainer / "como funciona" / tutorial
2. Lançamento / promo / feature
3. Dados / números / relatório
4. Vertical / social (Reels, TikTok, Shorts)
5. Resumo de livro
6. Resumo de pesquisa / artigo / notícia
7. Código / PR / changelog / produto dev
8. Kinetic typography / citação / manifesto
9. Vinheta / intro / logo reveal / bumper
10. Vídeo com música (clipe, beat-sync)
11. Slides animados / apresentação
12. Personagem / mascote / história curta
13. Legendas e overlays sobre footage (talking head, podcast)
14. 3D / simulação / generativo

---

## 1. Explainer (30–90s)

UMA ideia entendida no fim. O espinho é UM exemplo concreto trabalhado do início ao fim, não um tour de fatos.
- **Ancore primeiro:** comece onde o espectador está (uma pessoa, um lugar, uma pergunta que ele faria). O dispositivo abstrato (gráfico, modelo, máquina) entra DENTRO da situação como a resposta; o filme volta à pessoa no fim com a resposta.
- Dispositivos: o objeto É a explicação · um diagrama que cresce · transformação contínua · o exemplo trabalhado.
- Formas de informação (escolha a forma antes da imagem): número que pousa · mito derrubado · antes/depois · muitos convergindo em poucos grupos · rede que adensa · um escolhido entre muitos · passos em ordem · screenshot real com detalhe circulado · citação como pôster · cartão de capítulo.
- Narrado: a voz é o relógio; revele cada parte quando a voz a nomeia; cena ≈ até 19 palavras faladas. Sem narração: linhas grandes até ~10 palavras.
- Rótulos sobre a parte que nomeiam (com linha guia), aparecem com ela. Sem legendas de gráfico, sem bullets.
- Cheque a ciência/lógica de cada passo antes de animar — um diagrama bonito e errado é pior que nenhum.
- Termine na ideia em uma linha. Sem end card de marca a menos que pedido.
- Tells: slide de bullets; ícones em círculos; três cards; o diagrama inteiro de uma vez; narrador repetindo o texto da tela.

## 2. Lançamento / promo (20–45s)

Forma: gancho → tensão → revelação → prova (3–6 verbos) → payoff → tese → end card (tabela em `direcao-criativa.md` §4).
- **UI real, nunca mockup.** Fontes: gravação/screenshots do usuário; Figma; o site do produto; o código/docs para confirmar rótulos de hoje. Falta tela: placeholder rotulado e dito na resposta. Feature sem nada visível (velocidade, API): UI real que a expõe, saída real de terminal, um análogo real, ou checklist de fatos reais.
- Reconstrua só o pedaço que o beat usa, 1,6–2× maior; câmera alterna janela → painel → punch-in no controle; containers morfam em vez de cortar; cursor grande cujo clique causa o próximo beat.
- End card nos últimos 5–10%: lockup 15–30% da largura, encenado (não fade), CTA real segurando 1,5–3s.
- Tells: digitar num prompt como abertura; lista de features em três cards; título sobre screenshot escurecida; dashboard inventado; logo docado.

## 3. Dados / relatório

- Um número de cada vez, conquistado pela cena anterior, depois tornado físico (contagem que vira skyline, porcentagem que vira multidão).
- O número é a maior coisa; tabular-nums; conta 1,2–1,6s e segura; fonte pequena na tela; um módulo de dados (`data.ts`) alimenta todos os números (eles concordam entre si).
- Gráfico em ordem de leitura; destaque UMA série; o título diz a conclusão; anote na marca, sem legenda.
- O mesmo objeto carrega entre beats (uma barra vira o chão da próxima cena; uma linha vira a estrada da câmera). A câmera pode mergulhar no valor que importa.
- Tells: grade de KPIs; dashboard; pizza; todos os números contando juntos; números sem fonte.

## 4. Vertical / social (9:16)

Ver `formatos-plataformas.md`. Gancho no 1º segundo (frame 0 = thumbnail), legendas para fala, um sujeito empilhado, tipo maior, planos de 1–2s, payoff antes do swipe, zona segura universal.

## 5. Resumo de livro

- Tese central em uma frase + no MÁXIMO 3 ideias-chave + uma história/exemplo do livro que materializa a tese.
- Dispositivo forte: "um dia na vida aplicando a ideia" ou "mito derrubado". Look a partir do livro (capa, época, assunto) — sem reproduzir a capa como arte; título e autor em tipo.
- Direitos autorais: parafraseie; no máximo uma citação curta, creditada. Não transcreva capítulos.
- Fecho: a ação concreta que o espectador pode fazer amanhã.
- Duração: 45–90s (horizontal) ou 30–60s (vertical, série "1 ideia por vídeo").

## 6. Resumo de pesquisa / artigo / notícia

- Pergunta → como descobriram (1 linha) → o achado (o número) → o que isso muda → a ressalva honesta.
- Fonte na tela (autor/instituição/ano). Não extrapole além do estudo; correlação ≠ causa.
- Visual: gráfico que se constrói, mapa, "1 em cada N" com ícones; manchete como pôster tipográfico.
- Pesquise a fonte original quando o usuário trouxer só o tema; anote as URLs no PROJECT.md.

## 7. Código / PR / changelog

- O que mudou + por que importa + o antes/depois OBSERVÁVEL (tempo de build, erro sumindo, UI nova).
- Código real, curto (3–8 linhas por quadro), legível (≥ 26px), linha importante destacada, resto esmaecido; diff animado.
- Terminal real (saída de comando real); números de benchmark reais.
- Para repositórios/PRs: leia o diff/commits/README para extrair a história; nunca invente API ou rótulo.

## 8. Kinetic typography / citação / manifesto

- O tipo É a imagem: escala extrema (palavra-herói 60–90% da largura), contraste de pesos, mudança de eixo (rotação 90°), uso de Z (aproximar/afastar), palavras empurrando palavras.
- No ritmo da fala ou da música (palavras-âncora nos tempos). Varie o ritmo: segure umas linhas mais que outras; uma surpresa/virada.
- Revise ortografia três vezes.
- Paleta mínima (chão + tinta + 1 accent), grid rígido ou quebra intencional.

## 9. Vinheta / intro / bumper (3–8s)

Uma ideia só; o logo é o herói e chega com peso (spring heavy, wipe, desenho de linhas, montagem a partir de formas). Som: riser → impacto no pouso. Versões com e sem fundo (transparente ProRes 4444 para usar em editor). Loop opcional.

## 10. Vídeo com música

- A estrutura da música é a estrutura da edição: intro, verso, refrão, ponte, fim = capítulos. Densidade de cortes segue a energia (mais lentos no verso, um quadro por tempo forte no refrão, imagem segurada no breakdown).
- O refrão volta a um palco-base e escala a cada retorno; o fim rima com a abertura.
- Grade de beats com `beatFrame()`; cortes no beat, layout no compasso. Não corte em TODO beat.
- Letra na tela só se pedido (cada linha segura ≥ 1 beat, composta como tipo, não legenda). Respeite direitos da música (use faixa licenciada).
- Tells: a mesma treatment por > 6s; espectro/forma de onda como imagem principal; cortar em todo beat.

## 11. Slides animados / apresentação

Cada slide = uma Sequence; título + 1 visual; build progressivo por clique simulado (ou exporte cada "slide" como clipe e avance na apresentação). Transições discretas e consistentes (1–2 tipos). Se o usuário quer um DECK editável, sugira o formato de slides próprio (não vídeo).

## 12. Personagem / mascote

- O personagem dá causa a cada transição e faz as piadas. Mudança de humor passa por uma "tomada": antecipação, squash, nova cara, assentamento — nunca troca seca.
- Squash/stretch, antecipação, overshoot e follow-through pertencem ao personagem (aqui respiração/piscar é vida, não tell). Desloque as partes (cabeça lidera, braços seguem), nunca tudo na mesma curva.
- Contato vende: pés no chão, objetos na mão, olhos no que olham.
- Rig = parâmetros ao longo do tempo (posição, squash, ângulos, estado de olho/boca por momento). Traço "fervendo" à mão: redesenhe contornos ~12×/s com jitter seedado por `Math.floor(t*12)`.
- Personagens de After Effects: Lottie. Não desenhe personagens protegidos de terceiros.

## 13. Legendas e overlays sobre footage

- Talking head: punch-ins na ênfase (escala 1 → 1,12 num wrapper), b-roll cortado na frase, rosto NUNCA sob um card, cards de informação legíveis em ~2,5s e depois parados.
- Legendas palavra a palavra (`<Captions>`), tempos por Whisper, revisadas.
- Podcast: ache o trecho de 30–60s mais forte; audiograma com legenda + waveform discreta + capa.
- Corte de silêncios: FFmpeg `silencedetect` ou skill oficial (silence-detection).

## 14. 3D / simulação / generativo

- 3D quando o filme merece (o objeto/set é o payoff, um produto, uma simulação que explica). `@remotion/three`.
- Determinístico: desenhe cada frame a partir do tempo; simule uma vez na carga em arrays e consulte o estado em `t`; tudo seedado.
- Um objeto-herói > uma multidão. Mergulhe nele em vez de orbitar ("um mergulho vale dez voltas"). Cortes, vistas explodidas e capítulos com uma linha de legenda + rótulos com números reais transformam simulação em explicação.
- Luz: key quente, rim frio, ambiente escuro com 2–3 faixas suaves; sombra de contato; bloom só nos pontos mais brilhantes; rugosidade ≥ 0,45 em metal sob luz baixa.
