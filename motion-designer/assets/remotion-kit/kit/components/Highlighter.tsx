import React from "react";
import { useCurrentFrame, useVideoConfig } from "remotion";
import { useTheme } from "../ThemeContext";
import { EASE, prog, sec } from "../motion";

/**
 * Highlighter — marca-texto que passa ATRÁS da palavra (esquerda → direita).
 * Para anotações à mão (círculo, sublinhado rabiscado, riscado) prefira
 * @remotion/rough-notation (ver references/remotion-tecnico.md).
 */
export const Highlighter: React.FC<{
  children: React.ReactNode;
  start?: number;
  durationSec?: number;
  color?: string;
  /** altura da faixa em relação à linha (0.35 = sublinhado grosso, 0.9 = bloco) */
  thickness?: number;
  skew?: number;
}> = ({ children, start = 0, durationSec = 0.45, color, thickness = 0.42, skew = -6 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = useTheme();
  const p = prog(frame, start, sec(durationSec, fps), EASE.move);
  return (
    <span style={{ position: "relative", display: "inline-block" }}>
      <span
        style={{
          position: "absolute",
          left: "-0.06em",
          right: "-0.06em",
          bottom: "0.04em",
          height: `${thickness}em`,
          background: color ?? t.colors.accent,
          opacity: 0.85,
          transform: `scaleX(${p}) skewX(${skew}deg)`,
          transformOrigin: "left center",
          zIndex: 0,
          borderRadius: "0.08em",
        }}
      />
      <span style={{ position: "relative", zIndex: 1 }}>{children}</span>
    </span>
  );
};
