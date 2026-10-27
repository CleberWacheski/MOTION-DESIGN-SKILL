/**
 * MOTION — vocabulário de movimento do kit.
 *
 * Tudo é função do frame (determinístico). Nada de CSS transition/animation,
 * Date.now() ou Math.random() — o Remotion renderiza frames fora de ordem.
 */
import { Easing, interpolate, spring, type SpringConfig } from "remotion";

/* ---------------------------------------------------------------------------
 * EASINGS POR PAPEL (nomeados — não use o mesmo ease em tudo)
 * ------------------------------------------------------------------------- */
export const EASE = {
  /** chegada com cauda longa (expo.out) — entradas de títulos e objetos */
  arrive: Easing.bezier(0.16, 1, 0.3, 1),
  /** chegada enfática (MD3 emphasized) */
  emphasized: Easing.bezier(0.05, 0.7, 0.1, 1),
  /** saída que acelera (power3.in) — saídas, zoom-through */
  leave: Easing.bezier(0.55, 0, 0.75, 0.06),
  /** movimento em tela / câmera (power2.inOut) */
  move: Easing.bezier(0.45, 0, 0.55, 1),
  /** premium/elegante, sem overshoot */
  premium: Easing.bezier(0.4, 0, 0.2, 1),
  /** corporativo decidido */
  snappy: Easing.bezier(0.2, 0, 0, 1),
  /** overshoot leve (back.out ~1.4) — só posição/escala, nunca opacidade */
  overshoot: Easing.bezier(0.34, 1.56, 0.64, 1),
  linear: Easing.linear,
} as const;

/* ---------------------------------------------------------------------------
 * SPRINGS por sensação (configs para spring() do Remotion)
 * damping alto = sem quique. mass maior = mais pesado/lento.
 * ------------------------------------------------------------------------- */
export const SPRING: Record<string, Partial<SpringConfig>> = {
  /** empurrão limpo, zero quique (padrão seguro para UI e texto) */
  smooth: { damping: 200 },
  /** premium: assenta com micro-overshoot quase imperceptível */
  premium: { damping: 26, stiffness: 120, mass: 1 },
  /** snappy: rápido e firme */
  snappy: { damping: 20, stiffness: 200, mass: 0.6 },
  /** playful: quica de leve (posições/escala) */
  playful: { damping: 10, stiffness: 140, mass: 0.8 },
  /** pesado: objetos grandes, cartões, blocos */
  heavy: { damping: 30, stiffness: 80, mass: 2 },
};

/* ---------------------------------------------------------------------------
 * TEMPO
 * ------------------------------------------------------------------------- */
/** segundos → frames (arredondado) */
export const sec = (seconds: number, fps: number) => Math.round(seconds * fps);

/**
 * Tempo mínimo para LER uma linha: 0.5s + 0.3s por palavra (última linha ≥ 2s).
 * Use para decidir quanto tempo um texto fica parado na tela.
 */
export const readFrames = (text: string, fps: number, isLast = false) => {
  const words = text.trim().split(/\s+/).filter(Boolean).length;
  const s = Math.max(0.5 + 0.3 * words, isLast ? 2 : 0);
  return Math.ceil(s * fps);
};

/** Grade de batidas: frame do beat i. Calcule pelo índice — nunca some arredondado. */
export const beatFrame = (i: number, bpm: number, fps: number) =>
  Math.round((i * 60 * fps) / bpm);

/* ---------------------------------------------------------------------------
 * PROGRESSO
 * ------------------------------------------------------------------------- */
const CLAMP = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

/** progresso 0→1 entre [start, start+dur] com easing. */
export const prog = (
  frame: number,
  start: number,
  dur: number,
  ease: (t: number) => number = EASE.arrive,
) => interpolate(frame, [start, start + Math.max(1, dur)], [0, 1], { ...CLAMP, easing: ease });

/** mapeia progresso p (0..1) para [a, b] */
export const lerp = (p: number, a: number, b: number) => a + (b - a) * p;

/** spring 0→1 que começa em `delay` frames */
export const springAt = (
  frame: number,
  fps: number,
  delay = 0,
  config: Partial<SpringConfig> = SPRING.smooth,
  durationInFrames?: number,
) => spring({ frame: frame - delay, fps, config, durationInFrames });

/**
 * Entrada + saída numa só curva (0 → 1 → 0).
 * Saída ~45% mais curta que a entrada (regra "chega devagar, sai limpo").
 */
export const inOut = (
  frame: number,
  start: number,
  end: number,
  inDur: number,
  outDur = Math.round(inDur * 0.55),
) => {
  const a = prog(frame, start, inDur, EASE.arrive);
  const b = prog(frame, end - outDur, outDur, EASE.leave);
  return a * (1 - b);
};

/** atraso de stagger para o item i (com teto de orçamento total). */
export const stagger = (i: number, each: number, maxTotal = Infinity) =>
  Math.min(i * each, maxTotal);

/* ---------------------------------------------------------------------------
 * EFEITOS PRONTOS (retornam objetos de style)
 * ------------------------------------------------------------------------- */
/** blur-in sem translate: o "título que materializa" (0.13–0.2s por palavra) */
export const blurIn = (p: number, maxBlur = 8) => ({
  opacity: p,
  filter: `blur(${(1 - p) * maxBlur}px)`,
});

/** entrada com deslocamento curto + opacidade (use com moderação — é o clichê #1) */
export const rise = (p: number, distance = 40) => ({
  opacity: p,
  transform: `translateY(${(1 - p) * distance}px)`,
});

/** motion blur barato na direção do movimento, pico na velocidade máxima */
export const motionBlur = (velocity01: number, maxPx = 12) =>
  `blur(${Math.abs(velocity01) * maxPx}px)`;

/** velocidade aproximada (derivada) de uma função de progresso no frame atual */
export const velocity = (fn: (f: number) => number, frame: number) =>
  fn(frame + 0.5) - fn(frame - 0.5);

/** hash determinístico para "aleatoriedade" estável por índice */
export const hash01 = (n: number) => {
  const x = Math.sin(n * 127.1 + 311.7) * 43758.5453;
  return x - Math.floor(x);
};
