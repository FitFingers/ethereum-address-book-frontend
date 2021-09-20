import { useEffect } from "react";
import { FACTORY_ABI } from "util/abi";
import useFeedback from "components/feedback/context";

console.log("DEBUG", FACTORY_ABI);

const CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS;

// create a contract instance if network is Rinkeby
export default function useContract(network, validNetworks = [], dispatch) {
  const { handleOpen } = useFeedback();
  useEffect(() => {
    if (network && !validNetworks.includes(network)) {
      return handleOpen(
        "error",
        "This app only works on Rinkeby. Please connect to the Rinkeby network",
        true
      );
    }
    const contract = new web3.eth.Contract(FACTORY_ABI, CONTRACT_ADDRESS, {
      gasLimit: 10000000,
    });
    dispatch({ contract });
  }, [dispatch, handleOpen, network, validNetworks]);
}
