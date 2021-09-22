import { useEffect } from "react";
import useFeedback from "components/feedback/context";
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
  const { handleOpen } = useFeedback();
  const { isAuthenticated, contractAddress } = useAuth();

  // fetch user's address book on connect or create
  useEffect(() => {
    if (!account || isAuthenticated) return;
    fetchAddressBook();
  }, [account, fetchAddressBook, isAuthenticated]);

  // create the contract once the user's address book address has been fetched (above)
  useEffect(() => {
    if (network && !validNetworks.includes(network)) {
      return handleOpen(
        "error",
        `This app only works on ${validNetworks.join(
          ", "
        )}. Please connect to the one of: ${validNetworks.join(", ")}`,
        true // persist
      );
    }
    if (!contractAddress) {
      return handleOpen(
        "secondary",
        "Welcome! Please connect using the button at the top of the page",
        true
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
  }, [updateMetaMask, handleOpen, network, validNetworks, contractAddress]);
}
