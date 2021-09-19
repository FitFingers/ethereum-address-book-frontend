import { useEffect } from "react";
import useFeedback from "components/feedback/context";

// show feedback on network changes
export function useNetworkUpdates(network) {
  const { handleOpen } = useFeedback();
  useEffect(() => {
    if (!network) return;
    handleOpen("success", `Now connected to ${network}!`);
  }, [handleOpen, network]);
}
