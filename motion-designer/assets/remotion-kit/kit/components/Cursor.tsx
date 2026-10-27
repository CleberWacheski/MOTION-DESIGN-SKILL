import React from "react";
import { interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { EASE, prog, sec } from "../motion";

/**
 * Cursor — cursor GRANDE (4–7% da largura do quadro) que conduz o olho.
 * Entra de fora da tela; o CLIQUE causa a próxima coisa NO MESMO FRAME.
 *
 * keys: [{ f: frame, x, y, click?: true }]
 * Use `clickFrames(keys)` para sincronizar efeitos (som de clique, transição) aos cliques.
 */
export type CursorKey = { f: number; x: number; y: number; click?: boolean };

export const clickFrames = (keys: CursorKey[]) => keys.filter((k) => k.click).map((k) => k.f);

export const Cursor: React.FC<{ keys: CursorKey[]; size?: number; color?: string; outline?: string }> = ({
  keys,
  size,
  color = "#111111",
  outline = "#FFFFFF",
}) => {
  const frame = useCurrentFrame();
  const { fps, width } = useVideoConfig();
  const s = size ?? width * 0.05;
  if (keys.length === 0) return null;

  // posição: interpolação com ease de câmera entre cada par de keys
  let x = keys[0].x;
  let y = keys[0].y;
  for (let i = 0; i < keys.length - 1; i++) {
    const a = keys[i];
    const b = keys[i + 1];
    if (frame >= a.f && frame <= b.f) {
      const p = interpolate(frame, [a.f, b.f], [0, 1], { easing: EASE.move });
      x = a.x + (b.x - a.x) * p;
      y = a.y + (b.y - a.y) * p;
    } else if (frame > b.f) {
      x = b.x;
      y = b.y;
    }
  }

  // clique: squash 1 → 0.82 → 1 em ~0.2s
  let press = 1;
  for (const k of keys) {
    if (!k.click) continue;
    const down = prog(frame, k.f - sec(0.06, fps), sec(0.06, fps), EASE.snappy);
    const up = prog(frame, k.f, sec(0.16, fps), EASE.overshoot);
    if (frame >= k.f - sec(0.06, fps) && frame <= k.f + sec(0.2, fps)) {
      press = 1 - 0.18 * down + 0.18 * up;
    }
  }

  return (
    <svg
      width={s}
      height={s}
      viewBox="0 0 24 24"
      style={{
        position: "absolute",
        left: x,
        top: y,
        transform: `scale(${press})`,
        transformOrigin: "10% 10%",
        filter: "drop-shadow(0 6px 10px rgba(0,0,0,0.25))",
        pointerEvents: "none",
        zIndex: 100,
      }}
    >
      <path
        d="M3 2 L3 19 L8 14.5 L11.5 22 L14.5 20.6 L11 13.3 L17.5 13 Z"
        fill={color}
        stroke={outline}
        strokeWidth={1.4}
        strokeLinejoin="round"
      />
    </svg>
  );
};
