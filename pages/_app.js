import "../styles/globals.css";
import { CssBaseline } from "@material-ui/core";
import ThemeProvider from "theme";
import { FeedbackContext, Snackbar } from "components/feedback";

function AddressBookWhitelist({ Component, pageProps }) {
  return (
    <ThemeProvider>
      <CssBaseline />
      <FeedbackContext>
        <Component {...pageProps} />
        <Snackbar />
      </FeedbackContext>
    </ThemeProvider>
  );
}

export default AddressBookWhitelist;
