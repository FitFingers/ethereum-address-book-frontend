import { useEffect, useRef } from "react";
import { useSnackbar } from "notistack";
import useAuth from "components/auth/context";
import { ADDRESS_BOOK_ABI } from "util/abi";

// create a contract instance if network is Rinkeby
export default function useAddressBook(
  account,
  network,
  validNetworks = [],
  updateMetaMask,
  fetchAddressBook
) {
  const { isAuthenticated, contractAddress } = useAuth();
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const { current: snacks } = useRef({}); // TODO: refactor to own hook

  // fetch user's address book on connect or create
  useEffect(() => {
    if (!account || isAuthenticated) return;
    fetchAddressBook();
  }, [account, fetchAddressBook, isAuthenticated]);

  // create the contract once the user's address book address has been fetched (above)
  useEffect(() => {
    if (!contractAddress) {
      snacks.welcome = enqueueSnackbar(
        "Welcome! Please connect using the button at the top of the page",
        { persist: true, variant: "info" }
      );
    }

    if (!window.web3) {
      return enqueueSnackbar(
        "You don't seem to have a Web3 provider installed",
        { persist: true, variant: "error" }
      );
    }

    const addressBookContract = new web3.eth.Contract(
      ADDRESS_BOOK_ABI,
      contractAddress
      // {
      //   gasLimit: 10000000,
      // }
    );

    updateMetaMask({ addressBookContract });
  }, [
    updateMetaMask,
    enqueueSnackbar,
    network,
    validNetworks,
    contractAddress,
    snacks,
  ]);

  // autohide the peristent snackbars when no longer relevant
  useEffect(() => {
    if (isAuthenticated) closeSnackbar(snacks.networks);
    if (contractAddress) closeSnackbar(snacks.welcome);
  }, [
    closeSnackbar,
    contractAddress,
    isAuthenticated,
    snacks,
    snacks.networks,
    snacks.welcome,
  ]);
}
