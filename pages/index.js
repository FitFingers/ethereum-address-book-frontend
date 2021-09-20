import { useCallback, useMemo, useState } from "react";
import Head from "next/head";
import Link from "next/link";
import {
  makeStyles,
  Box,
  List,
  ListItemText,
  Typography,
  AppBar,
  Toolbar,
  Paper,
  ListItem,
} from "@material-ui/core";
import PersonAddIcon from "@material-ui/icons/PersonAdd";
import PersonRemoveIcon from "@material-ui/icons/PersonAddDisabled";
import PaymentIcon from "@material-ui/icons/Payment";
import Logo from "components/logo";
import Button from "components/button";
import Option from "components/option";
import useMetaMask from "hooks/useMetaMask";
import useModal from "components/modal/context";
import formatTimestamp from "util/format-date";
import { etherscan } from "util/network-data";

/*
  TODO: new functions required:
  1. Remove "you must sign in" feedback on page load OR change to "welcome"
  4. "A controlled component is changed to uncontrolled"
*/

// ===================================================
// UTIL (PAGE OPTIONS)
// ===================================================

const linkBehaviour = "samesite";

const linkProps = {
  portfolio: {
    href: "https://www.jameshooper.io",
    target: "_blank",
    rel: "noopener noreferrer",
  },
  samesite: {
    href: "/",
  },
};

// messages, descriptions etc
const desc = {
  addContact: () => "Use this form to add a user to your address book",
  removeContactByName: {
    true: (contact) => `Are you sure you wish to remove ${contact}?`,
    false: () => "No contacts selected!",
  },
  payContactByName: {
    true: (contact) => `Use this form to send ETH to ${contact}`,
    false: () => "Please select a contact to send ETH to",
  },
};

const variables = [
  {
    label: "Total Contacts",
    tip: "Total number of contacts in the address book",
  },
  {
    label: "Security Timelock",
    tip: "Delay between adding contact and allowing the transfer of ETH to them",
  },
  {
    label: "Transaction Cost",
    tip: "Cost per transaction for using this service",
  },
  {
    label: "Contract Balance",
    tip: "The balance of this smart contract",
  },
  {
    label: "Contract Owner",
    tip: "The owner of the contract",
  },
];

// ===================================================
// STYLES
// ===================================================

