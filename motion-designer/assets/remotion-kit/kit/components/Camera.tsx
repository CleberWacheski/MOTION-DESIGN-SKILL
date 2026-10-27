import React from "react";
import { interpolate, useCurrentFrame } from "remotion";
import { EASE } from "../motion";

/**
 * Camera — "câmera com intenção": estabelece aberto → viaja → chega no sujeito.
 * Anima scale + x/y num WRAPPER (nunca no elemento de mídia).
 *
 * keys: [{ f, scale, x, y }]  (x/y em px de deslocamento do conteúdo)
 * Entre keys usa ease de câmera (inOut). Para punch-in rápido use keys próximas (8–12 frames).
 */
export type CamKey = { f: number; scale: number; x?: number; y?: number; rotate?: number };

export const Camera: React.FC<{
  keys: CamKey[];
  children: React.ReactNode;
  origin?: string;
  ease?: (t: number) => number;
  style?: React.CSSProperties;
}> = ({ keys, children, origin = "50% 50%", ease = EASE.move, style }) => {
  const frame = useCurrentFrame();
  const fs = keys.map((k) => k.f);
  const opts = { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: ease } as const;
  const one = keys.length === 1;
  const scale = one ? keys[0].scale : interpolate(frame, fs, keys.map((k) => k.scale), opts);
  const x = one ? keys[0].x ?? 0 : interpolate(frame, fs, keys.map((k) => k.x ?? 0), opts);
  const y = one ? keys[0].y ?? 0 : interpolate(frame, fs, keys.map((k) => k.y ?? 0), opts);
  const r = one ? keys[0].rotate ?? 0 : interpolate(frame, fs, keys.map((k) => k.rotate ?? 0), opts);

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        transform: `translate(${x}px, ${y}px) scale(${scale}) rotate(${r}deg)`,
        transformOrigin: origin,
        ...style,
      }}
    >
      {children}
    </div>
  );
};
