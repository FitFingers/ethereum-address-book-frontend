import "../styles/globals.css";
import { CssBaseline } from "@material-ui/core";
import ThemeProvider from "theme";
import { FeedbackContext } from "components/feedback";

function AddressBookWhitelist({ Component, pageProps }) {
  return (
    <ThemeProvider>
      <CssBaseline />
      <FeedbackContext>
        <Component {...pageProps} />
      </FeedbackContext>
    </ThemeProvider>
  );
}

export default AddressBookWhitelist;
