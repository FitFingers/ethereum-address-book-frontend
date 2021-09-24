import "../styles/globals.css";
import { CssBaseline } from "@material-ui/core";
import ThemeProvider from "theme";
import Modal from "components/modal";
import { FeedbackContext } from "components/feedback/context";
import { ModalContext } from "components/modal/context";
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
