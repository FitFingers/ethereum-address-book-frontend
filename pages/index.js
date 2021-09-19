import { useCallback, useEffect, useReducer, useState } from "react";
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
  Button,
  ListItem,
} from "@material-ui/core";
import PersonAddIcon from "@material-ui/icons/PersonAdd";
import PersonRemoveIcon from "@material-ui/icons/PersonAddDisabled";
import PaymentIcon from "@material-ui/icons/Payment";
import Logo from "components/logo";
import useMetaMask from "hooks/useMetaMask";
import useModal from "components/modal/context";
import { etherscan } from "util/network-data";

/*
  TODO: new functions required:
  1. Update variables on txSuccess (bonus points for useSWR)
  2. Close Modal feedback (show spinner or text while waiting for response, plus "you may close this window")
  3. Investigate the short feedback duration (could be imagined)
  4. Update security timelock
  5. Security timelock should apply to changing the security timelock
  6. Create Factory (for multi user)
  7. Disable content until connected
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

// The order of the parameters to send to contract (sort order of params)
const formConfig = {
  addContact: ["name", "address"],
  removeContactByName: ["name"],
  payContactByName: ["sendValue"],
};

function sortArguments(values, name) {
  return formConfig[name].map((key) => values[key]);
}

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
    "&>$button": {
      margin: theme.spacing(1, 0),
      "&:last-child": {
        marginBottom: 0,
      },
    },
  },
  buttonRow: {
    display: "flex",
    margin: theme.spacing(0, -1),
    "&>$button": {
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

  // init web3 contract (NOT contract contents)
  // ===================================================
  const {
    connectWallet,
    network,
    fetchCallback,
    contract,
    account,
    updateMetaMask,
  } = useMetaMask();

  // web3 variables
  // ===================================================
  const [{ totalContacts, timelock, txCost, contactList, owner }, dispatch] =
    useReducer((state, moreState) => ({ ...state, ...moreState }), {
      totalContacts: null, // total numbers of contacts in address book
      timelock: null, // time until address is whitelisted
      txCost: null, // cost to send a transaction via this service
      owner: null, // contract owner's address
      contactList: [],
    });

  // initialise contract variables
  // ===================================================
  const refreshVariables = useCallback(async () => {
    if (!network) return;
    dispatch({
      totalContacts: await fetchCallback("totalContacts")(),
      timelock: await fetchCallback("securityTimelock")(),
      txCost: await fetchCallback("transferPrice")(),
      owner: await fetchCallback("owner")(),
      contactList: await fetchCallback("readAllContacts")(),
    });
  }, [fetchCallback, network]);

  useEffect(() => {
    refreshVariables();
  }, [refreshVariables]);

  // UI handlers
  // ===================================================
  const [selected, setSelected] = useState("");
  const handleListItemClick = useCallback(
    (name) => setSelected((n) => (n === name ? null : name)),
    []
  );

  // all-purpose submit function for Modal forms
  const submitForm = useCallback(
    async (values, name, data = {}) => {
      const sortedArgs = sortArguments(values, name);
      contract.methods[name](...sortedArgs) // fetch function
        .send({ from: account, ...data /*, value: txCost */ })
        .on("transactionHash", (txHash) => updateMetaMask({ txHash }))
        .on("receipt", ({ status }) => updateMetaMask({ txSuccess: status }));
    },
    [account, contract.methods, updateMetaMask]
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
      callback: () => submitForm({ name: selected }, "removeContactByName"),
    });
  }, [handleOpen, selected, submitForm]);

  const payContactByName = useCallback(() => {
    handleOpen({
      title: "Send ETH",
      description: desc.payContactByName[!!selected](selected),
      contractFunction: "payContactByName",
      formDefaults: { name: selected },
      callback: ({ wei }) =>
        submitForm({ name: selected }, "payContactByName", { sendValue: wei }),
    });
  }, [handleOpen, selected, submitForm]);

  const checkBalance = useCallback(() => {
    handleOpen({
      title: "Check Contract Balance",
      description: "View this smart contract's balance",
    });
  }, [handleOpen]);

  const withdrawFunds = useCallback(() => {
    handleOpen({
      title: "Withdraw Funds",
      description: "Withdraw the funds in this smart contract",
    });
  }, [handleOpen]);

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
                  variant="contained"
                  color="primary"
                  onClick={removeContactByName}
                  className={classes.button}
                >
                  <PersonRemoveIcon />
                </Button>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={payContactByName}
                  className={classes.button}
                >
                  <PaymentIcon />
                </Button>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={addContact}
                  className={classes.button}
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
                    <Typography variant="body1">Total Contacts:</Typography>
                    <Typography variant="body1">
                      {totalContactsLabel}
                    </Typography>
                  </Box>
                  <Box className={classes.option}>
                    <Typography variant="body1">Security Timelock:</Typography>
                    <Typography variant="body1">{timelockLabel}</Typography>
                  </Box>
                  <Box className={classes.option}>
                    <Typography variant="body1">Transfer Cost:</Typography>
                    <Typography variant="body1">{txCostLabel}</Typography>
                  </Box>
                  <Box className={classes.option}>
                    <Typography variant="body1">Contract Owner:</Typography>
                    <Typography variant="body1">{ownerLabel}</Typography>
                  </Box>
                </Box>
              </Box>
              <Box>
                <Typography variant="h3">Functions</Typography>
                <Box className={classes.buttonList}>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={addContact}
                    className={classes.button}
                  >
                    <Typography variant="body1">Add Contact</Typography>
                  </Button>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={removeContactByName}
                    className={classes.button}
                  >
                    <Typography variant="body1">Remove Contact</Typography>
                  </Button>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={payContactByName}
                    className={classes.button}
                  >
                    <Typography variant="body1">Pay Contact</Typography>
                  </Button>
                  <Button
                    variant="contained"
                    color="secondary"
                    onClick={checkBalance}
                    className={classes.button}
                  >
                    <Typography variant="body1">Check Balance</Typography>
                  </Button>
                  <Button
                    variant="contained"
                    color="secondary"
                    onClick={withdrawFunds}
                    className={classes.button}
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
