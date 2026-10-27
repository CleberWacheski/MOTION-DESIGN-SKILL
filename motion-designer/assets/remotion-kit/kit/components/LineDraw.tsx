import React from "react";
import { useCurrentFrame, useVideoConfig } from "remotion";
import { useTheme } from "../ThemeContext";
import { EASE, prog, sec } from "../motion";

/**
 * LineDraw — desenha qualquer path SVG (setas, conexões de diagrama, sublinhados,
 * ícones de traço, assinaturas). Usa pathLength=1 para não precisar medir o path.
 *
 * Diagrama que CRESCE: uma parte por beat, aparecendo quando é nomeada.
 */
export const LineDraw: React.FC<{
  d: string;
  width: number;
  height: number;
  viewBox?: string;
  start?: number;
  durationSec?: number;
  stroke?: string;
  strokeWidth?: number;
  /** desenha uma ponta de seta no fim */
  arrow?: boolean;
  style?: React.CSSProperties;
}> = ({ d, width, height, viewBox, start = 0, durationSec = 0.8, stroke, strokeWidth = 6, arrow, style }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = useTheme();
  const p = prog(frame, start, sec(durationSec, fps), EASE.move);
  const id = React.useId().replace(/:/g, "");
  const color = stroke ?? t.colors.ink;
  return (
    <svg width={width} height={height} viewBox={viewBox ?? `0 0 ${width} ${height}`} style={{ overflow: "visible", ...style }}>
      {arrow ? (
        <defs>
          <marker id={`a${id}`} viewBox="0 0 10 10" refX="6" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse">
            <path d="M0 0 L10 5 L0 10 z" fill={color} opacity={p >= 0.98 ? 1 : 0} />
          </marker>
        </defs>
      ) : null}
      <path
        d={d}
        pathLength={1}
        fill="none"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeDasharray="1 1"
        strokeDashoffset={1 - p}
        markerEnd={arrow ? `url(#a${id})` : undefined}
      />
    </svg>
  );
};
