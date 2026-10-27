import React from "react";
import { useCurrentFrame, useVideoConfig } from "remotion";
import { useTheme } from "../ThemeContext";
import { EASE, prog, sec } from "../motion";

/**
 * Captions — legenda "estilo TikTok" palavra a palavra a partir de JSON.
 * Formato compatível com @remotion/captions (Caption): { text, startMs, endMs }.
 * Gere com Whisper (ver references/audio-voz-legendas.md) ou com scripts/tts.mjs
 * (que estima tempos por palavra a partir da duração de cada cena).
 *
 * Os tempos são relativos ao início do ÁUDIO; coloque este componente na MESMA
 * <Sequence> do áudio correspondente.
 */
export type CaptionWord = { text: string; startMs: number; endMs: number };

export const Captions: React.FC<{
  words: CaptionWord[];
  maxWordsPerPage?: number;
  size?: number;
  /** posição vertical do bloco (px a partir do topo) */
  top?: number;
  activeColor?: string;
  uppercase?: boolean;
}> = ({ words, maxWordsPerPage = 4, size, top, activeColor, uppercase = false }) => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();
  const t = useTheme();
  const ms = (frame / fps) * 1000;
  const fontSize = size ?? Math.round(Math.min(width, height) * 0.065);

  // paginação: quebra a cada N palavras ou em pausa > 350ms
  const pages: CaptionWord[][] = [];
  let cur: CaptionWord[] = [];
  words.forEach((w, i) => {
    const prev = words[i - 1];
    const pause = prev ? w.startMs - prev.endMs > 350 : false;
    if (cur.length >= maxWordsPerPage || (pause && cur.length > 0)) {
      pages.push(cur);
      cur = [];
    }
    cur.push(w);
  });
  if (cur.length) pages.push(cur);

  const page = pages.find((p) => ms >= p[0].startMs && ms < p[p.length - 1].endMs + 150);
  if (!page) return null;
  const pageStartFrame = (page[0].startMs / 1000) * fps;
  const pop = prog(frame, pageStartFrame, sec(0.12, fps), EASE.overshoot);

  return (
    <div
      style={{
        position: "absolute",
        left: width * 0.08,
        right: width * 0.08,
        top: top ?? height * 0.68,
        display: "flex",
        flexWrap: "wrap",
        justifyContent: "center",
        gap: "0 0.28em",
        fontFamily: t.fonts.display,
        fontWeight: 900,
        fontSize,
        lineHeight: 1.1,
        textTransform: uppercase ? "uppercase" : "none",
        transform: `scale(${0.92 + 0.08 * pop})`,
      }}
    >
      {page.map((w, i) => {
        const active = ms >= w.startMs && ms < w.endMs;
        const spoken = ms >= w.startMs;
        return (
          <span
            key={i}
            style={{
              color: active ? activeColor ?? t.colors.accent : t.colors.ink,
              opacity: spoken ? 1 : 0.55,
              // contorno para ler sobre qualquer fundo
              WebkitTextStroke: `${Math.max(2, fontSize * 0.06)}px ${t.colors.ground}`,
              paintOrder: "stroke fill",
            }}
          >
            {w.text}
          </span>
        );
      })}
    </div>
  );
};
