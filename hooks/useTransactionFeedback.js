import { useEffect } from "react";
import useFeedback from "components/feedback/context";
import { etherscan } from "util/network-data";
import useTransaction from "hooks/useTransaction";

function isNewState(newState, oldState) {
  return ![oldState, null].includes(newState);
}

function TransactionLink({ id, network }) {
  return (
    <a href={`${etherscan[network]}tx/${id}`} target="_blank" rel="noreferrer">
      TX ID: {id}
    </a>
  );
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
      handleOpen("success", <TransactionLink id={txHash} network={network} />);
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
