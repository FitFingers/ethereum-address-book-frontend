import { useLayoutEffect, useRef } from "react";
import useFeedback from "components/feedback/context";

// show feedback on transaction updates (new hash, tx complete status)
export function useTransactionStatus(txHash, txSuccess, dispatch) {
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
