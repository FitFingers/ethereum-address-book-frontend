import { makeStyles, Box } from "@material-ui/core";
import Option from "components/option";
import useMetaMask from "hooks/useMetaMask";
import formatTimestamp from "util/format-date";

// ===================================================
// UTIL
// ===================================================

const variables = [
  {
    label: "Account Open Cost",
    tip: "The cost to start using this service",
  },
  {
    label: "Transaction Cost",
    tip: "Cost per transaction for using this service",
  },
  {
    label: "Total Address Books",
    tip: "The total number of active users of this service",
  },
  {
    label: "Total Contacts",
    tip: "Total number of contacts in the address book",
  },
  {
    label: "Security Timelock",
    tip: "Delay between adding contact and allowing the transfer of ETH to them",
  },
  {
    label: "Balance (Address Book)",
    tip: "The balance of this smart contract",
  },
  {
    label: "Contract Owner",
    tip: "The owner of the contract",
  },
  {
    label: "Balance (Factory)",
    tip: "The balance of this smart contract",
    onlyOwner: true,
  },
  {
    label: "Factory Owner",
    tip: "The creator of this service",
    onlyOwner: true,
  },
];

// ===================================================
// STYLES
// ===================================================

const useStyles = makeStyles((theme) => ({
  dataDisplayPanel: {
    display: "flex",
    flexDirection: "column",
    marginBottom: theme.spacing(3),
  },
}));

// ===================================================
// COMPONENTS
// ===================================================

export default function DataDisplayPanel({}) {
  const classes = useStyles();

  const {
    addressBookContract: { owner, timelock, totalContacts, addressBookBalance },
    factoryContract: {
      txCost,
      totalAddressBooks,
      accountOpenCost,
      factoryBalance,
      factoryOwner,
      isFactoryOwner,
    },
  } = useMetaMask();

  // button / var labels
  // ===================================================
  const labels = {
    "Account Open Cost":
      accountOpenCost && `${window?.web3?.utils.fromWei(accountOpenCost)} ETH`,
    "Transaction Cost": txCost && `${window?.web3?.utils.fromWei(txCost)} ETH`,
    "Total Contacts": totalContacts,
    "Security Timelock": timelock && formatTimestamp(timelock),
    "Balance (Address Book)":
      addressBookBalance &&
      `${window?.web3?.utils.fromWei(addressBookBalance)} ETH`,
    "Balance (Factory)":
      factoryBalance && `${window?.web3?.utils.fromWei(factoryBalance)} ETH`,
    "Contract Owner": owner,
    "Total Address Books": totalAddressBooks,
    "Factory Owner": factoryOwner,
  };

  return (
    <Box className={classes.dataDisplayPanel}>
      {variables.map(({ tip, label, onlyOwner }) => (
        <Option
          tip={tip}
          label={label}
          value={labels[label]}
          onlyOwner={onlyOwner}
          isFactoryOwner={isFactoryOwner}
          key={`option-${label}`}
        />
      ))}
    </Box>
  );
}
