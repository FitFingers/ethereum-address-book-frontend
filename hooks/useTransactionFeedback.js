import { useEffect } from "react";
import useFeedback from "components/feedback/context";
import useTransaction from "hooks/useTransaction";
import FeedbackLink from "components/feedback-link";

function isNewState(newState, oldState) {
  return ![oldState, null].includes(newState);
}

// ===================================================
// TRANSACTION HOOK
// ===================================================

// show feedback on transaction updates (new hash, tx complete status)
export default function useTransactionFeedback(network) {
  const { txHash, txSuccess, prevHash, prevSuccess, updateTransaction } =
    useTransaction();
  const { handleOpen } = useFeedback();

  useEffect(() => {
    // on new transaction hash
    if (isNewState(txHash, prevHash)) {
      handleOpen(
        "success",
        <FeedbackLink id={txHash} network={network} short />
      );
      updateTransaction({
        prevHash: txHash,
        prevSuccess: null,
      });
    }

    // on new transaction status
    if (isNewState(txSuccess, prevSuccess)) {
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
