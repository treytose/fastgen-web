import { createTheme, Theme } from "@mui/material/styles";
import { grey } from "@mui/material/colors";

export type ThemeSelection = {
  name: string;
  theme: Theme;
};

const darkTheme = createTheme({
  palette: {
    primary: {
      main: "rgb(0, 171, 85)", // Buttons, Radios Buttons, etc.
      contrastText: "#FFF",
    },
    secondary: {
      main: "#7ba3c5",
      contrastText: "#8d8d8d",
    },
    background: {
      default: "rgb(22, 28, 36)",
      paper: "#24292e",
    },
    error: {
      main: "#b33229",
    },
    text: {
      primary: "#FFF",
      secondary: "#8d8d8d",
      disabled: grey[800],
    },
    action: {
      disabled: "#8d8d8d",
      disabledBackground: "#000",
    },
  },
});

const defaultTheme = createTheme({
  palette: {
    primary: {
      main: "#6002EE",
      contrastText: "#FFF",
    },
    secondary: {
      main: "#409C64",
      contrastText: "#000",
    },
    background: {
      default: "#FFFFFF",
      paper: "#FFFFFF",
    },
    text: {
      primary: "#000",
      secondary: "#000",
    },
  },
});

export const themes: { [key: string]: ThemeSelection } = {
  default: { name: "default", theme: defaultTheme },
  dark: { name: "dark", theme: darkTheme },
};
