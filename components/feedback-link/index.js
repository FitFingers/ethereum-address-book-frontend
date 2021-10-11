// import useMetaMask from "hooks/useMetaMask";
import { etherscan } from "util/network-data";
import { Typography } from "@material-ui/core";

export default function FeedbackLink({
  id,
  network = "rinkeby",
  short = false,
}) {
  // const {
  //   metamask: { network },
  // } = useMetaMask();
  return (
    <a href={`${etherscan[network || "rinkeby"]}tx/${id}`} target="_blank" rel="noreferrer">
      <Typography variant="body1">
        {short ? "TX ID" : "Transaction hash"}: {id}
      </Typography>
    </a>
  );
}
