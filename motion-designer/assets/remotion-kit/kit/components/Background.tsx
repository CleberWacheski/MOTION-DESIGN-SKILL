import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { useTheme } from "../ThemeContext";

/**
 * Background — o "mundo" da cena. Fundo vem de um MEIO (papel, produto, cor chapada),
 * não de efeitos. Gradiente linear de tela cheia em fundo escuro dá BANDING no H.264:
 * prefira sólido, radial suave, ou sólido + grão.
 */
export const Background: React.FC<{
  color?: string;
  /** radial suave a partir de um ponto (ex.: "30% 20%") com uma segunda cor */
  radial?: { at: string; color: string; size?: string };
  grain?: number; // sobrescreve theme.grain
  children?: React.ReactNode;
}> = ({ color, radial, grain, children }) => {
  const t = useTheme();
  const bg = color ?? t.colors.ground;
  return (
    <AbsoluteFill style={{ background: bg }}>
      {radial ? (
        <AbsoluteFill
          style={{
            background: `radial-gradient(${radial.size ?? "80% 80%"} at ${radial.at}, ${radial.color} 0%, transparent 70%)`,
          }}
        />
      ) : null}
      {children}
      <Grain amount={grain ?? t.grain} />
    </AbsoluteFill>
  );
};

/**
 * Grain — granulação de filme determinística (seed muda a cada 2 frames).
 * 0.03–0.06 já mata o banding e tira o aspecto "digital chapado".
 */
export const Grain: React.FC<{ amount: number; fps12?: boolean }> = ({ amount, fps12 = true }) => {
  const frame = useCurrentFrame();
  if (amount <= 0) return null;
  const seed = fps12 ? Math.floor(frame / 2) % 50 : frame % 50;
  return (
    <AbsoluteFill style={{ pointerEvents: "none", mixBlendMode: "multiply", opacity: amount * 4 }}>
      <svg width="100%" height="100%">
        <filter id={`grain-${seed}`}>
          <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" seed={seed} stitchTiles="stitch" />
          <feColorMatrix type="saturate" values="0" />
        </filter>
        <rect width="100%" height="100%" filter={`url(#grain-${seed})`} opacity={0.5} />
      </svg>
    </AbsoluteFill>
  );
};
