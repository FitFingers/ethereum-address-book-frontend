import { useEffect } from "react";
import useFeedback from "components/feedback/context";
import useAuth from "components/auth/context";
import { ADDRESS_BOOK_ABI } from "util/abi";

// create a contract instance if network is Rinkeby
export default function useAddressBook(
  network,
  validNetworks = [],
  updateMetaMask
) {
  const { handleOpen } = useFeedback();
  const { contractAddress } = useAuth();

  useEffect(() => {
    if (network && !validNetworks.includes(network)) {
      return handleOpen(
        "error",
        "This app only works on Rinkeby. Please connect to the Rinkeby network",
        true
      );
    }
    if (!contractAddress) {
      return handleOpen(
        "error",
        "You must sign in or create an account to use this feature"
      );
    }

    console.log('DEBUG init address book', { contractAddress })

    const addressBookContract = new web3.eth.Contract(
      ADDRESS_BOOK_ABI,
      contractAddress,
      {
        gasLimit: 10000000,
      }
    );
    updateMetaMask({ addressBookContract });
  }, [contractAddress, updateMetaMask, handleOpen, network, validNetworks]);
}
