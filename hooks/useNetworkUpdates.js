import { useEffect } from "react";
import useFeedback from "components/feedback/context";

const networks = {
  "0x1": "Ethereum (Mainnet)",
  "0x2a": "Kovan",
  "0x3": "Ropsten",
  "0x4": "Rinkeby",
  "0x5": "Goerli",
};

// show feedback on network changes
export function useNetworkUpdates(network) {
  const { handleOpen } = useFeedback();

  // monitor initial network connection
  useEffect(() => {
    if (!network) return;
    handleOpen("success", `Now connected to ${network}!`);
  }, [handleOpen, network]);

  // show feedback on successful network change
  useEffect(() => {
    // if (!window.web3) return;
    window.web3?.currentProvider?.on("chainChanged", (chain) => {
      handleOpen(
        "success",
        `Now using the ${networks[chain] || chain} network`
      );
      window.location.reload();
    });
  }, [handleOpen]);
}
