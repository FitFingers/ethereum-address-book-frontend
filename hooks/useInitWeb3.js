import { useEffect } from "react";
import Web3 from "web3";

// init web3
export function useInitWeb3() {
  useEffect(() => {
    try {
      window.web3 = new Web3(window.ethereum);
    } catch (err) {
      console.debug("ERROR: failed to initialise web3", { err });
    }
  }, []);
}
