import { PaletteMode } from "@mui/material";

const palette = {
  grey: {
    "50": "#ECEFF1",
    "100": "#CFD8DC",
    "200": "#B0BEC5",
    "300": "#90A4AE",
    "400": "#78909C",
    "500": "#607D8B",
    "600": "#546E7A",
    "700": "#455A64",
    "800": "#37474F",
    "900": "#263238",
  },
  pink: {
    "50": "#F8ECEF",
    "100": "#F1D9E0",
    "200": "#EAC7D1",
    "300": "#E4B4C1",
    "400": "#DDA2B2",
    "500": "#D68FA3",
    "600": "#D07C93",
    "700": "#C96A84",
    "800": "#C25775",
    "900": "#BC4566",
  },
  choco: {
    "900": "#511912",
    "800": "#622f29",
    "700": "#734641",
    "600": "#855e59",
    "500": "#967570",
    "400": "#a88c88",
    "300": "#b9a3a0",
    "200": "#cabab7",
    "100": "#dcd1cf",
    "50": "#ede8e7",
  },
};

export const darkPalette = {
  ...palette,
  contrastThreshold: 4.5,
  mode: "dark" as PaletteMode,
  error: {
    main: "#FF8A65",
  },
  info: {
    main: "#4FC3F7",
  },
  primary: {
    // main: "#64B5F6",
    // main: "#FCC8D1",
    main : "#F8ECEF",
    contrastText: palette.pink[900],
  },
  secondary: {
    main: palette.pink[900],
  },
  success: {
    main: "#81C784",
  },
  // purple: {
  //   main: "#9c27b0",
  // },
  text: {
    primary: palette.pink[100],
    secondary: palette.pink[300],
    disabled: palette.pink[600],
  },
  divider: palette.pink[700],
  background: {
    paper: palette.pink[900],
    grayPaper: palette.pink[700],
    default: palette.pink[800],
  },
  action: {
    selectedOpacity: 0,
    selected: palette.pink[800],
  },
};

export const lightPalette = {
  ...palette,
  contrastThreshold: 3,
  mode: "light" as PaletteMode,
  error: {
    main: "#FF3D00",
  },
  info: {
    main: "#00B0FF",
  },
  primary: {
    // main: "#2962FF",
    main: "#E59999",
    // main: "#511912",

    contrastText: "#FFF",
  },
  secondary: {
    main: "#FFF",
  },
  success: {
    main: "#00E676",
  },
  warning: {
    main: "#FFC400",
  },
  // purple: {
  //   main: "#9c27b0",
  // },
  // orange: {
  //   main: "#ff3d00",
  // },
  text: {
    primary: palette.pink[900],
    secondary: palette.pink[500],
    disabled: palette.pink[300],
  },
  divider: palette.pink[100],
  background: {
    // paper: "#FFF",
    paper: "#F8F8F8",
    disabled: "#fff4e0",
    default: palette.pink[100],
  },
  action: {
    selectedOpacity: 0,
    selected: palette.pink[50],
  },
};
