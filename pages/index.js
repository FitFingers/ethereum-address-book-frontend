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
    whiteSpace: "nowrap"
  },
  main: {
    position: "relative",
  },
  columns: {
    display: "flex",
    justifyContent: "center",
    "&>*": {
      flex: 1,
      margin: theme.spacing(2),
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

  // init web3 contract (NOT contract contents)
  const { connectWallet, network, fetchCallback } = useMetaMask();

  // web3 variables
  const [{ totalContacts, timelock, txCost, contactList, owner }, dispatch] =
    useReducer((state, moreState) => ({ ...state, ...moreState }), {
      totalContacts: 0, // total numbers of contacts in address book
      timelock: 0, // time until address is whitelisted
      txCost: 0, // cost to send a transaction via this service
      owner: "...", // contract owner's address
      contactList: [],
    });

  // initialise contract variables
  useEffect(() => {
    if (!network) return;
    async function initialiseVariables() {
      dispatch({
        totalContacts: await fetchCallback("totalContacts")(),
        timelock: await fetchCallback("securityTimelock")(),
        txCost: await fetchCallback("transferPrice")(),
        owner: await fetchCallback("owner")(),
        contactList: await fetchCallback("readAllContacts")(),
      });
    }
    initialiseVariables();
  }, [fetchCallback, network]);

  // web3 / contract functions
  const addContact = useCallback(() => {}, []);

  const removeContact = useCallback(() => {}, []);

  const payContact = useCallback(() => {}, []);

  const checkBalance = useCallback(() => {}, []);

  const withdrawFunds = useCallback(() => {}, []);

  // UI handlers
  const [selectedContact, setSelectedContact] = useState("");
  const handleListItemClick = useCallback(
    (name) => setSelectedContact((n) => (n === name ? null : name)),
    []
  );

  return (
    <Box className={classes.container}>
      <Head>
        <title>Address Book Whitelist</title>
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
                        selected={selectedContact === contact.name}
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
                  onClick={removeContact}
                  className={classes.button}
                >
                  <PersonRemoveIcon />
                </Button>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={payContact}
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
                    <Typography variant="body1">{totalContacts}</Typography>
                  </Box>
                  <Box className={classes.option}>
                    <Typography variant="body1">Security Timelock:</Typography>
                    <Typography variant="body1">{timelock} seconds</Typography>
                  </Box>
                  <Box className={classes.option}>
                    <Typography variant="body1">Transfer Cost:</Typography>
                    <Typography variant="body1">
                      {txCost / 1000000000000000000} ETH
                    </Typography>
                  </Box>
                  <Box className={classes.option}>
                    <Typography variant="body1">Contract Owner:</Typography>
                    <Typography variant="body1">{owner}</Typography>
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
                    onClick={removeContact}
                    className={classes.button}
                  >
                    <Typography variant="body1">Remove Contact</Typography>
                  </Button>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={payContact}
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
