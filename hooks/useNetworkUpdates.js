import { useEffect } from "react";
import useFeedback from "components/feedback/context";
import { chainID } from "util/network-data";

// show feedback on network changes
export default function useNetworkUpdates(network) {
  const { handleOpen } = useFeedback();

  // monitor initial network connection
  useEffect(() => {
    if (!network) return;
    handleOpen("success", `Connected to the ${network} network`);
  }, [handleOpen, network]);

  // show feedback on successful network change
  useEffect(() => {
    const handleNetworkChange = (chain) => {
      handleOpen("success", `Now using the ${chainID[chain] || chain} network`);
      window.location.reload();
    };
    window.ethereum?.on("chainChanged", handleNetworkChange);
    return () =>
      window.ethereum?.removeListener("chainChanged", handleNetworkChange);
  }, [handleOpen]);

  // show feedback on successful network change
  useEffect(() => {
    const handleAccountChange = ([account]) => {
      handleOpen(
        "success",
        account
          ? `Signed in to new account: ${account?.slice(-4)}`
          : "Signed out"
      );
      // window.location.reload(); // TODO: is it necessary on account change?
    };
    window.ethereum?.on("accountsChanged", handleAccountChange);
    return () =>
      window.ethereum?.removeListener("accountsChanged", handleAccountChange);
  }, [handleOpen]);
}
