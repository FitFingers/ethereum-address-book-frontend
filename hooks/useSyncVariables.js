import useTransaction from "hooks/useTransaction";
import { useEffect } from "react";

export default function useSyncVariables(refreshVariables) {
  const { txSuccess } = useTransaction();

  // sync / update contract variables
  useEffect(() => {
    if (txSuccess === null) refreshVariables();
  }, [refreshVariables, txSuccess]);
}
