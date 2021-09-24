import { useEffect } from "react";
import { useSnackbar } from "notistack";
import { chainID } from "util/network-data";

// show feedback on network changes
export default function useNetworkUpdates(network) {
  const { enqueueSnackbar } = useSnackbar();

  // monitor initial network connection
  useEffect(() => {
    if (!network) return;
    enqueueSnackbar(`Connected to the ${network} network`, {
      variant: "success",
    });
  }, [enqueueSnackbar, network]);

  // show feedback on successful network change
  useEffect(() => {
    const handleNetworkChange = (chain) => {
      enqueueSnackbar(`Now using the ${chainID[chain] || chain} network`, {
        variant: "success",
      });
      window.location.reload();
    };
    window.ethereum?.on("chainChanged", handleNetworkChange);
    return () =>
      window.ethereum?.removeListener("chainChanged", handleNetworkChange);
  }, [enqueueSnackbar]);

  // show feedback on successful network change
  useEffect(() => {
    const handleAccountChange = ([account]) => {
      enqueueSnackbar(
        account
          ? `Signed in to new account: ${account?.slice(-4)}`
          : "Signed out",
        { variant: "success" }
      );
      // window.location.reload(); // TODO: is it necessary on account change?
    };
    window.ethereum?.on("accountsChanged", handleAccountChange);
    return () =>
      window.ethereum?.removeListener("accountsChanged", handleAccountChange);
  }, [enqueueSnackbar]);
}
