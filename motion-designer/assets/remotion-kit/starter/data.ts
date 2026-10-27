/**
 * data.ts — TODO o conteúdo do vídeo (copy, números, fontes, durações) mora aqui.
 * Layout e animação ficam nas cenas. Assim trocar um número ou uma frase
 * nunca exige mexer em animação, e o mesmo vídeo vira template.
 *
 * Regras:
 *  - texto na tela: ≤ 6 palavras por linha em títulos (explainer até ~10);
 *  - números reais, com fonte; o que for exemplo, marque como ilustrativo;
 *  - durações em SEGUNDOS (convertidas com sec(x, fps) nas cenas).
 */
export const DATA = {
  title: "Título do vídeo",
  scenes: [
    { id: "hook", seconds: 3, line: "Uma frase que prende" },
    { id: "ideia", seconds: 4, line: "A ideia principal em uma linha" },
    { id: "fim", seconds: 3, line: "Chamada final" },
  ],
} as const;

export type SceneId = (typeof DATA.scenes)[number]["id"];
