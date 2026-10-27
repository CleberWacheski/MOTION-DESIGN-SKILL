import React from "react";
import { useCurrentFrame, useVideoConfig } from "remotion";
import { useTheme } from "../ThemeContext";
import { EASE, prog, sec } from "../motion";

/**
 * BarChart — gráfico construído em ORDEM DE LEITURA:
 *   1) eixo/base  2) barras crescem em stagger  3) valores  4) anotação no ponto que importa.
 * Uma série destacada (accent), o resto em cinza. Sem legenda: o rótulo fica na barra.
 */
export type Bar = { label: string; value: number };

export const BarChart: React.FC<{
  data: Bar[];
  start?: number;
  width: number;
  height: number;
  highlight?: number; // índice destacado
  annotation?: string; // texto que aparece sobre a barra destacada
  format?: (v: number) => string;
  max?: number;
  labelSize?: number;
}> = ({ data, start = 0, width, height, highlight, annotation, format = (v) => String(v), max, labelSize = 30 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = useTheme();
  const top = max ?? Math.max(...data.map((d) => d.value)) * 1.1;
  const gap = width * 0.04;
  const barW = (width - gap * (data.length - 1)) / data.length;
  const chartH = height - labelSize * 2.6;

  const axisP = prog(frame, start, sec(0.4, fps), EASE.move);
  const barsStart = start + sec(0.3, fps);
  const each = sec(0.08, fps);
  const barDur = sec(0.7, fps);
  const annStart = barsStart + each * data.length + barDur;
  const annP = prog(frame, annStart, sec(0.35, fps), EASE.overshoot);

  return (
    <div style={{ position: "relative", width, height, fontFamily: t.fonts.body }}>
      {/* base */}
      <div
        style={{
          position: "absolute",
          left: 0,
          top: chartH,
          height: 3,
          width: width * axisP,
          background: t.colors.ink,
        }}
      />
      {data.map((d, i) => {
        const p = prog(frame, barsStart + i * each, barDur, EASE.arrive);
        const h = (d.value / top) * chartH * p;
        const isHi = i === highlight;
        const x = i * (barW + gap);
        return (
          <React.Fragment key={d.label}>
            <div
              style={{
                position: "absolute",
                left: x,
                top: chartH - h,
                width: barW,
                height: h,
                background: highlight === undefined || isHi ? t.colors.accent : t.colors.inkSoft,
                opacity: highlight === undefined || isHi ? 1 : 0.45,
                borderRadius: `${Math.min(12, barW * 0.08)}px ${Math.min(12, barW * 0.08)}px 0 0`,
              }}
            />
            <div
              style={{
                position: "absolute",
                left: x,
                width: barW,
                top: chartH - h - labelSize * 1.4,
                textAlign: "center",
                fontSize: labelSize,
                fontWeight: t.weights.bold,
                color: t.colors.ink,
                opacity: p,
                fontVariantNumeric: "tabular-nums",
              }}
            >
              {format(Math.round(d.value * p))}
            </div>
            <div
              style={{
                position: "absolute",
                left: x - gap / 2,
                width: barW + gap,
                top: chartH + labelSize * 0.5,
                textAlign: "center",
                fontSize: labelSize * 0.9,
                color: t.colors.ink,
                opacity: axisP,
              }}
            >
              {d.label}
            </div>
          </React.Fragment>
        );
      })}
      {annotation && highlight !== undefined ? (
        <div
          style={{
            position: "absolute",
            left: highlight * (barW + gap) + barW / 2,
            top: chartH - (data[highlight].value / top) * chartH - labelSize * 4,
            transform: `translateX(-50%) scale(${annP})`,
            transformOrigin: "bottom center",
            background: t.colors.ink,
            color: t.colors.ground,
            padding: `${labelSize * 0.3}px ${labelSize * 0.6}px`,
            borderRadius: labelSize * 0.4,
            fontSize: labelSize,
            fontWeight: t.weights.bold,
            whiteSpace: "nowrap",
          }}
        >
          {annotation}
        </div>
      ) : null}
    </div>
  );
};
