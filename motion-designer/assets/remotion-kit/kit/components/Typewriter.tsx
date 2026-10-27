import React from "react";
import { useCurrentFrame, useVideoConfig } from "remotion";
import { useTheme } from "../ThemeContext";

/**
 * Typewriter — texto/código digitado caractere a caractere com cursor piscando
 * (piscar determinístico: a cada 0.5s). Bom para prompts, terminais e código.
 * Dica: digitar num prompt como ABERTURA do filme é "tell" de vídeo gerado;
 * como passo da história, alguns segundos depois, funciona.
 */
export const Typewriter: React.FC<{
  text: string;
  start?: number;
  charsPerSec?: number;
  size: number;
  mono?: boolean;
  color?: string;
  showCursor?: boolean;
  style?: React.CSSProperties;
}> = ({ text, start = 0, charsPerSec = 28, size, mono = true, color, showCursor = true, style }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = useTheme();
  const n = Math.max(0, Math.floor(((frame - start) / fps) * charsPerSec));
  const shown = text.slice(0, n);
  const done = n >= text.length;
  const blinkOn = Math.floor(frame / (fps * 0.5)) % 2 === 0;
  return (
    <div
      style={{
        fontFamily: mono ? t.fonts.mono : t.fonts.body,
        fontSize: size,
        color: color ?? t.colors.ink,
        whiteSpace: "pre-wrap",
        lineHeight: 1.35,
        ...style,
      }}
    >
      {shown}
      {showCursor && (!done || blinkOn) ? (
        <span style={{ display: "inline-block", width: "0.55em", height: "1.05em", background: t.colors.accent, verticalAlign: "-0.15em", marginLeft: 2 }} />
      ) : null}
    </div>
  );
};
