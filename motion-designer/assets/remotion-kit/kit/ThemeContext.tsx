import React, { createContext, useContext } from "react";
import { defaultTheme, type Theme } from "./theme";

const Ctx = createContext<Theme>(defaultTheme);

/** Envolva a composição inteira: <ThemeProvider theme={meuTema}>…</ThemeProvider> */
export const ThemeProvider: React.FC<{ theme?: Theme; children: React.ReactNode }> = ({
  theme = defaultTheme,
  children,
}) => <Ctx.Provider value={theme}>{children}</Ctx.Provider>;

export const useTheme = () => useContext(Ctx);
