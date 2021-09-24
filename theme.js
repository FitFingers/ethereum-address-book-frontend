import {
  MuiThemeProvider,
  createTheme,
  responsiveFontSizes,
  CssBaseline,
} from "@material-ui/core";

const rootFonts = ["Lato", "Montserrat", "Sans-Serif"].join(",");
const headingFonts = ["Montserrat", "Lato", "Sans-Serif"].join(",");

const rootTheme = createTheme({
  palette: {
    primary: {
      main: "#333333", //"#ECEFF0", // "#333333", // #62688F
    },
    secondary: {
      main: "#8A92B2", // "#ECEFF0", // #8A92B2
    },
    text: {
      primary: "#333333",
    },
    background: {
      default: "#FFFFFF",
      paper: "#FAFAFA",
      toolbar: "#ECEFF0",
    },
    success: {
      main: "#3c963f",
    },
    error: {
      main: "#780101",
    },
    info: {
      main: "#8A92B2", // secondary.main
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
      textOverflow: "ellipsis",
      overflowX: "hidden",
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
  return (
    <MuiThemeProvider theme={theme}>
      <CssBaseline />
      {children}
    </MuiThemeProvider>
  );
}
