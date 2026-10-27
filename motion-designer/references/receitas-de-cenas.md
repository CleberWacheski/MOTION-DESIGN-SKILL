# Receitas de cenas — padrões prontos (Remotion + kit)

Cada receita: quando usar, como construir, armadilhas. Os componentes vêm de `src/kit` (copiado pelo `new-project.mjs`). Importe de `"./kit"` (ou `"../kit"` dentro de `scenes/`).

> Antes de escrever uma cena: qual é o UM movimento-herói? O que o olho vê primeiro? Como ela PASSA para a próxima (carregador/direção)? Se não souber responder, volte ao SPEC.

## Índice
1. Gancho tipográfico (frase cinética)
2. Número que aterrissa
3. Gráfico que se constrói
4. Demo de UI com cursor
5. Diagrama que cresce
6. Antes × depois
7. Mito derrubado (riscado → certo)
8. Lista sem bullets (um item por plano)
9. Citação/pôster
10. Código que se escreve
11. Linha do tempo / processo
12. Zoom infinito / mergulho
13. Kinetic typography no ritmo da fala
14. Logo reveal / end card
15. Legendas estilo TikTok
16. Contagem regressiva / título de capítulo
17. Mapa / rota
18. Visualizador de áudio (audiograma)

---

## 1. Gancho tipográfico

Frase de ≤ 6 palavras, uma palavra no accent, entrada `mask` (energia) ou `blur` (elegância). Frame 0 já com conteúdo (`start` negativo).

```tsx
<Background>
  <AbsoluteFill style={{ justifyContent: "center", padding: width * 0.1 }}>
    <KineticText text="Você está perdendo 70% do público" mode="mask" start={-10} size={ts.hero * 0.7} accentWords={[3]} />
  </AbsoluteFill>
</Background>
```
Variação forte: a ÚLTIMA palavra vira a imagem (ex.: "…seu dinheiro **cresce**" → a palavra vira um gráfico subindo via Camera/escala).
Armadilha: frase longa demais; título que continua deslizando depois de pousar.

## 2. Número que aterrissa

O número é a maior coisa da tela; conta 1,2–1,6s e PARA; fonte na tela.
```tsx
<CountUp to={4.2} decimals={1} suffix=" bi" size={ts.hero * 1.5} label="de pessoas usam X por mês" source="Relatório Y, 2026" />
```
Torne físico depois: o número vira uma pilha, uma multidão de pontos, uma barra que é o chão da próxima cena. Nunca vários números contando ao mesmo tempo. Formatação pt-BR (`Intl.NumberFormat("pt-BR")`).

## 3. Gráfico que se constrói

Ordem de leitura: eixo → linha de referência → dados entrando → UMA anotação no ponto que importa. Uma série destacada, o resto cinza. Sem legenda; o rótulo vai na marca. O título do gráfico diz a conclusão ("Vendas dobraram após X"), não o tema ("Vendas por mês").
```tsx
<BarChart data={DATA.chart} highlight={2} annotation="+112%" width={width*0.8} height={height*0.55} start={10} format={(v)=>`${v}%`} />
```
Linha: SVG `path` com `LineDraw` (pathLength) + ponto final com spring. Pizza é tell — prefira barra ou "1 de cada 4" com ícones de pessoas. Para gráficos complexos: D3 para calcular escalas/paths e Remotion para animar pelo frame (nunca transições do D3).

## 4. Demo de UI com cursor

Reconstrua SÓ o pedaço da UI que o beat usa, em 1,6–2× do tamanho real. Câmera aproxima (0,4–0,6s com blur) do controle que o cursor vai usar e SEGURA enquanto a UI age. Cursor grande (4–7% da largura) entra de fora; o clique causa a próxima coisa NO MESMO FRAME (som de clique 1 frame depois do visual).
```tsx
const clickAt = sec(2, fps);
<Camera keys={[{ f: 0, scale: 1 }, { f: sec(1.6, fps), scale: 1.25, x: -120 }]}>
  <MeuPainel pressed={frame >= clickAt} />
</Camera>
<Cursor keys={[{ f: 0, x: width*1.05, y: height*0.9 }, { f: sec(1.6,fps), x: 980, y: 540 }, { f: clickAt, x: 980, y: 540, click: true }]} />
```
Saída da cena: `irisAt({x,y})` a partir do ponto clicado, ou o botão "vira o mundo" (escala até cobrir o quadro). Use telas REAIS (screenshots do usuário) quando existirem; se faltar, placeholder rotulado ("Screenshot: Configurações → Exportar").

## 5. Diagrama que cresce

Comece pela figura verdadeira mais simples e adicione UMA parte por beat, quando ela é nomeada (na narração ou no título). Conexões com `LineDraw` (+ `arrow`). Rótulos ficam SOBRE a parte, aparecendo com ela. Nunca o diagrama inteiro de uma vez.
Transformação contínua: cada passo morfa do anterior (uma barra vira eixo, um ponto vira população) — o espectador nunca perde o fio.

## 6. Antes × depois

O lado "antes" se agita/caotiza (muitos elementos, cinza, lento), o "depois" se move calmo e limpo (accent). Divisor que varre (wipe com `clipPath: inset()`) ou split screen que colapsa para o lado novo. Nunca zombe de um concorrente nomeado.

## 7. Mito derrubado

