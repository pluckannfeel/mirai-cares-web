import { createTheme as createMuiTheme } from "@mui/material";
import { createThemeComponents } from "./components";
import mixins from "./mixins";
import { darkPalette, lightPalette } from "./palette";
import shape from "./shape";
import transitions from "./transitions";
import TypographyM, { TypographyL } from "./typography";

export const createTheme = (
  // direction: "ltr" | "rtl",
  mode: "dark" | "light",
  // added oct 3 2023
  fontSize: "default" | "large" | "small"
) => {
  const palette = mode === "dark" ? darkPalette : lightPalette;

  const typography = fontSize === "default" ? TypographyM : TypographyL;

  // Create base theme
  const baseTheme = createMuiTheme({
    // direction,
    mixins,
    palette,
    shape,
    transitions,
    typography,
  });

  // Inject base theme to be used in components
  return createMuiTheme(
    {
      components: createThemeComponents(baseTheme),
    },
    baseTheme
  );
};
