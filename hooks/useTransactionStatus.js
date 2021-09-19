import { useLayoutEffect, useRef } from "react";
import useFeedback from "components/feedback/context";

// ===================================================
// UTIL / OPTIONS
// ===================================================

// TODO: are these URLs right? If so, change to one URL with dynamic prefix
const etherscan = {
  mainnet: "https://etherscan.io/tx/",
  kovan: "https://kovan.etherscan.io/tx/",
  ropsten: "https://ropsten.etherscan.io/tx/",
  rinkeby: "https://rinkeby.etherscan.io/tx/",
  goerli: "https://goerli.etherscan.io/tx/",
};

// ===================================================
// TRANSACTION HOOK
// ===================================================

// show feedback on transaction updates (new hash, tx complete status)
export function useTransactionStatus(txHash, txSuccess, dispatch, network) {
  const { handleOpen } = useFeedback();
  const pHash = useRef(null);
  const pSuccess = useRef(null);

  useLayoutEffect(() => {
    // on new transaction hash
    if (txHash && txHash !== pHash.current) {
      pHash.current = txHash;
      handleOpen(
        "success",
        <a
          href={`${etherscan[network]}${txHash}`}
          target="_blank"
          rel="noreferrer"
        >
          TX ID: {txHash}
        </a>
      );
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
  }, [dispatch, handleOpen, network, pHash, pSuccess, txHash, txSuccess]);
}
