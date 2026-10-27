import React from "react";
import { AbsoluteFill, useVideoConfig } from "remotion";

/**
 * SafeAreaGuide — overlay de DEBUG. Renderize só no Studio (prop showGuides)
 * e NUNCA no render final.
 *  - 16:9: title-safe 80% e action-safe 90%.
 *  - 9:16: zona universal TikTok/Reels/Shorts (x 60–960, y 210–1600 em 1080×1920).
 */
export const SafeAreaGuide: React.FC<{ show?: boolean }> = ({ show = false }) => {
  const { width, height } = useVideoConfig();
  if (!show) return null;
  const vertical = height > width;
  const box = (l: number, t: number, r: number, b: number, color: string, label: string) => (
    <div
      style={{
        position: "absolute",
        left: l,
        top: t,
        width: r - l,
        height: b - t,
        border: `3px dashed ${color}`,
        color,
        fontSize: 22,
        fontFamily: "monospace",
        padding: 6,
      }}
    >
      {label}
    </div>
  );
  return (
    <AbsoluteFill style={{ pointerEvents: "none", zIndex: 9999 }}>
      {vertical
        ? box((60 / 1080) * width, (210 / 1920) * height, (960 / 1080) * width, (1600 / 1920) * height, "#ff00aa", "social-safe")
        : null}
      {box(width * 0.05, height * 0.05, width * 0.95, height * 0.95, "#00c2ff", "action-safe 90%")}
      {box(width * 0.1, height * 0.1, width * 0.9, height * 0.9, "#ffcc00", "title-safe 80%")}
    </AbsoluteFill>
  );
};
