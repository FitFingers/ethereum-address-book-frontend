import { useCallback, useReducer } from "react";
import useFeedback from "components/feedback/context";
import { useContract } from "./useContract";
import { useNetworkUpdates } from "./useNetworkUpdates";
import { useTransactionStatus } from "./useTransactionStatus";
import { useInitWeb3 } from "./useInitWeb3";

// ===================================================
// UTIL / OPTIONS
// ===================================================

const validNetworks = ["rinkeby"];

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
      txSuccess: null,
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
