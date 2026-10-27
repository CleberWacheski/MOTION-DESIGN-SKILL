/**
 * fonts.ts — carrega as fontes do tema ANTES do render (senão cai em fonte de
 * sistema silenciosamente). Importado pelo index do kit, então basta importar "./kit".
 *
 * Para trocar a fonte do projeto: troque os imports abaixo pela família do SPEC
 * (ex.: "@remotion/google-fonts/BricolageGrotesque") e atualize theme.ts → fonts.
 * Fonte local (marca): use @remotion/fonts → loadFont({ family, url: staticFile("fonts/x.woff2") }).
 * Requer: npx remotion add @remotion/google-fonts  — e INTERNET no preview/render
 * (as fontes vêm de fonts.gstatic.com). Offline: troque por fontes locais com @remotion/fonts.
 */
import { loadFont as loadArchivo } from "@remotion/google-fonts/Archivo";
import { loadFont as loadMono } from "@remotion/google-fonts/IBMPlexMono";

export const archivo = loadArchivo("normal", {
  weights: ["400", "500", "700", "800", "900"],
  subsets: ["latin", "latin-ext"],
});
export const mono = loadMono("normal", { weights: ["400", "700"], subsets: ["latin", "latin-ext"] });
