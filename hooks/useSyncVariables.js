import useTransaction from "hooks/useTransaction";
import { useEffect } from "react";

// sync / update all contract variables every time a transaction was
// reset to its default / complete state
export default function useSyncVariables(refreshVariables) {
  const { txSuccess } = useTransaction();
  useEffect(() => {
    if (txSuccess === null) refreshVariables();
  }, [refreshVariables, txSuccess]);
}
