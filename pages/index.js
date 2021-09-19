import { useCallback, useState } from "react";
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
  Tooltip,
} from "@material-ui/core";
import PersonAddIcon from "@material-ui/icons/PersonAdd";
import PersonRemoveIcon from "@material-ui/icons/PersonAddDisabled";
import PaymentIcon from "@material-ui/icons/Payment";
import Logo from "components/logo";
import Button from "components/button";
import useMetaMask from "hooks/useMetaMask";
import useModal from "components/modal/context";
import { etherscan } from "util/network-data";

/*
  TODO: new functions required:
  1. Clear form on success
  4. Update security timelock
  5. Security timelock should apply to changing the security timelock
  6. Create Factory (for multi user)
  7. Change txCost func
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
    justifyContent: "center",
    alignItems: "center",
  },
  toolbar: {
    display: "flex",
    justifyContent: "space-between",
  },
  tagline: {
    display: "flex",
    alignItems: "center",
    whiteSpace: "nowrap",
  },
  main: {
    position: "relative",
  },
  columns: {
    display: "flex",
    justifyContent: "center",
    "&>*": {
      flex: 1,
      padding: theme.spacing(5),
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
    boxShadow: `inset ${theme.shadows[3].replace(/\),/g, "),inset ")}`,
    marginBottom: theme.spacing(2),
    minHeight: 120,
    maxHeight: 180,
    overflow: "auto",

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
      backgroundColor: theme.palette.text.secondary,
      borderRadius: theme.shape.borderRadius,
      "-webkit-box-shadow": `inset 0 0 ${theme.spacing(
        0.5
      )} rgba(0, 0, 0, 0.3)`,
    },
  },
  optionsList: {
    display: "flex",
    flexDirection: "column",
    marginBottom: theme.spacing(3),
  },
  option: {
    display: "flex",
    justifyContent: "space-between",
    whiteSpace: "nowrap",
    "&>:last-child": {
      fontWeight: "bold",
      overflow: "hidden",
      textOverflow: "ellipsis",
      flex: 1,
      maxWidth: 150,
      textAlign: "right",
      marginLeft: theme.spacing(5),
    },
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
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    padding: theme.spacing(2, 3),
    background: theme.palette.primary.main,
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
    metamask: { network, connectWallet, submitForm },
    contract: {
      totalContacts,
      timelock,
      txCost,
      contactList,
      owner,
      balance,
      refreshVariables,
    },
  } = useMetaMask();

  // UI handlers
  // ===================================================
  const [selected, setSelected] = useState("");
  const handleListItemClick = useCallback(
    (name) => setSelected((n) => (n === name ? null : name)),
    []
  );

  // web3 / contract .send functions (change state)
  // ===================================================
  const addContact = useCallback(() => {
    handleOpen({
      title: "Add Contact",
      description: desc.addContact(),
      contractFunction: "addContact",
      callback: (values) => submitForm(values, "addContact"),
    });
  }, [handleOpen, submitForm]);

  const removeContactByName = useCallback(() => {
    handleOpen({
      title: "Remove Contact",
      description: desc.removeContactByName[!!selected](selected),
      contractFunction: "removeContactByName",
      formDefaults: { name: selected },
      callback: (values) => submitForm(values, "removeContactByName"),
    });
  }, [handleOpen, selected, submitForm]);

  const payContactByName = useCallback(() => {
    handleOpen({
      title: "Send ETH",
      description: desc.payContactByName[!!selected](selected),
      contractFunction: "payContactByName",
      formDefaults: { name: selected },
      callback: (values) =>
        submitForm(values, "payContactByName", {
          value: txCost + values.sendValue + 1,
        }),
    });
  }, [handleOpen, selected, submitForm, txCost]);

  const withdrawFunds = useCallback(() => {
    handleOpen({
      title: "Withdraw Funds",
      description: "Withdraw the funds in this smart contract",
      contractFunction: "withdraw",
      callback: () => submitForm({}, "withdraw")
    });
  }, [handleOpen, submitForm]);

  // button / var labels
  // ===================================================
  // TODO: use date-fns or similar to change timelock to most suitable format
  const totalContactsLabel = totalContacts || "...";
  const timelockLabel = timelock
    ? `${(timelock / (timelock > 90 ? 60 : 1)).toFixed(
        timelock > 90 ? 2 : 0
      )} ${timelock > 90 ? "minutes" : "seconds"}`
    : "...";
  const txCostLabel = txCost ? `${txCost / 1000000000000000000} ETH` : "...";
  const balanceLabel = balance ? `${balance / 1000000000000000000} ETH` : "...";
  const ownerLabel = owner || "...";

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

      <AppBar color="primary">
        <Toolbar className={classes.toolbar}>
          <Link passHref {...linkProps[linkBehaviour]}>
            <a {...linkProps[linkBehaviour]}>
              <Typography variant="h6">Ethereum Address Book</Typography>
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
              <Typography variant="h2" color="textSecondary">
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
                <Box className={classes.optionsList}>
                  <Box className={classes.option}>
                    <Tooltip
                      title="Total number of contacts in the address book"
                      placement="right"
                    >
                      <Typography variant="body1">Total Contacts:</Typography>
                    </Tooltip>
                    <Typography variant="body1">
                      {totalContactsLabel}
                    </Typography>
                  </Box>
                  <Box className={classes.option}>
                    <Tooltip
                      title="Delay between adding contact and allowing the transfer of ETH to them"
                      placement="right"
                    >
                      <Typography variant="body1">
                        Security Timelock:
                      </Typography>
                    </Tooltip>
                    <Typography variant="body1">{timelockLabel}</Typography>
                  </Box>
                  <Box className={classes.option}>
                    <Tooltip
                      title="Cost per transaction for using this service"
                      placement="right"
                    >
                      <Typography variant="body1">Transfer Cost:</Typography>
                    </Tooltip>
                    <Typography variant="body1">{txCostLabel}</Typography>
                  </Box>
                  <Box className={classes.option}>
                    <Tooltip
                      title="The balance of this smart contract"
                      placement="right"
                    >
                      <Typography variant="body1">Contract Balance:</Typography>
                    </Tooltip>
                    <Typography variant="body1">{balanceLabel}</Typography>
                  </Box>
                  <Box className={classes.option}>
                    <Tooltip
                      title="The owner of the contract"
                      placement="right"
                    >
                      <Typography variant="body1">Contract Owner:</Typography>
                    </Tooltip>
                    <Typography variant="body1">{ownerLabel}</Typography>
                  </Box>
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
                    color="secondary"
                    tip="Refresh the contract data"
                    onClick={refreshVariables}
                    network={network}
                  >
                    <Typography variant="body1">Refresh Data</Typography>
                  </Button>
                  <Button
                    color="secondary"
                    tip="Withdraw the balance from the smart contract"
                    onClick={withdrawFunds}
                    network={network}
                  >
                    <Typography variant="body1">Withdraw Funds</Typography>
                  </Button>
                </Box>
              </Box>
            </Paper>
          </Box>
        </Box>
      </main>

      <footer className={classes.footer}>
        <Link
          passHref
          href={`${etherscan[network]}${process.env.NEXT_PUBLIC_CONTRACT_ADDRESS}`}
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
