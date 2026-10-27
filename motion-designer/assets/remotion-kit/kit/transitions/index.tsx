/**
 * Transições CSS-puras (renderizam sempre, sem WebGL/HtmlInCanvas) para usar em
 * <TransitionSeries.Transition presentation={whip()} timing={...} />.
 *
 * Doutrina: cada transição tem uma CAUSA na tela; use 2–4 tipos no filme e repita;
 * mantenha uma "corrente" (direção dominante, ex.: para a esquerda) e só mude
 * de direção com motivo. Nunca crossfade entre "mundos".
 */
import React from "react";
import { AbsoluteFill, interpolate } from "remotion";
import type { TransitionPresentation, TransitionPresentationComponentProps } from "@remotion/transitions";

type Dir = "left" | "right" | "up" | "down";

/* ------------------------------------------------------------------ WHIP --
 * Chicote: as duas cenas se movem juntas na mesma direção com motion blur
 * que atinge o pico no meio. Corte "no meio do movimento" = continuidade. */
type WhipProps = { direction?: Dir; blur?: number };

const WhipPresentation: React.FC<TransitionPresentationComponentProps<WhipProps>> = ({
  children,
  presentationProgress: p,
  presentationDirection,
  passedProps: { direction = "left", blur = 18 },
}) => {
  const sign = direction === "left" || direction === "up" ? -1 : 1;
  const axis = direction === "left" || direction === "right" ? "X" : "Y";
  const offset = presentationDirection === "exiting" ? sign * p * 100 : sign * (p - 1) * 100;
  const b = Math.sin(Math.PI * p) * blur; // pico no meio
  return (
    <AbsoluteFill style={{ transform: `translate${axis}(${offset}%)`, filter: `blur(${b}px)` }}>{children}</AbsoluteFill>
  );
};

export const whip = (props: WhipProps = {}): TransitionPresentation<WhipProps> => ({
  component: WhipPresentation,
  props,
});

/* --------------------------------------------------------- ZOOM THROUGH --
 * Câmera "atravessa" a cena: a saída cresce (empurrão) e some; a entrada chega
 * já em movimento, um pouco pequena e crescendo até assentar (mesmo sinal de
 * escala: crescendo dos dois lados = empurrar para frente). */
type ZoomProps = { amount?: number; blur?: number };

const ZoomPresentation: React.FC<TransitionPresentationComponentProps<ZoomProps>> = ({
  children,
  presentationProgress: p,
  presentationDirection,
  passedProps: { amount = 2.2, blur = 10 },
}) => {
  if (presentationDirection === "exiting") {
    const s = interpolate(p, [0, 1], [1, amount]);
    return (
      <AbsoluteFill style={{ transform: `scale(${s})`, opacity: 1 - p, filter: `blur(${p * blur}px)` }}>
        {children}
      </AbsoluteFill>
    );
  }
  const s = interpolate(p, [0, 1], [0.7, 1]);
  return (
    <AbsoluteFill style={{ transform: `scale(${s})`, opacity: Math.min(1, p * 1.6), filter: `blur(${(1 - p) * blur * 0.6}px)` }}>
      {children}
    </AbsoluteFill>
  );
};

export const zoomThrough = (props: ZoomProps = {}): TransitionPresentation<ZoomProps> => ({
  component: ZoomPresentation,
  props,
});

/* ------------------------------------------------------------- IRIS AT --
 * Íris que abre a partir de um PONTO (ex.: onde o cursor clicou). */
type IrisProps = { x?: string; y?: string };

const IrisPresentation: React.FC<TransitionPresentationComponentProps<IrisProps>> = ({
  children,
  presentationProgress: p,
  presentationDirection,
  passedProps: { x = "50%", y = "50%" },
}) => {
  if (presentationDirection === "exiting") return <AbsoluteFill>{children}</AbsoluteFill>;
  return <AbsoluteFill style={{ clipPath: `circle(${p * 150}% at ${x} ${y})` }}>{children}</AbsoluteFill>;
};

export const irisAt = (props: IrisProps = {}): TransitionPresentation<IrisProps> => ({
  component: IrisPresentation,
  props,
});

/* -------------------------------------------------------------- DIP CUT --
 * A saída escurece ~40% por alguns frames e corta seco — o corte "parece intencional". */
type DipProps = { color?: string; amount?: number };

const DipPresentation: React.FC<TransitionPresentationComponentProps<DipProps>> = ({
  children,
  presentationProgress: p,
  presentationDirection,
  passedProps: { color = "#000", amount = 0.4 },
}) => {
  if (presentationDirection === "exiting") {
    return (
      <AbsoluteFill style={{ opacity: p < 0.999 ? 1 : 0 }}>
        {children}
        <AbsoluteFill style={{ background: color, opacity: p * amount }} />
      </AbsoluteFill>
    );
  }
  return <AbsoluteFill style={{ opacity: p >= 0.999 ? 1 : 0 }}>{children}</AbsoluteFill>;
};

export const dipCut = (props: DipProps = {}): TransitionPresentation<DipProps> => ({
  component: DipPresentation,
  props,
});

/* ---------------------------------------------------------- COLOR FLOOD --
 * O chão inteiro troca de cor (wipe de cor) enquanto a nova cena aparece por cima. */
type FloodProps = { color: string; direction?: Dir };

const FloodPresentation: React.FC<TransitionPresentationComponentProps<FloodProps>> = ({
  children,
  presentationProgress: p,
  presentationDirection,
  passedProps: { color, direction = "left" },
}) => {
  if (presentationDirection === "exiting") {
    const inset =
      direction === "left"
        ? `inset(0 0 0 ${100 - p * 100}%)`
        : direction === "right"
          ? `inset(0 ${100 - p * 100}% 0 0)`
          : direction === "up"
            ? `inset(${100 - p * 100}% 0 0 0)`
            : `inset(0 0 ${100 - p * 100}% 0)`;
    return (
      <AbsoluteFill>
        {children}
        <AbsoluteFill style={{ background: color, clipPath: inset }} />
      </AbsoluteFill>
    );
  }
  return <AbsoluteFill style={{ opacity: interpolate(p, [0.55, 1], [0, 1], { extrapolateLeft: "clamp" }) }}>{children}</AbsoluteFill>;
};

export const colorFlood = (props: FloodProps): TransitionPresentation<FloodProps> => ({
  component: FloodPresentation,
  props,
});
