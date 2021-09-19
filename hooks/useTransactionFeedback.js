import { useLayoutEffect } from "react";
import useFeedback from "components/feedback/context";
import { etherscan } from "util/network-data";
import useTransaction from "hooks/useTransaction";

// ===================================================
// TRANSACTION HOOK
// ===================================================

// show feedback on transaction updates (new hash, tx complete status)
export default function useTransactionFeedback(network) {
  const { handleOpen } = useFeedback();
  const { txHash, txSuccess, prevHash, prevSuccess, updateTransaction } = useTransaction();

  useLayoutEffect(() => {
    // on new transaction hash
    if (txHash && txHash !== prevHash) {
      handleOpen(
        "success",
        <a
          href={`${etherscan[network]}tx/${txHash}`}
          target="_blank"
          rel="noreferrer"
        >
          TX ID: {txHash}
        </a>
      );
      updateTransaction({
        prevHash: txHash,
        prevSuccess: null,
      });
    }

    // on new transaction status
    if (txSuccess !== null && txSuccess !== prevSuccess) {
      handleOpen(
        txSuccess ? "success" : "error",
        `Transaction result: ${txSuccess ? "Success" : "Error"}`
      );
      updateTransaction({
        txHash: null,
        txSuccess: null,
        prevSuccess: txSuccess,
      });
    }
  }, [
    updateTransaction,
    handleOpen,
    network,
    prevHash,
    prevSuccess,
    txHash,
    txSuccess,
  ]);
}
