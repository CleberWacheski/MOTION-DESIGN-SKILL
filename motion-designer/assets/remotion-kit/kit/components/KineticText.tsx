import React from "react";
import { interpolateColors, useCurrentFrame, useVideoConfig } from "remotion";
import { useTheme } from "../ThemeContext";
import { EASE, prog, sec } from "../motion";

/**
 * KineticText — título/linha com entrada por palavra (ou letra) e saída opcional.
 *
 * Modos (varie entre cenas — nunca o mesmo em todas):
 *  - "blur"    : cada palavra materializa do blur, sem translate (padrão elegante)
 *  - "ink"     : cada palavra vai de cinza claro → tinta, sem mover (calmo, editorial)
 *  - "rise"    : palavra sobe curto + opacidade (o clichê; use com parcimônia)
 *  - "letters" : por letra, para nomes/marcas curtas
 *  - "mask"    : palavra sobe de dentro de uma máscara (corte de linha) — enérgico
 *
 * Depois de pousar, o texto fica PARADO (títulos que continuam deslizando são tell de IA).
 */
export type KineticMode = "blur" | "ink" | "rise" | "letters" | "mask";

export const KineticText: React.FC<{
  text: string;
  /** frame (relativo à Sequence) em que a primeira palavra começa */
  start?: number;
  mode?: KineticMode;
  /** tamanho em px */
  size: number;
  /** índices das palavras que recebem o accent (ex.: [2]) */
  accentWords?: number[];
  /** segundos entre palavras (letras usam 1/3 disso) */
  staggerSec?: number;
  /** duração da entrada de cada unidade */
  unitSec?: number;
  /** frame em que a saída (blur-out, palavra por palavra) começa; omita para não sair */
  exitAt?: number;
  align?: "left" | "center" | "right";
  color?: string;
  weight?: number;
  font?: string;
  lineHeight?: number;
  maxWidth?: number | string;
  style?: React.CSSProperties;
}> = ({
  text,
  start = 0,
  mode = "blur",
  size,
  accentWords = [],
  staggerSec = 0.07,
  unitSec,
  exitAt,
  align = "left",
  color,
  weight,
  font,
  lineHeight = 1.02,
  maxWidth = "100%",
  style,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = useTheme();
  const words = text.split(/\s+/).filter(Boolean);
  const ink = color ?? t.colors.ink;

  const defaultUnit = mode === "ink" ? 0.25 : mode === "mask" ? 0.45 : 0.18;
  const unit = sec(unitSec ?? defaultUnit, fps);
  const each = staggerSec * fps;

  const exitP = (i: number) =>
    exitAt === undefined ? 0 : prog(frame, exitAt + i * each * 0.5, sec(0.18, fps), EASE.leave);

  let letterIndex = 0;

  return (
    <div
      style={{
        fontFamily: font ?? t.fonts.display,
        fontWeight: weight ?? t.weights.display,
        fontSize: size,
        letterSpacing: t.displayTracking,
        lineHeight,
        color: ink,
        textAlign: align,
        maxWidth,
        display: "flex",
        flexWrap: "wrap",
        justifyContent: align === "center" ? "center" : align === "right" ? "flex-end" : "flex-start",
        columnGap: "0.25em",
        ...style,
      }}
    >
      {words.map((w, i) => {
        const isAccent = accentWords.includes(i);
        const wordColor = isAccent ? t.colors.accent : ink;
        const ws = start + i * each;
        const p = prog(frame, ws, unit, mode === "mask" ? EASE.emphasized : EASE.arrive);
        const out = exitP(i);

        if (mode === "letters") {
          return (
            <span key={i} style={{ display: "inline-block", whiteSpace: "nowrap" }}>
              {[...w].map((ch, j) => {
                const li = letterIndex++;
                const lp = prog(frame, start + li * (each / 3), unit, EASE.arrive);
                return (
                  <span
                    key={j}
                    style={{
                      display: "inline-block",
                      color: wordColor,
                      opacity: (0.15 + 0.85 * lp) * (1 - out),
                      filter: `blur(${(1 - lp) * 4 + out * 6}px)`,
                    }}
                  >
                    {ch}
                  </span>
                );
              })}
            </span>
          );
        }

        if (mode === "mask") {
          return (
            <span
              key={i}
              style={{ display: "inline-block", overflow: "hidden", paddingBottom: "0.08em" }}
            >
              <span
                style={{
                  display: "inline-block",
                  color: wordColor,
                  transform: `translateY(${(1 - p) * 105 - out * 105}%)`,
                }}
              >
                {w}
              </span>
            </span>
          );
        }

        if (mode === "ink") {
          // interpola da cor suave (já visível) para a cor final, sem mover
          return (
            <span
              key={i}
              style={{
                display: "inline-block",
                color: interpolateColors(p, [0, 1], [t.colors.inkSoft, wordColor]),
                opacity: prog(frame, start, sec(0.15, fps)) * (1 - out),
                filter: `blur(${out * 6}px)`,
              }}
            >
              {w}
            </span>
          );
        }

        const base: React.CSSProperties = {
          display: "inline-block",
          color: wordColor,
          opacity: p * (1 - out),
          filter: `blur(${(1 - p) * 8 + out * 8}px)`,
        };
        if (mode === "rise") {
          base.transform = `translateY(${(1 - p) * 0.35}em)`;
          base.filter = `blur(${out * 8}px)`;
        }
        return (
          <span key={i} style={base}>
            {w}
          </span>
        );
      })}
    </div>
  );
};
