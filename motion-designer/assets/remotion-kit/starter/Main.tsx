/**
 * Main.tsx — composição principal. Uma cena = um componente.
 * Substitua as cenas de exemplo pelas do SPEC.md (linha SHOTS).
 */
import React from "react";
import { AbsoluteFill, useVideoConfig } from "remotion";
import { TransitionSeries, linearTiming } from "@remotion/transitions";
import { DATA } from "./data";
import { Background, EASE, EndCard, KineticText, SafeAreaGuide, ThemeProvider, defaultTheme, sec, typeScale, whip } from "./kit";

const TRANSITION_SEC = 0.4;

export const mainDuration = (fps: number) =>
  DATA.scenes.reduce((a, s) => a + sec(s.seconds, fps), 0) - (DATA.scenes.length - 1) * sec(TRANSITION_SEC, fps);

const LineScene: React.FC<{ line: string; mode?: "mask" | "blur" | "ink"; first?: boolean }> = ({ line, mode = "blur", first }) => {
  const { width, height } = useVideoConfig();
  const ts = typeScale(width, height);
  return (
    <Background>
      <AbsoluteFill style={{ justifyContent: "center", padding: width * 0.1 }}>
        {/* na primeira cena, start negativo garante frame 0 (thumbnail) com conteúdo */}
        <KineticText text={line} mode={mode} size={ts.h1 * 1.3} start={first ? -10 : 4} />
      </AbsoluteFill>
    </Background>
  );
};

export const Main: React.FC<{ showGuides?: boolean }> = ({ showGuides = false }) => {
  const { fps } = useVideoConfig();
  const timing = linearTiming({ durationInFrames: sec(TRANSITION_SEC, fps), easing: EASE.move });
  const [hook, ideia, fim] = DATA.scenes;
  return (
    <ThemeProvider theme={defaultTheme}>
      <TransitionSeries>
        <TransitionSeries.Sequence durationInFrames={sec(hook.seconds, fps)}>
          <LineScene line={hook.line} mode="mask" first />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition presentation={whip({ direction: "left" })} timing={timing} />
        <TransitionSeries.Sequence durationInFrames={sec(ideia.seconds, fps)}>
          <LineScene line={ideia.line} mode="ink" />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition presentation={whip({ direction: "left" })} timing={timing} />
        <TransitionSeries.Sequence durationInFrames={sec(fim.seconds, fps)}>
          <Background>
            <EndCard name={DATA.title} cta={fim.line} start={4} />
          </Background>
        </TransitionSeries.Sequence>
      </TransitionSeries>
      <SafeAreaGuide show={showGuides} />
    </ThemeProvider>
  );
};
