import React from "react";
import { useCurrentFrame, useVideoConfig } from "remotion";
import { useTheme } from "../ThemeContext";
import { EASE, prog, sec } from "../motion";
import { typeScale } from "../theme";

/**
 * CountUp — um número que "pousa". Regras de dados:
 *  - o número é a maior coisa da tela; tabular-nums para não tremer;
 *  - 1.2–1.6s de contagem, depois PARADO;
 *  - só números reais, da fonte; mostre a fonte numa linha pequena (prop `source`).
 */
export const CountUp: React.FC<{
  from?: number;
  to: number;
  start?: number;
  durationSec?: number;
  decimals?: number;
  prefix?: string;
  suffix?: string;
  locale?: string;
  size: number;
  color?: string;
  source?: string;
  label?: string;
  style?: React.CSSProperties;
}> = ({
  from = 0,
  to,
  start = 0,
  durationSec = 1.4,
  decimals = 0,
  prefix = "",
  suffix = "",
  locale = "pt-BR",
  size,
  color,
  source,
  label,
  style,
}) => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();
  const t = useTheme();
  const p = prog(frame, start, sec(durationSec, fps), EASE.arrive);
  const value = from + (to - from) * p;
  const appear = prog(frame, start - sec(0.15, fps), sec(0.2, fps));
  const formatted = new Intl.NumberFormat(locale, {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(value);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: size * 0.08, opacity: appear, ...style }}>
      <div
        style={{
          fontFamily: t.fonts.display,
          fontWeight: t.weights.display,
          fontSize: size,
          lineHeight: 0.9,
          letterSpacing: "-0.04em",
          color: color ?? t.colors.ink,
          fontVariantNumeric: "tabular-nums",
          whiteSpace: "nowrap",
        }}
      >
        {prefix}
        {formatted}
        {suffix}
      </div>
      {label ? (
        <div style={{ fontFamily: t.fonts.body, fontWeight: t.weights.body, fontSize: size * 0.22, color: t.colors.ink }}>
          {label}
        </div>
      ) : null}
      {source ? (
        <div style={{ fontFamily: t.fonts.body, fontSize: Math.max(size * 0.11, typeScale(width, height).min), color: t.colors.inkSoft }}>
          Fonte: {source}
        </div>
      ) : null}
    </div>
  );
};
