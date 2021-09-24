import { useEffect } from "react";
import { useSnackbar } from "notistack";
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
  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    // on new transaction hash
    if (isNewState(txHash, prevHash)) {
      enqueueSnackbar(<FeedbackLink id={txHash} network={network} short />, {
        variant: "success",
      });
      updateTransaction({
        prevHash: txHash,
        prevSuccess: null,
      });
    }

    // on new transaction status
    if (isNewState(txSuccess, prevSuccess)) {
      enqueueSnackbar(
        `Transaction result: ${txSuccess ? "Success" : "Error"}`,
        { variant: txSuccess ? "success" : "error" }
      );
      updateTransaction({
        txHash: null,
        txSuccess: null,
        prevSuccess: txSuccess,
      });
    }
  }, [
    updateTransaction,
    enqueueSnackbar,
    network,
    prevHash,
    prevSuccess,
    txHash,
    txSuccess,
  ]);
}
