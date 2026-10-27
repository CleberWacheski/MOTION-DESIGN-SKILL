/**
 * THEME — a identidade visual do filme como DADOS.
 *
 * Regra: nenhum componente do kit inventa cor ou fonte. Tudo vem daqui.
 * Para cada vídeo novo, copie este arquivo e troque os valores pelos do SPEC.md
 * (linha LOOK). Tamanhos são proporcionais à LARGURA/ALTURA da composição, então
 * o mesmo tema funciona em 16:9, 9:16 e 1:1.
 */

export type Theme = {
  name: string;
  colors: {
    ground: string; // fundo principal (nunca "preto puro" por padrão)
    groundAlt: string; // segundo mundo / cartões
    ink: string; // texto e linhas estruturais
    inkSoft: string; // texto secundário (cinza do "cinza → tinta")
    accent: string; // UMA cor de destaque, racionada (1 palavra/elemento por cena)
    accentInk: string; // texto sobre o accent
    positive: string;
    negative: string;
  };
  fonts: {
    display: string; // títulos
    body: string; // apoio
    mono: string; // código / números técnicos
  };
  weights: { display: number; body: number; bold: number };
  /** Tracking (letter-spacing) do display, em em. Display grande pede negativo. */
  displayTracking: string;
  radius: number; // px a 1080 de altura
  grain: number; // 0..1 (0.03–0.06 = sutil; evita banding)
};

export const defaultTheme: Theme = {
  name: "papel-e-tinta",
  colors: {
    ground: "#F2EDE4",
    groundAlt: "#E6DFD3",
    ink: "#141414",
    inkSoft: "#8C867D",
    accent: "#FF4D1C",
    accentInk: "#FFFFFF",
    positive: "#1F9D55",
    negative: "#D7263D",
  },
  fonts: {
    display: "Archivo, Helvetica Neue, Arial, sans-serif",
    body: "Archivo, Helvetica Neue, Arial, sans-serif",
    mono: "IBM Plex Mono, Menlo, monospace",
  },
  weights: { display: 800, body: 500, bold: 700 },
  displayTracking: "-0.03em",
  radius: 24,
  grain: 0.05,
};

/** Alguns pontos de partida — NÃO use como padrão cego; derive do assunto/marca. */
export const themePresets: Record<string, Partial<Theme["colors"]>> = {
  // jornal / editorial quente
  jornal: { ground: "#F4F0E6", ink: "#111111", inkSoft: "#7A766E", accent: "#E63B2E" },
  // risografia azul
  riso: { ground: "#F3EFE6", ink: "#1D3FBB", inkSoft: "#8E9BD6", accent: "#FF5DA2" },
  // neobrutalista
  brutal: { ground: "#FFE45C", ink: "#000000", inkSoft: "#5A5A5A", accent: "#3D5AFE" },
  // produto/tech claro (evita o "void escuro com glow")
  produto: { ground: "#FFFFFF", groundAlt: "#F1F3F5", ink: "#0B0D12", inkSoft: "#8A94A6", accent: "#2F6BFF" },
  // noturno com propósito (quando o assunto É noite/cinema), com textura
  noturno: { ground: "#15161A", groundAlt: "#202228", ink: "#F5F3EE", inkSoft: "#7D7F86", accent: "#FFC233" },
};

/**
 * Escala tipográfica para VÍDEO (não para web).
 * Base = lado curto da composição. Mínimos testados para leitura em celular.
 */
export const typeScale = (width: number, height: number) => {
  const short = Math.min(width, height);
  return {
    hero: Math.round(short * 0.16), // palavra-herói que ocupa a tela
    h1: Math.round(short * 0.085), // título principal (≈92px a 1080)
    h2: Math.round(short * 0.06), // título secundário
    body: Math.round(short * 0.042), // apoio importante (≈45px a 1080)
    caption: Math.round(short * 0.034), // legendas
    min: Math.round(short * 0.026), // NADA legível abaixo disto (≈28px a 1080)
  };
};

/** Margens de segurança (title-safe 80%, action-safe 90%). */
export const safeArea = (width: number, height: number) => ({
  title: { x: Math.round(width * 0.1), y: Math.round(height * 0.1) },
  action: { x: Math.round(width * 0.05), y: Math.round(height * 0.05) },
});
