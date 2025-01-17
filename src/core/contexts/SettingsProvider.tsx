import React, { createContext, useContext, useMemo, useState } from "react";

import {
  ThemeProvider as MuiThemeProvider,
  CssBaseline,
  GlobalStyles,
} from "@mui/material";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";

import { useLocalStorage } from "../hooks/useLocalStorage";
import { createTheme } from "../theme";

interface SettingsContextInterface {
  collapsed: boolean;
  // direction: string;
  mode: string;
  fontSize: string;
  open: boolean;
  changeCollapsed: (collapsed: boolean) => void;
  // changeDirection: (direction: "ltr" | "rtl") => void;
  changeMode: (mode: string) => void;
  // added new oct3
  changeFontSize: (fontSize: "default" | "large") => void;
  toggleDrawer: () => void;
}

export const SettingsContext = createContext({} as SettingsContextInterface);

type SettingsProviderProps = {
  children: React.ReactNode;
};

const SettingsProvider = ({ children }: SettingsProviderProps) => {
  // const { i18n } = useTranslation();
  const [collapsed, setCollapsed] = useLocalStorage("sidebarcollapsed", false);
  // const [direction, setDirection] = useLocalStorage("direction", "ltr");
  const [mode, setMode] = useLocalStorage("mode", "light");
  const [fontSize, setFontSize] = useLocalStorage("fontSize", "default");
  const [open, setOpen] = useState(false);

  // useEffect(() => {
  //   document.body.dir = direction;
  // }, [direction]);

  const theme = useMemo(
    () =>
      createTheme(
        // direction as "ltr" | "rtl",
        mode as "dark" | "light",
        fontSize as "default" | "large"
      ),
    [
      // direction,
      mode,
      fontSize,
    ]
  );

  const changeCollapsed = (collapsed: boolean) => {
    if (typeof collapsed === "boolean") {
      setCollapsed(collapsed);
    }
  };

  // const changeDirection = (direction: "ltr" | "rtl") => {
  //   if (direction) {
  //     setDirection(direction);
  //   }
  // };

  const changeMode = (mode: string) => {
    if (mode) {
      setMode(mode);
    }
  };

  // added new oct3
  const changeFontSize = (fontSize: "default" | "large") => {
    if (fontSize) {
      setFontSize(fontSize);
    }
  };

  const toggleDrawer = () => {
    setOpen(!open);
  };

  return (
    <SettingsContext.Provider
      value={{
        collapsed,
        // direction,
        mode,
        fontSize,
        open,
        changeCollapsed,
        // changeDirection,
        changeMode,
        // added new oct3
        changeFontSize,
        toggleDrawer,
      }}
    >
      <MuiThemeProvider theme={theme}>
        <GlobalStyles
          styles={{
            "@keyframes mui-auto-fill": { from: { display: "block" } },
            "@keyframes mui-auto-fill-cancel": { from: { display: "block" } },
          }}
        />
        <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale={"ja"}>
          <CssBaseline />
          {children}
        </LocalizationProvider>
      </MuiThemeProvider>
    </SettingsContext.Provider>
  );
};

export function useSettings() {
  return useContext(SettingsContext);
}

export default SettingsProvider;
