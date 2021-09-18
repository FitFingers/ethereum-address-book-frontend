import { useCallback, useEffect, useReducer } from "react";
// import Link from "next/link";
import Web3 from "web3";
import { ABI } from "util/abi";
import { useFeedback } from "components/feedback";

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
// METAMASK
// ===================================================

export default function useMetaMask() {
  const { handleOpen } = useFeedback();

  const [{ account, network, contract }, dispatch] = useReducer(
    (state, moreState) => ({ ...state, ...moreState }),
    {
      account: null,
      network: null,
      contract: {},
    }
  );

  // init web3
  useEffect(() => {
    try {
      window.web3 = new Web3(window.ethereum);
    } catch (err) {
      console.debug("ERROR: failed to initialise web3", { err });
    }
  }, []);

  // show feedback on successful network connection and change
  useEffect(() => {
    if (!window.web3) return;
    window.web3.currentProvider?.on("chainChanged", (chain) => {
      handleOpen(
        "success",
        `Now using the ${networks[chain] || chain} network`
      );
      window.location.reload();
    });
  }, [handleOpen]);

  const connectAccount = useCallback(async () => {
    const [acc] = await window.web3.eth.requestAccounts();
    dispatch({ account: acc });
  }, []);

  const connectNetwork = useCallback(async () => {
    const connectedNetwork = await window.web3.eth.net.getNetworkType();
    dispatch({ network: connectedNetwork });
  }, []);

  useEffect(() => {
    if (!network) return;
    handleOpen("success", `Now connected to ${network}!`);
  }, [handleOpen, network]);

  // connect to user's wallet
  const connectWallet = useCallback(async () => {
    try {
      if (network) return connectAccount();
      console.debug("Connecting to wallet...");
      await connectAccount();
      await connectNetwork();
      console.debug("Connected.");
    } catch (err) {
      console.debug("ERROR: couldn't connect wallet", { err });
      handleOpen("error", `Couldn't connect: ${err.message}`);
    }
  }, [connectAccount, connectNetwork, handleOpen, network]);

  // create a contract instance
  useEffect(() => {
    if (network !== "rinkeby") {
      return handleOpen(
        "error",
        "This app only works on Rinkeby. Please connect to the Rinkeby network",
        true
      );
    }
    const contract = new web3.eth.Contract(
      ABI,
      CONTRACT_ADDRESS
      // { gasLimit: "1000000" }
    );
    dispatch({ contract });
  }, [handleOpen, network]);

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

  // // listen for a change in the last hash emitetd and run UI feedback
  // useHashConfirmation(hash);

  // assign a listener to a payable tx to get a hash and then receipt
  // useTransactionConfirmation();

  return {
    connectWallet,
    network,
    account,
    contract,
    fetchCallback,
  };
}

// ===================================================
// NON-CALLABLE HOOKS
// ===================================================

// .send().on("transactionHash", (hash) => {
//   dispatch({ hash });
// });

// function useHashConfirmation(hash) {
//   const { handleOpen } = useFeedback();
//   const prevHash = useRef(null);
//   useEffect(() => {
//     if (!hash || hash === prevHash.current) return;
//     handleOpen(
//       "success",
//       <span>
//         Etherscan:{" "}
//         <Link link={`${ETHERSCAN.rinkeby}${hash}`}>
//           {ETHERSCAN.rinkeby}...{hash.slice(-8)}
//         </Link>
//       </span>
//     );
//     prevHash.current = hash;
//   }, [handleOpen, hash]);
// }

// function useTransactionConfirmation(hash, getTokenIndex) {
//   const { handleOpen } = useFeedback();
//   const prevHash = useRef(null); // previous TX hash (prevent run unless new TX)
//   const tokenIndex = useRef(null); // current number of NFTs

//   // Monitor transaction state
//   useEffect(() => {
//     async function awaitReceipt(recursive) {
//       if (!hash || (!recursive && hash === prevHash.current)) return;
//       if (!recursive) tokenIndex.current = await getTokenIndex();

//       try {
//         // check if block was already mined
//         const txResult = await web3.eth.getTransactionReceipt(hash);

//         // if block not mined, call function again
//         if (!txResult) {
//           console.debug("Awaiting TX confirmation...");
//           return new Promise((res) =>
//             setTimeout(() => res(awaitReceipt(true)), 1000)
//           );
//         }

//         // failed transaction => step out of recursion
//         if (!txResult.status) throw new Error("Transaction was unsuccessful");

//         const tokenId = await getTokenIndex();
//         const tokenIds = [...Array(tokenId - tokenIndex.current)].map(
//           (_, i) => Number(tokenIndex.current) + i
//         );

//         // await sleep(5000);

//         for await (const id of tokenIds) {
//           await fetch(`/api/opensea-metadata/refresh/${id}`, {
//             method: "GET",
//           });
//           await sleep(1000);
//         }

//         handleOpen(
//           "success",
//           "Success: token was minted to your wallet address"
//         );
//       } catch (err) {
//         console.debug("Caught error in useTx", { err });
//         handleOpen("error", "An error occurred while minting");
//       }
//     }

//     awaitReceipt();
//   }, [getTokenIndex, handleOpen, hash]);
// }
