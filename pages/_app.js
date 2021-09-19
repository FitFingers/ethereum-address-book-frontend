import "../styles/globals.css";
import { CssBaseline } from "@material-ui/core";
import ThemeProvider from "theme";
import Modal from "components/modal";
import Snackbar from "components/feedback";
import { ModalContext } from "components/modal/context";
import { FeedbackContext } from "components/feedback/context";

function EthereumAddressBook({ Component, pageProps }) {
  return (
    <ThemeProvider>
      <CssBaseline />
      <ModalContext>
        <FeedbackContext>
          <Component {...pageProps} />
          <Snackbar />
          <Modal />
        </FeedbackContext>
      </ModalContext>
    </ThemeProvider>
  );
}

export default EthereumAddressBook;