const useStyles = makeStyles((theme) => ({
  container: {
    minHeight: "100vh",
    width: "100vw",
    background: theme.palette.background.default,
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    alignItems: "center",
  },
  toolbar: {
    display: "flex",
    justifyContent: "space-between",
    background: theme.palette.background.toolbar,
    "& a .MuiTypography-root": {
      ...theme.typography.h6,
    },
    [theme.breakpoints.down("sm")]: {
      flexDirection: "column",
      paddingTop: theme.spacing(2),
      "& a .MuiTypography-root": {
        fontSize: 18,
      },
    },
  },
  tagline: {
    display: "flex",
    alignItems: "center",
    whiteSpace: "nowrap",
    [theme.breakpoints.down("sm")]: {
      whiteSpace: "break-spaces",
      textAlign: "right",
      "&>*": {
        flex: 1,
      },
    },
  },
  main: {
    position: "relative",
    padding: theme.spacing(12, 0),
    [theme.breakpoints.down("sm")]: {
      padding: theme.spacing(0),
      width: "100%",
    },
  },
  columns: {
    display: "flex",
    justifyContent: "center",
    "&>*": {
      flex: 1,
      padding: theme.spacing(5),
    },
    [theme.breakpoints.down("sm")]: {
      flexDirection: "column",
      "&>*": {
        padding: theme.spacing(2),
      },
    },
  },
  listitem: {
    "& .MuiTypography-root": {
      transition: theme.transitions.create("color", {
        duration: theme.transitions.duration.shorter,
      }),
    },
    "&:hover": {
      color: theme.palette.getContrastText(theme.palette.secondary.main),
      background: theme.palette.secondary.light,
    },
    "&.Mui-selected": {
      color: theme.palette.getContrastText(theme.palette.secondary.main),
      background: theme.palette.secondary.main,
      "&:hover": {
        color: theme.palette.getContrastText(theme.palette.secondary.main),
        background: theme.palette.secondary.main,
      },
    },
  },
  infoPanel: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
  },
  titles: {
    margin: theme.spacing(4, "auto"),
    textAlign: "center",
    [theme.breakpoints.down("sm")]: {
      margin: theme.spacing(8, 0),
    },
  },
  paperPanel: {
    height: "100%",
    padding: theme.spacing(5),
    maxWidth: theme.breakpoints.values.lg,
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
  },
  contactWindow: {
    borderRadius: theme.shape.borderRadius,
    background: theme.palette.background.default,
    boxShadow: `inset ${theme.shadows[3].replace(/\),/g, "),inset ")}`,
    marginBottom: theme.spacing(2),
    minHeight: 120,
    height: "100%",
    overflow: "auto",
    [theme.breakpoints.down("sm")]: {
      minHeight: 220,
    },

    "&::-webkit-scrollbar-track": {
      borderRadius: theme.shape.borderRadius,
      backgroundColor: "inherit",
      "-webkit-box-shadow": `inset 0 0 ${theme.spacing(
        0.5
      )} rgba(0, 0, 0, 0.3)`,
    },
    "&::-webkit-scrollbar": {
      width: theme.spacing(0.5),
      background: "#f5f5f5",
    },
    "&::-webkit-scrollbar-thumb": {
      backgroundColor: theme.palette.secondary.main,
      borderRadius: theme.shape.borderRadius,
      "-webkit-box-shadow": `inset 0 0 ${theme.spacing(
        0.5
      )} rgba(0, 0, 0, 0.3)`,
    },
  },
  variablesList: {
    display: "flex",
    flexDirection: "column",
    marginBottom: theme.spacing(3),
  },
  buttonList: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    "&>span": {
      margin: theme.spacing(1, 0),
      "&:last-child": {
        marginBottom: 0,
      },
    },
  },
  buttonRow: {
    display: "flex",
    margin: theme.spacing(0, -1),
    "&>span": {
      margin: theme.spacing(0, 1),
      flex: 1,
    },
  },
  button: {},
  footer: {
    position: "relative",
    width: "100vw",
    marginBottom: 0,
    bottom: 0,
    left: 0,
    right: 0,
    padding: theme.spacing(2, 3),
    background: theme.palette.background.toolbar,
    color: theme.palette.text.secondary,
    textAlign: "center",
  },
}));

// ===================================================
// COMPONENTS
// ===================================================

