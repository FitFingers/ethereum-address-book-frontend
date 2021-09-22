import { etherscan } from "util/network-data";

export default function FeedbackLink({ id, network }) {
  return (
    <a href={`${etherscan[network]}tx/${id}`} target="_blank" rel="noreferrer">
      TX ID: {id}
    </a>
  );
}
