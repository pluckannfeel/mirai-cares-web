// import { PaletteMode } from "@mui/material";

// const palette = {
//   grey: {
//     "50": "#ECEFF1",
//     "100": "#CFD8DC",
//     "200": "#B0BEC5",
//     "300": "#90A4AE",
//     "400": "#78909C",
//     "500": "#607D8B",
//     "600": "#546E7A",
//     "700": "#455A64",
//     "800": "#37474F",
//     "900": "#263238",
//   },
//   pink: {
//     "50": "#F8ECEF",
//     "100": "#F1D9E0",
//     "200": "#EAC7D1",
//     "300": "#E4B4C1",
//     "400": "#DDA2B2",
//     "500": "#D68FA3",
//     "600": "#D07C93",
//     "700": "#C96A84",
//     "800": "#C25775",
//     "900": "#BC4566",
//   },
//   choco: {
//     "900": "#511912",
//     "800": "#622f29",
//     "700": "#734641",
//     "600": "#855e59",
//     "500": "#967570",
//     "400": "#a88c88",
//     "300": "#b9a3a0",
//     "200": "#cabab7",
//     "100": "#dcd1cf",
//     "50": "#ede8e7",
//   },
// };

// export const darkPalette = {
//   ...palette,
//   contrastThreshold: 4.5,
//   mode: "dark" as PaletteMode,
//   error: {
//     main: "#FF8A65",
//   },
//   info: {
//     main: "#4FC3F7",
//   },
//   primary: {
//     // main: "#64B5F6",
//     // main: "#FCC8D1",
//     main : "#F8ECEF",
//     // contrastText: palette.pink[900],
//     // contrastText: palette.grey[9]
//   },
//   secondary: {
//     main: palette.pink[900],
//   },
//   success: {
//     main: "#81C784",
//   },
//   // purple: {
//   //   main: "#9c27b0",
//   // },
//   text: {
//     primary: palette.pink[100],
//     secondary: palette.pink[300],
//     disabled: palette.pink[600],
//   },
//   divider: palette.pink[700],
//   background: {
//     paper: palette.pink[900],
//     grayPaper: palette.pink[700],
//     default: palette.pink[800],
//   },
//   action: {
//     selectedOpacity: 0,
//     selected: palette.pink[800],
//   },
// };

// export const lightPalette = {
//   ...palette,
//   contrastThreshold: 3,
//   mode: "light" as PaletteMode,
//   error: {
//     main: "#FF3D00",
//   },
//   info: {
//     main: "#00B0FF",
//   },
//   primary: {
//     // main: "#2962FF",
//     main: "#E59999",
//     // main: "#511912",

//     contrastText: "#FFF",
//   },
//   secondary: {
//     main: "#FFF",
//   },
//   success: {
//     main: "#00E676",
//   },
//   warning: {
//     main: "#FFC400",
//   },
//   // purple: {
//   //   main: "#9c27b0",
//   // },
//   // orange: {
//   //   main: "#ff3d00",
//   // },
//   text: {
//     primary: palette.pink[900],
//     secondary: palette.pink[500],
//     disabled: palette.pink[300],
//   },
//   divider: palette.pink[100],
//   background: {
//     // paper: "#FFF",
//     paper: "#F8F8F8",
//     disabled: "#fff4e0",
//     default: palette.pink[100],
//   },
//   action: {
//     selectedOpacity: 0,
//     selected: palette.pink[50],
//   },
// };

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
    main: "#FF8A65", // Error color remains the same
  },
  info: {
    main: "#4FC3F7",
  },
  primary: {
    main: palette.pink[500], // Twitch-inspired pink as primary
    contrastText: "#FFFFFF", // White text for contrast
  },
  secondary: {
    main: palette.pink[800], // Darker pink for secondary (Twitch-inspired)
    contrastText: "#FFFFFF", // Ensures readability
  },
  success: {
    main: "#81C784", // Soft green for success
  },
  text: {
    primary: palette.grey[50], // Light text on dark background
    secondary: palette.grey[300], // Subtle secondary text
    disabled: palette.grey[600], // Muted gray for disabled text
  },
  divider: palette.grey[700], // Lighter gray divider
  background: {
    paper: palette.grey[900], // Dark background for paper (near black)
    default: palette.grey[800], // Slightly lighter dark background
  },
  action: {
    selectedOpacity: 0.1, // Slight opacity for selection highlight
    selected: palette.pink[600], // Highlight with a mid-pink
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
    main: palette.pink[500], // Lighter pink for primary (Twitch-inspired)
    contrastText: "#FFFFFF", // White text for readability
  },
  secondary: {
    main: palette.pink[700], // Darker pink for secondary
    contrastText: "#FFFFFF", // Light text for contrast
  },
  success: {
    main: "#00E676", // Bright success green
  },
  warning: {
    main: "#FFC400", // Yellow for warning
  },
  text: {
    primary: palette.grey[900], // Dark gray text for readability
    secondary: palette.grey[500], // Muted gray text for secondary content
    disabled: palette.grey[300], // Light gray for disabled text
  },
  divider: palette.grey[200], // Light divider
  background: {
    paper: "#FFFFFF", // White paper background
    disabled: "#F5F5F5", // Light gray for disabled state
    default: palette.pink[50], // Very light pink background for light mode
  },
  action: {
    selectedOpacity: 0.1, // Less intense action hover
    selected: palette.pink[100], // Very light pink for active selections
  },
};
