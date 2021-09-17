import { useCallback, useEffect, useMemo, useReducer } from "react";
// import Link from "next/link";
import Web3 from "web3";
import { ABI } from "util/abi";
import { useFeedback } from "components/feedback";

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

  // connect to user's wallet
  const connectWallet = useCallback(async () => {
    try {
      console.debug("Connecting to wallet...");
      const [acc] = await window.web3.eth.requestAccounts();
      dispatch({ account: acc });
      const network = await window.web3.eth.net.getNetworkType();
      dispatch({ network });
      console.debug("Connected.");
      handleOpen("success", `Successfully connected to ${network}!`);
    } catch (err) {
      console.debug("ERROR: couldn't connect wallet", { err });
      handleOpen("error", `Couldn't connect: ${err.message}`);
    }
  }, [handleOpen]);

  // create a contract instance
  useEffect(() => {
    const contract = new web3.eth.Contract(
      ABI,
      CONTRACT_ADDRESS
      // { gasLimit: "1000000" }
    );
    dispatch({ contract });
  }, []);

  const fetchVariable = useCallback(
    async (functionName) => {
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
    fetchVariable,
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
