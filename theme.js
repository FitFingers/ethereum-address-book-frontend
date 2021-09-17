import {
  MuiThemeProvider,
  createTheme,
  responsiveFontSizes,
} from "@material-ui/core";

const rootFonts = ["Lato", "Montserrat", "Sans-Serif"].join(",");
const headingFonts = ["Montserrat", "Lato", "Sans-Serif"].join(",");

const rootTheme = createTheme({
  palette: {
    primary: {
      main: "#ECEFF0",
    },
    secondary: {
      main: "#333333",
    },
    text: {
      primary: "#333333",
    },
    background: {
      default: "#FFFFFF",
    },
    error: {
      main: "#780101",
    },
  },
  typography: {
    fontFamily: rootFonts,
    h1: {
      fontFamily: headingFonts,
      fontSize: 53,
      fontWeight: 600,
      marginBottom: 24,
    },
    h2: {
      fontFamily: headingFonts,

      fontSize: 34,
      fontWeight: 600,
      marginBottom: 24,
    },
    h3: {
      fontFamily: headingFonts,
      fontSize: 34,
      fontWeight: 600,
      marginBottom: 24,
    },
    h4: {
      fontFamily: headingFonts,
      fontSize: 34,
      fontWeight: 500,
      marginBottom: 24,
    },
    h5: {
      fontFamily: headingFonts,
      fontSize: 22,
      fontWeight: 600,
      marginBottom: 16,
    },
    h6: {
      fontFamily: headingFonts,
      fontSize: 15,
      fontWeight: 300,
      marginTop: 8,
      marginBottom: 8,
    },
    body1: {
      fontSize: 16,
      fontWeight: 300,
      letterSpacing: "0.035rem",
      lineHeight: 1.8,
    },
    body2: {
      fontSize: 15,
      fontWeight: 300,
    },
    button: {
      fontSize: 14,
      fontWeight: 300,
      letterSpacing: "0.12rem",
    },
    subtitle1: {
      fontSize: 14,
      fontWeight: 300,
      letterSpacing: "0.12rem",
    },
    subtitle2: {
      fontSize: 13,
      fontWeight: 300,
      letterSpacing: "0.12rem",
    },
    caption: {
      fontSize: 12,
      fontWeight: 300,
    },
  },
});

export const theme = responsiveFontSizes(rootTheme);

export default function ThemeProvider({ children }) {
  return <MuiThemeProvider theme={theme}>{children}</MuiThemeProvider>;
}
