import { useEffect } from "react";

export default function useSyncVariables(txSuccess, refreshVariables) {
  // sync / update contract variables
  useEffect(() => {
    if (txSuccess === null) refreshVariables();
  }, [refreshVariables, txSuccess]);
}
