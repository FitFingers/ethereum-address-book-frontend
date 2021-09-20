import { useEffect } from "react";
import useFeedback from "components/feedback/context";
import { FACTORY_ABI } from "util/abi";

// Factory address
const CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS;

// create a contract instance if network is Rinkeby
export default function useFactory(network, validNetworks = [], dispatch) {
  const { handleOpen } = useFeedback();

  useEffect(() => {
    if (network && !validNetworks.includes(network)) {
      return handleOpen(
        "error",
        "This app only works on Rinkeby. Please connect to the Rinkeby network",
        true
      );
    }
    if (!FACTORY_ABI) {
      return handleOpen("error", "Couldn't connect to the smart contract");
    }

    const factoryContract = new web3.eth.Contract(
      FACTORY_ABI,
      CONTRACT_ADDRESS,
      {
        gasLimit: 10000000,
      }
    );
    dispatch({ factoryContract });
  }, [dispatch, handleOpen, network, validNetworks]);
}
