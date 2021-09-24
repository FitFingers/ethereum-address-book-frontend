import { useEffect } from "react";
import { useSnackbar } from "notistack";
import { FACTORY_ABI } from "util/abi";
import { getFactoryAddress } from "util/env-funcs";

// Factory address
const FACTORY_ADDRESS = getFactoryAddress();

// create a contract instance if network is Rinkeby
export default function useFactory(
  network,
  validNetworks = [],
  updateMetaMask
) {
  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    if (network && !validNetworks.includes(network)) {
      return enqueueSnackbar(
        "This app only works on Rinkeby. Please connect to the Rinkeby network",
        { persist: true, variant: "error" }
      );
    }
    if (!FACTORY_ABI) {
      return enqueueSnackbar("Couldn't connect to the smart contract", {
        variant: "error",
      });
    }

    const factoryContract = new web3.eth.Contract(
      FACTORY_ABI,
      FACTORY_ADDRESS
      // {
      //   gasLimit: 10000000,
      // }
    );

    updateMetaMask({ factoryContract });
  }, [updateMetaMask, enqueueSnackbar, network, validNetworks]);
}
