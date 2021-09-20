import { useEffect } from "react";
import useFeedback from "components/feedback/context";

const CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS;

// create a contract instance if network is Rinkeby
export default function useContract(
  network,
  validNetworks = [],
  dispatch,
  ABI,
  name
) {
  const { handleOpen } = useFeedback();
  useEffect(() => {
    if (network && !validNetworks.includes(network)) {
      return handleOpen(
        "error",
        "This app only works on Rinkeby. Please connect to the Rinkeby network",
        true
      );
    }
    if (!ABI) {
      return handleOpen(
        "error",
        "You must sign in or create an account to use this feature"
      );
    }

    const contract = new web3.eth.Contract(ABI, CONTRACT_ADDRESS, {
      gasLimit: 10000000,
    });
    dispatch({ [name]: contract });
  }, [ABI, dispatch, handleOpen, name, network, validNetworks]);
}
