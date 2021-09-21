import { useEffect } from "react";
import Web3 from "web3";

// init web3
export default function useInitWeb3() {
  useEffect(() => {
    try {
      if (typeof window.web3 !== undefined) {
        window.web3 = new Web3(web3.currentProvider);
      } else {
        window.web3 = new Web3(
          new Web3.providers.HttpProvider("http://localhost:8545")
          // new Web3(window.ethereum);
        );
      }
      console.log("DEBUG", window.web3)
    } catch (err) {
      console.debug("ERROR: failed to initialise web3", { err });
    }
  }, []);
}
