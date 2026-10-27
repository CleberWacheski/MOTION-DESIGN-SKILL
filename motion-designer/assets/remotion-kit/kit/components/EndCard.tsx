import React from "react";
import { AbsoluteFill, Img, useCurrentFrame, useVideoConfig } from "remotion";
import { useTheme } from "../ThemeContext";
import { EASE, SPRING, prog, sec, springAt } from "../motion";

/**
 * EndCard — o fechamento é CONSTRUÍDO, não uma imagem parada:
 *  marca entra com peso (spring) → wordmark revela por wipe → CTA pousa e SEGURA 1.5–3s.
 * A marca aparece com peso UMA vez no filme (aqui), nunca "docada" num canto.
 */
export const EndCard: React.FC<{
  name: string;
  cta?: string;
  /** imagem do logo em public/ (via staticFile) — opcional */
  logoSrc?: string;
  start?: number;
}> = ({ name, cta, logoSrc, start = 0 }) => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();
  const t = useTheme();
  const short = Math.min(width, height);
  const mark = springAt(frame, fps, start, SPRING.heavy);
  const wipe = prog(frame, start + sec(0.35, fps), sec(0.5, fps), EASE.emphasized);
  const ctaP = prog(frame, start + sec(0.85, fps), sec(0.4, fps), EASE.arrive);
  const markSize = short * 0.16;
  // vertical: empilha marca e nome (lado a lado estoura a zona segura de 900px)
  const vertical = height > width;

  return (
    <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", gap: short * 0.05 }}>
      <div
        style={{
          display: "flex",
          flexDirection: vertical ? "column" : "row",
          alignItems: "center",
          gap: short * 0.035,
          maxWidth: width * (vertical ? 0.83 : 0.8),
        }}
      >
        <div
          style={{
            width: markSize,
            height: markSize,
            borderRadius: t.radius * (short / 1080) * 1.4,
            background: logoSrc ? "transparent" : t.colors.accent,
            transform: `scale(${mark})`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {logoSrc ? <Img src={logoSrc} style={{ width: "100%", height: "100%", objectFit: "contain" }} /> : null}
        </div>
        <div
          style={{
            fontFamily: t.fonts.display,
            fontWeight: t.weights.display,
            fontSize: short * 0.11,
            letterSpacing: t.displayTracking,
            color: t.colors.ink,
            clipPath: `inset(0 ${100 - wipe * 100}% 0 0)`,
            whiteSpace: vertical ? "normal" : "nowrap",
            textAlign: "center",
            lineHeight: 1,
          }}
        >
          {name}
        </div>
      </div>
      {cta ? (
        <div
          style={{
            fontFamily: t.fonts.body,
            fontWeight: t.weights.bold,
            fontSize: short * 0.042,
            color: t.colors.accentInk,
            background: t.colors.ink,
            padding: `${short * 0.018}px ${short * 0.04}px`,
            borderRadius: 999,
            opacity: ctaP,
            transform: `translateY(${(1 - ctaP) * short * 0.02}px)`,
          }}
        >
          {cta}
        </div>
      ) : null}
    </AbsoluteFill>
  );
};
