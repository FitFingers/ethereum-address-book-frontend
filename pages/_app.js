import "../styles/globals.css";
import { CssBaseline } from "@material-ui/core";
import ThemeProvider from "theme";
import Modal from "components/modal";
import Snackbar from "components/feedback";
import { ModalContext } from "components/modal/context";
import { FeedbackContext } from "components/feedback/context";
import { AuthContext } from "components/auth/context";
import { TransactionContext } from "hooks/useTransaction";
import { MetaMaskContext } from "hooks/useMetaMask";

function EthereumAddressBook({ Component, pageProps }) {
  return (
    <ThemeProvider>
      <CssBaseline />
      <TransactionContext>
        <ModalContext>
          <FeedbackContext>
            <AuthContext>
              <MetaMaskContext>
                <Component {...pageProps} />
                <Snackbar />
                <Modal />
              </MetaMaskContext>
            </AuthContext>
          </FeedbackContext>
        </ModalContext>
      </TransactionContext>
    </ThemeProvider>
  );
}

export default EthereumAddressBook;
