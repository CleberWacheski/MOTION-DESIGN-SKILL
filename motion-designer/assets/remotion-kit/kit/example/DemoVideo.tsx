/**
 * DemoVideo — vídeo-exemplo (~17s) que mostra a ESTRUTURA recomendada:
 *  - dados/copy num só objeto (SCRIPT) → fácil trocar texto e reaproveitar;
 *  - uma cena = um componente; TransitionSeries no topo;
 *  - transições com causa, numa "corrente" (para a esquerda);
 *  - tamanhos derivados do quadro (funciona em 16:9 e 9:16).
 * Use como referência de padrões, não como template visual a copiar.
 */
import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";
import { TransitionSeries, linearTiming } from "@remotion/transitions";
import {
  Background,
  BarChart,
  Camera,
  CountUp,
  Cursor,
  EndCard,
  EASE,
  Highlighter,
  KineticText,
  LineDraw,
  SafeAreaGuide,
  ThemeProvider,
  defaultTheme,
  irisAt,
  prog,
  sec,
  typeScale,
  whip,
  zoomThrough,
} from "..";

/* ------------------------------------------------------------- DADOS -- */
export const SCRIPT = {
  hook: { line: "O primeiro frame decide tudo", accent: [2] },
  stat: { value: 85, suffix: "%", label: "dos vídeos sociais são vistos sem som", source: "exemplo ilustrativo" },
  chart: {
    title: "Retenção por segundo",
    data: [
      { label: "0s", value: 100 },
      { label: "1s", value: 72 },
      { label: "3s", value: 51 },
      { label: "10s", value: 34 },
    ],
    highlight: 1,
    annotation: "-28% no 1º segundo",
  },
  cta: { name: "motion", cta: "Comece pelo gancho" },
};

/* ------------------------------------------------------------ DURAÇÕES -- */
const S = { hook: 3.4, stat: 3.2, chart: 4, ui: 3.4, diagram: 3.4, end: 3 }; // segundos
const T = { whip: 0.4, iris: 0.35, zoom: 0.5 };

export const demoDuration = (fps: number) =>
  Object.values(S).reduce((a, s) => a + sec(s, fps), 0) - sec(T.whip, fps) * 2 - sec(T.iris, fps) - sec(T.zoom, fps) - sec(T.whip, fps);

/* -------------------------------------------------------------- CENAS -- */
const Hook: React.FC = () => {
  const { width, height } = useVideoConfig();
  const ts = typeScale(width, height);
  return (
    <Background>
      <AbsoluteFill style={{ justifyContent: "center", padding: width * 0.1 }}>
        {/* start negativo: o frame 0 (thumbnail) já tem conteúdo */}
        <KineticText text={SCRIPT.hook.line} mode="mask" start={-12} size={ts.hero * 0.72} accentWords={SCRIPT.hook.accent} staggerSec={0.08} />
      </AbsoluteFill>
    </Background>
  );
};

const Stat: React.FC = () => {
  const { width, height } = useVideoConfig();
  const ts = typeScale(width, height);
  const t = defaultTheme;
  return (
    <Background color={t.colors.ink}>
      <ThemeProvider theme={{ ...t, colors: { ...t.colors, ink: t.colors.ground, ground: t.colors.ink } }}>
        <AbsoluteFill style={{ justifyContent: "center", padding: width * 0.1 }}>
          <CountUp to={SCRIPT.stat.value} suffix={SCRIPT.stat.suffix} size={ts.hero * 1.6} label={SCRIPT.stat.label} source={SCRIPT.stat.source} start={6} />
        </AbsoluteFill>
      </ThemeProvider>
    </Background>
  );
};

const Chart: React.FC = () => {
  const { width, height } = useVideoConfig();
  const ts = typeScale(width, height);
  const vertical = height > width;
  return (
    <Background>
      <AbsoluteFill style={{ padding: width * 0.1, justifyContent: "center", gap: height * 0.05 }}>
        <KineticText text={SCRIPT.chart.title} mode="ink" size={ts.h1} />
        <BarChart
          data={SCRIPT.chart.data}
          start={10}
          width={width * 0.8}
          height={vertical ? height * 0.45 : height * 0.55}
          highlight={SCRIPT.chart.highlight}
          annotation={SCRIPT.chart.annotation}
          format={(v) => `${v}%`}
          labelSize={ts.body * 0.8}
        />
      </AbsoluteFill>
    </Background>
  );
};