export default function Home() {
  const classes = useStyles();
  const { handleOpen } = useModal();

  // init web3, extract state and contract content
  // ===================================================
  const {
    metamask: {
      network,
      connectWallet,
      submitForm,
      factoryContract,
      addressBookContract,
    },
    addressBookContract: {
      isOwner,
      totalContacts,
      timelock,
      contactList,
      owner,
      balance,
      refreshVariables,
    },
    factoryContract: {
      txCost,
      totalAddressBooks,
      accountOpenCost,
      factoryBalance,
      factoryOwner,
    },
  } = useMetaMask();

  // UI handlers
  // ===================================================
  const [selected, setSelected] = useState("");
  const handleListItemClick = useCallback(
    (name) => setSelected((n) => (n === name ? null : name)),
    []
  );

  // address book .send functions (change state)
  // ===================================================
  const addContact = useCallback(() => {
    handleOpen({
      title: "Add Contact",
      description: desc.addContact(),
      contractFunction: "addContact",
      callback: (values) =>
        submitForm(values, "addContact", {}, factoryContract),
    });
  }, [handleOpen, factoryContract, submitForm]);

  const removeContactByName = useCallback(() => {
    handleOpen({
      title: "Remove Contact",
      description: desc.removeContactByName[!!selected](selected),
      contractFunction: "removeContactByName",
      formDefaults: { name: selected },
      callback: (values) =>
        submitForm(values, "removeContactByName", {}, factoryContract),
    });
  }, [handleOpen, selected, factoryContract, submitForm]);

  const payContactByName = useCallback(() => {
    handleOpen({
      title: "Send ETH",
      description: desc.payContactByName[!!selected](selected),
      contractFunction: "payContactByName",
      formDefaults: { name: selected },
      callback: (values) =>
        submitForm(
          values,
          "payContactByName",
          {
            value: Number(txCost) + Number(values.sendValue), // +1
          },
          factoryContract
        ),
    });
  }, [handleOpen, selected, factoryContract, submitForm, txCost]);

  const withdrawAddressBookFunds = useCallback(() => {
    handleOpen({
      title: "Withdraw Funds",
      description: "Withdraw the funds in this smart contract",
      contractFunction: "withdraw",
      callback: () => submitForm({}, "withdraw", {}, addressBookContract),
    });
  }, [addressBookContract, handleOpen, submitForm]);

  const updateTimelock = useCallback(() => {
    handleOpen({
      title: "Update Security Timelock",
      description:
        "Change the security timelock. This will change the length of time that must pass before you may transfer ETH to a new contact",
      contractFunction: "updateTimelock",
      callback: (values) =>
        submitForm(values, "updateTimelock", {}, factoryContract),
    });
  }, [handleOpen, factoryContract, submitForm]);

  // factory .send functions
  // ===================================================
  // createAddressBook
  // updateAccountOpenCost
  // checkBalance

  const updateTransactionCost = useCallback(() => {
    handleOpen({
      title: "Update Transaction Cost",
      description: "Change the value this service charges for each interaction",
      contractFunction: "updateTransactionCost",
      callback: (values) =>
        submitForm(values, "updateTransactionCost", {}, factoryContract),
    });
  }, [handleOpen, factoryContract, submitForm]);

  const withdrawFactoryFunds = useCallback(() => {
    handleOpen({
      title: "Withdraw Funds",
      description: "Withdraw the funds in this smart contract",
      contractFunction: "withdraw",
      callback: () => submitForm({}, "withdraw", {}, factoryContract),
    });
  }, [factoryContract, handleOpen, submitForm]);

  // button / var labels
  // ===================================================
  const labels = useMemo(
    () => ({
      "Total Contacts": totalContacts || null,
      "Security Timelock": timelock ? formatTimestamp(timelock) : null,
      "Transaction Cost": txCost
        ? `${window?.web3?.utils.fromWei(txCost)} ETH`
        : null,
      "Contract Balance": balance
        ? `${window?.web3?.utils.fromWei(balance)} ETH`
        : null,
      "Contract Owner": owner || null,
    }),
    [balance, owner, timelock, totalContacts, txCost]
  );

  return (
    <Box className={classes.container}>
      <Head>
        <title>Ethereum Address Book</title>
        <meta
          name="description"
          content="Address book for Ethereum users. Add and remove contacts and send transactions to them"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <AppBar color="transparent" position="relative">
        <Toolbar className={classes.toolbar}>
          <Link passHref {...linkProps[linkBehaviour]}>
            <a {...linkProps[linkBehaviour]}>
              <Typography>Ethereum Address Book</Typography>
            </a>
          </Link>
          <Box className={classes.tagline}>
            <Typography variant="h6">Active network:</Typography>
            <Logo network={network} handleClick={connectWallet} />
          </Box>
        </Toolbar>
      </AppBar>

      <main className={classes.main}>
        <Box className={classes.columns}>
          <Box className={classes.infoPanel}>
            <Box className={classes.titles}>
              <Typography variant="h1">Ethereum Address Book</Typography>
              <Typography variant="h2" color="secondary">
                Manage contacts and send transactions
              </Typography>
            </Box>

            <Paper
              elevation={5}
              className={[classes.paperPanel, classes.smallPanel]}
            >
              <Typography variant="h3">Contacts</Typography>
              <Box className={classes.contactWindow}>
                <List>
                  {contactList.length ? (
                    contactList.map((contact) => (
                      <ListItem
                        className={classes.listitem}
                        button
                        disableRipple
                        selected={selected === contact.name}
                        onClick={() => handleListItemClick(contact.name)}
                        key={`contact-list-${contact.name}`}
                      >
                        <ListItemText primary={contact.name} />
                      </ListItem>
                    ))
                  ) : (
                    <ListItem>
                      <ListItemText
                        primary="Your address book appears to be empty!"
                        secondary="Try connecting your wallet or adding a contact using the buttons on this page."
                      />
                    </ListItem>
                  )}
                </List>
              </Box>
              <Box className={classes.buttonRow}>
                <Button
                  onClick={removeContactByName}
                  tip="Remove the selected contact"
                  network={network}
                >
                  <PersonRemoveIcon />
                </Button>
                <Button
                  onClick={payContactByName}
                  tip="Pay the selected contact"
                  network={network}
                >
                  <PaymentIcon />
                </Button>
                <Button
                  onClick={addContact}
                  tip="Add a new contact"
                  network={network}
                >
                  <PersonAddIcon />
                </Button>
              </Box>
            </Paper>
          </Box>

          <Box>
            <Paper elevation={5} className={classes.paperPanel}>
              <Box>
                <Typography variant="h3">Variables</Typography>
                <Box className={classes.variablesList}>
                  {variables.map(({ tip, label }) => (
                    <Option
                      tip={tip}
                      label={label}
                      value={labels[label]}
                      key={`option-${label}`}
                    />
                  ))}
                </Box>
              </Box>
              <Box>
                <Typography variant="h3">Functions</Typography>
                <Box className={classes.buttonList}>
                  <Button
                    onClick={addContact}
                    tip="Add a new contact"
                    network={network}
                  >
                    <Typography variant="body1">Add Contact</Typography>
                  </Button>
                  <Button
                    onClick={removeContactByName}
                    tip="Remove the selected contact"
                    network={network}
                  >
                    <Typography variant="body1">Remove Contact</Typography>
                  </Button>
                  <Button
                    onClick={payContactByName}
                    tip="Pay the selected contact"
                    network={network}
                  >
                    <Typography variant="body1">Pay Contact</Typography>
                  </Button>
                  <Button
                    color="primary"
                    tip="Refresh the contract data"
                    onClick={refreshVariables}
                    network={network}
                  >
                    <Typography variant="body1">Refresh Data</Typography>
                  </Button>
                  <Button
                    color="primary"
                    tip="Update the security timelock"
                    onClick={updateTimelock}
                    network={network}
                  >
                    <Typography variant="body1">Update Timelock</Typography>
                  </Button>
                  <Button
                    color="primary"
                    tip="Update the transaction cost"
                    onClick={updateTransactionCost}
                    network={network}
                  >
                    <Typography variant="body1">
                      Update Transaction Cost
                    </Typography>
                  </Button>
                  <Button
                    color="primary"
                    tip="Withdraw the balance from the smart contract"
                    onClick={withdrawAddressBookFunds}
                    network={network}
                  >
                    <Typography variant="body1">
                      Withdraw Funds (Address Book)
                    </Typography>
                  </Button>

                  {isOwner && (
                    <Button
                      color="primary"
                      tip="Withdraw the balance from the smart contract"
                      onClick={withdrawFactoryFunds}
                      network={network}
                    >
                      <Typography variant="body1">
                        Withdraw Funds (Factory)
                      </Typography>
                    </Button>
                  )}
                </Box>
              </Box>
            </Paper>
          </Box>
        </Box>
      </main>

      <footer className={classes.footer}>
        <Link
          passHref
          href={`${etherscan[network]}address/${process.env.NEXT_PUBLIC_CONTRACT_ADDRESS}`}
        >
          <a target="_blank" rel="noreferrer">
            <Typography variant="h6">
              Contract address: {process.env.NEXT_PUBLIC_CONTRACT_ADDRESS}
            </Typography>
          </a>
        </Link>
        <Link passHref {...linkProps[linkBehaviour]}>
          <a {...linkProps[linkBehaviour]}>
            <Typography variant="h6">
              © {new Date().getFullYear()} Ethereum Address Book
            </Typography>
          </a>
        </Link>
      </footer>
    </Box>
  );
}