A frase errada aparece normal → um traço a risca (`LineDraw` horizontal ou `@remotion/rough-notation` `<StrikeThrough>`/`<CrossedOff>`) → a frase certa é "impressa" por cima/abaixo com accent. Pausa de 0,3–0,5s entre riscar e corrigir (vírgula dramática).

## 8. Lista sem bullets

Nunca slide de bullets. Cada item ganha SEU plano e SUA ideia visual (um ícone grande, um objeto, um número), na mesma corrente de transição (`whip` left). Contador discreto "1/3" opcional. Se os itens são paralelos, uma composição única que se reconstrói (o mesmo palco trocando o herói) evita a sensação de slides.

## 9. Citação / pôster

Citação curta como pôster tipográfico (tipo grande, aspas gráficas enormes no accent, atribuição pequena). Entrada `ink` (cinza → tinta, palavra por palavra no ritmo da leitura). Respeite direitos autorais: citações curtas com crédito; não reproduza trechos longos de livros.

## 10. Código que se escreve

`Typewriter` (mono, ≥ 26px a 1080p) num "editor" reconstruído (fundo, números de linha). Para código real, mostre 3–8 linhas, destaque a linha que importa (faixa accent atrás via `Highlighter`/retângulo animado), escureça o resto. Diffs: linhas removidas recolhem (altura → 0, vermelho), adicionadas expandem (verde). Para highlighting real use `shiki`/`prism` gerando spans estáticos e anime revelação por linha.

## 11. Linha do tempo / processo

Uma linha (`LineDraw`) é a estrada; a câmera (`Camera` com x keys) viaja por ela; cada marco pousa quando a câmera chega (stagger por posição, não por tempo fixo). Datas em tabular-nums.

## 12. Zoom infinito / mergulho

A câmera mergulha num detalhe (escala 1 → 8+, `EASE.leave` no fim) que se revela ser o próximo mundo (a próxima cena entra um pouco pequena e cresce até assentar — mesmo sinal: crescendo dos dois lados). Componha as duas cenas para que o detalhe e o novo mundo coincidam em posição. Use `zoomThrough()` como atalho.

## 13. Kinetic typography no ritmo da fala

Com narração: cada palavra-chave entra NO TEMPO da palavra falada (use `words[].startMs` do `voiceover.ts`: `start = Math.round(w.startMs/1000*fps)`). Não escreva tudo o que é dito — só as palavras-âncora (2–5 por frase). Varie: escala da palavra-herói (60–90% da largura), rotação 90° para mudar de eixo, palavra que empurra a anterior para fora. Trabalhe em 3D (aproximar/afastar em Z), não só em X/Y.

## 14. Logo reveal / end card

`EndCard` = marca com peso (spring heavy) → wordmark por wipe → CTA pousa e segura 1,5–3s. Variações: cursor clica na marca e um preenchimento sobe por ela; a marca é carregada pelo carregador do filme; linhas do logo se desenham (`LineDraw` sobre o SVG do logo). Logo é SEMPRE o arquivo oficial (SVG/PNG), nunca redesenhado.

## 15. Legendas estilo TikTok

`<Captions words={voById("hook").words} maxWordsPerPage={3} uppercase />` dentro da MESMA `<Sequence>` do áudio da cena. Palavra ativa em accent, contorno para ler em qualquer fundo, dentro da zona segura vertical (y 210–1600 de 1920). Tempos exatos: ElevenLabs with-timestamps (tts.mjs) ou Whisper.

## 16. Título de capítulo / contagem

Capítulo: número grande + 1–2 palavras, segura 0,4–0,8s, sai com o movimento da corrente. Contagem regressiva: cada dígito com `mask`, troca no beat da música.

## 17. Mapa / rota

Mapa estático (imagem/SVG) + rota com `LineDraw` + marcadores com spring + câmera viajando. Mapas reais e voos 3D: skill oficial `/remotion-maps` (MapLibre/MapTiler/Mapbox/Cesium) — prepare os dados GeoJSON antes.

## 18. Audiograma / visualizador

`@remotion/media-utils` (`useAudioData` + `visualizeAudio`) para barras/onda a partir do áudio. Como imagem PRINCIPAL é tell (exceto audiograma de podcast, onde é o formato esperado). Template oficial: "Audiogram" (`npx create-video --audiogram`).

---

## Esqueleto de uma cena

```tsx
import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";
import { Background, KineticText, EASE, prog, sec, typeScale, useTheme } from "../kit";

export const Proof: React.FC<{ line: string }> = ({ line }) => {
  const frame = useCurrentFrame();             // 0 no início DESTA cena
  const { fps, width, height } = useVideoConfig();
  const t = useTheme();
  const ts = typeScale(width, height);
  const vertical = height > width;
  const hero = prog(frame, sec(0.2, fps), sec(0.6, fps), EASE.arrive); // o movimento-herói
  return (
    <Background>
      <AbsoluteFill style={{ padding: width * 0.1, justifyContent: "center", flexDirection: vertical ? "column" : "row" }}>
        {/* herói (≥40% do quadro) */}
        {/* secundário: começa 100–200ms depois, viaja 50–70% */}
        <KineticText text={line} mode="blur" size={ts.h1} start={sec(0.4, fps)} />
      </AbsoluteFill>
    </Background>
  );
};
```