const UI: React.FC = () => {
  const frame = useCurrentFrame();
  const { width, height, fps } = useVideoConfig();
  const ts = typeScale(width, height);
  const t = defaultTheme;
  const bx = width / 2;
  const by = height / 2;
  const clickAt = sec(2, fps);
  const pressed = frame >= clickAt;
  const push = prog(frame, sec(0.2, fps), sec(1.4, fps), EASE.move);
  return (
    <Background color={t.colors.groundAlt}>
      <Camera keys={[{ f: 0, scale: 1 }, { f: sec(1.6, fps), scale: 1.25 }]}>
        <AbsoluteFill style={{ alignItems: "center", justifyContent: "center" }}>
          <div
            style={{
              background: pressed ? t.colors.accent : t.colors.ink,
              color: t.colors.accentInk,
              fontFamily: t.fonts.display,
              fontWeight: t.weights.bold,
              fontSize: ts.h2,
              padding: `${ts.h2 * 0.45}px ${ts.h2 * 1}px`,
              borderRadius: 999,
              transform: `scale(${pressed ? 1.04 : 1})`,
              opacity: 0.4 + 0.6 * push,
            }}
          >
            Gerar vídeo
          </div>
        </AbsoluteFill>
      </Camera>
      <Cursor
        keys={[
          { f: 0, x: width * 1.05, y: height * 0.95 },
          { f: sec(1.6, fps), x: bx + ts.h2 * 0.8, y: by },
          { f: clickAt, x: bx + ts.h2 * 0.8, y: by, click: true },
        ]}
      />
    </Background>
  );
};

const Diagram: React.FC = () => {
  const { width, height } = useVideoConfig();
  const ts = typeScale(width, height);
  const steps = ["Ideia", "Roteiro", "Vídeo"];
  const w = width * 0.8;
  return (
    <Background>
      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center" }}>
        <div style={{ position: "relative", width: w, height: ts.h1 * 3 }}>
          <LineDraw d={`M ${w * 0.12} ${ts.h1 * 1.5} L ${w * 0.88} ${ts.h1 * 1.5}`} width={w} height={ts.h1 * 3} start={4} durationSec={1.6} strokeWidth={6} arrow />
          {steps.map((s, i) => (
            <div key={s} style={{ position: "absolute", left: (w * (0.12 + i * 0.38)) - ts.h2 * 2, width: ts.h2 * 4, top: ts.h1 * 1.5 - ts.h2 * 2.2, textAlign: "center" }}>
              <KineticText text={s} mode="blur" size={ts.h2} start={4 + i * 16} align="center" />
            </div>
          ))}
        </div>
        <div style={{ fontFamily: defaultTheme.fonts.body, fontSize: ts.body, marginTop: ts.body, color: defaultTheme.colors.ink }}>
          um passo por <Highlighter start={50}>batida</Highlighter>
        </div>
      </AbsoluteFill>
    </Background>
  );
};

const End: React.FC = () => (
  <Background>
    <EndCard name={SCRIPT.cta.name} cta={SCRIPT.cta.cta} start={4} />
  </Background>
);

/* -------------------------------------------------------- COMPOSIÇÃO -- */
export const DemoVideo: React.FC<{ showGuides?: boolean }> = ({ showGuides = false }) => {
  const { fps } = useVideoConfig();
  const tl = (s: number) => linearTiming({ durationInFrames: sec(s, fps), easing: EASE.move });
  return (
    <ThemeProvider theme={defaultTheme}>
      <TransitionSeries>
        <TransitionSeries.Sequence durationInFrames={sec(S.hook, fps)}>
          <Hook />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition presentation={whip({ direction: "left" })} timing={tl(T.whip)} />
        <TransitionSeries.Sequence durationInFrames={sec(S.stat, fps)}>
          <Stat />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition presentation={whip({ direction: "left" })} timing={tl(T.whip)} />
        <TransitionSeries.Sequence durationInFrames={sec(S.chart, fps)}>
          <Chart />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition presentation={zoomThrough()} timing={tl(T.zoom)} />
        <TransitionSeries.Sequence durationInFrames={sec(S.ui, fps)}>
          <UI />
        </TransitionSeries.Sequence>
        {/* a íris abre de onde o cursor clicou: transição com causa */}
        <TransitionSeries.Transition presentation={irisAt({ x: "55%", y: "50%" })} timing={tl(T.iris)} />
        <TransitionSeries.Sequence durationInFrames={sec(S.diagram, fps)}>
          <Diagram />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition presentation={whip({ direction: "left" })} timing={tl(T.whip)} />
        <TransitionSeries.Sequence durationInFrames={sec(S.end, fps)}>
          <End />
        </TransitionSeries.Sequence>
      </TransitionSeries>
      <SafeAreaGuide show={showGuides} />
    </ThemeProvider>
  );
};
