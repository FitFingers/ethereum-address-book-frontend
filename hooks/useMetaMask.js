import { useCallback, useReducer } from "react";
// import Link from "next/link";
import useFeedback from "components/feedback/context";
import { useContract } from "./useContract";
import { useNetworkUpdates } from "./useNetworkUpdates";
import { useTransactionStatus } from "./useTransactionStatus";
import { useInitWeb3 } from "./useInitWeb3";

// ===================================================
// UTIL / OPTIONS
// ===================================================

const validNetworks = ["rinkeby"];

const networks = {
  "0x1": "Ethereum (Mainnet)",
  "0x2a": "Kovan",
  "0x3": "Ropsten",
  "0x4": "Rinkeby",
  "0x5": "Goerli",
};

// TODO: are these URLs right? If so, change to one URL with dynamic prefix
const etherscan = {
  mainnet: "https://etherscan.io/tx/",
  kovan: "https://kovan.etherscan.io/tx/",
  ropsten: "https://ropsten.etherscan.io/tx/",
  rinkeby: "https://rinkeby.etherscan.io/tx/",
  goerli: "https://goerli.etherscan.io/tx/",
};

// ===================================================
// METAMASK HOOK
// ===================================================

export default function useMetaMask() {
  const { handleOpen } = useFeedback();

  // STATE
  // ===================================================
  // metamask / web3 state
  const [{ account, network, contract, txHash, txSuccess }, dispatch] =
    useReducer((state, moreState) => ({ ...state, ...moreState }), {
      account: null,
      network: null,
      contract: {},
      txHash: null,
      txSuccess: false,
    });

  // HANDLERS
  // ===================================================
  // connect and set the user's public key
  const connectAccount = useCallback(async () => {
    const [acc] = await window.web3.eth.requestAccounts();
    dispatch({ account: acc });
  }, []);

  // connect to the network
  const connectNetwork = useCallback(async () => {
    const connectedNetwork = await window.web3.eth.net.getNetworkType();
    dispatch({ network: connectedNetwork });
  }, []);

  // connect to user's wallet
  const connectWallet = useCallback(async () => {
    try {
      await connectAccount();
      await connectNetwork();
    } catch (err) {
      console.debug("ERROR: couldn't connect wallet", { err });
      handleOpen("error", `Couldn't connect: ${err.message}`);
    }
  }, [connectAccount, connectNetwork, handleOpen]);

  // "unpack" the requested callback from the contract and return (don't invoke)
  const fetchCallback = useCallback(
    (functionName) => {
      try {
        if (!contract?.methods) throw new Error("No contract defined");
        const callback = contract.methods[functionName];
        return () => callback().call({ from: account });
      } catch (err) {
        return () => console.log("DEBUG callback not set");
      }
    },
    [contract.methods, account]
  );

  // EFFECT HOOKS
  // ===================================================
  // init web3 and the smart contract
  useInitWeb3();
  useContract(network, validNetworks, dispatch);

  // show feedback on certain events
  useNetworkUpdates(network);
  useTransactionStatus(txHash, txSuccess, dispatch);

  return {
    network,
    account,
    contract,
    connectWallet,
    fetchCallback,
    updateMetaMask: dispatch,
  };
}
