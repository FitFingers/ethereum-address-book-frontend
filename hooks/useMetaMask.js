import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useReducer,
  useRef,
} from "react";
// import Link from "next/link";
import Web3 from "web3";
import { ABI } from "util/abi";
import useFeedback from "components/feedback/context";

// ===================================================
// UTIL
// ===================================================

const networks = {
  "0x1": "Ethereum (Mainnet)",
  "0x2a": "Kovan",
  "0x3": "Ropsten",
  "0x4": "Rinkeby",
  "0x5": "Goerli",
};

const validNetworks = ["rinkeby"];

const msg = {
  connected: (network) => `Now connected to ${network}!`,
  wrongNetwork:
    "This app only works on Rinkeby. Please connect to the Rinkeby network",
  genericError: (err) => `Couldn't connect: ${err.message}`,
};

// const isDev = process.env.NODE_ENV === "development";

// const ETHERSCAN = {
//   rinkeby: "https://rinkeby.etherscan.io/tx/",
//   mainnet: "",
// };

const CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS;

// async function sleep(ms) {
//   await new Promise((res) => setTimeout(res, ms));
// }

// ===================================================
// METAMASK HOOK
// ===================================================

export default function useMetaMask() {
  const { handleOpen } = useFeedback();

  // metamask / web3 state
  const [{ account, network, contract, txHash, txSuccess }, dispatch] =
    useReducer((state, moreState) => ({ ...state, ...moreState }), {
      account: null,
      network: null,
      contract: {},
      txHash: null,
      txSuccess: false,
    });

  // init web3 and the smart contract
  useInitWeb3();
  useContract(network, validNetworks, dispatch);

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
      handleOpen("error", msg.genericError(err));
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

  // ===================================================
  // NON-CALLABLE HOOKS THAT RUN AUTOMATICALLY
  // ===================================================

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

// ===================================================
// NON-CALLABLE HOOKS
// ===================================================

// init web3
function useInitWeb3() {
  useEffect(() => {
    try {
      window.web3 = new Web3(window.ethereum);
    } catch (err) {
      console.debug("ERROR: failed to initialise web3", { err });
    }
  }, []);
}

// create a contract instance if network is Rinkeby
function useContract(network, validNetworks = [], dispatch) {
  const { handleOpen } = useFeedback();
  useEffect(() => {
    if (network && !validNetworks.includes(network)) {
      return handleOpen("error", msg.wrongNetwork, true);
    }
    const contract = new web3.eth.Contract(ABI, CONTRACT_ADDRESS, {
      gasLimit: 10000000,
    });
    dispatch({ contract });
  }, [dispatch, handleOpen, network, validNetworks]);
}

// show feedback on network changes
function useNetworkUpdates(network) {
  const { handleOpen } = useFeedback();
  useEffect(() => {
    if (!network) return;
    handleOpen("success", msg.connected(network));
  }, [handleOpen, network]);
}

// show feedback on transaction updates (new hash, tx complete status)
function useTransactionStatus(txHash, txSuccess, dispatch) {
  const { handleOpen } = useFeedback();
  const pHash = useRef(null);
  const pSuccess = useRef(null);

  useLayoutEffect(() => {
    // on new transaction hash
    if (txHash && txHash !== pHash.current) {
      pHash.current = txHash;
      handleOpen("success", `TX ID: ${txHash}`);
      pSuccess.current = null;
    }

    // on new transaction status
    if (txSuccess && txSuccess !== pSuccess.current) {
      pSuccess.current = txSuccess;
      handleOpen(
        txSuccess ? "success" : "error",
        `Transaction result: ${txSuccess ? "Success" : "Error"}`
      );
      pHash.current = null;
      pSuccess.current = null;
      dispatch({ txHash: null, txSuccess: null });
    }
  }, [dispatch, handleOpen, pHash, pSuccess, txHash, txSuccess]);
}
