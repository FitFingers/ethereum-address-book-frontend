import "../styles/globals.css";
import { CssBaseline } from "@material-ui/core";
import { SnackbarProvider } from "notistack";
import ThemeProvider from "theme";
import Modal from "components/modal";
import createSnackbar  from "components/feedback";
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
          <SnackbarProvider
            maxSnack={3}
            variant="success"
            content={createSnackbar}
          >
            <AuthContext>
              <MetaMaskContext>
                <Component {...pageProps} />
                <Modal />
              </MetaMaskContext>
            </AuthContext>
          </SnackbarProvider>
        </ModalContext>
      </TransactionContext>
    </ThemeProvider>
  );
}

export default EthereumAddressBook;
