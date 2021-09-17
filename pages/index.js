import { useCallback, useReducer, useState } from "react";
import Head from "next/head";
import Link from "next/link";
import {
  makeStyles,
  Box,
  List,
  ListItemButton,
  ListItemText,
  IconButton,
  Typography,
  AppBar,
  Toolbar,
  Paper,
  Button,
} from "@material-ui/core";
import PersonAddIcon from "@material-ui/icons/PersonAdd";
import PersonRemoveIcon from "@material-ui/icons/PersonAddDisabled";
import PaymentIcon from "@material-ui/icons/Payment";
import Logo from "components/logo";

// ===================================================
// UTIL
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
  },
  optionsList: {
    display: "flex",
    flexDirection: "column",
    marginBottom: theme.spacing(3),
  },
  option: {
    display: "flex",
    justifyContent: "space-between",
    "&>:last-child": {
      fontWeight: "bold",
    },
  },
  buttonList: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    "&>$button": {
      margin: theme.spacing(1, 0),
    },
  },
  buttonRow: {
    display: "flex",
    margin: theme.spacing(0, -1),
    "&>$button": {
      margin: theme.spacing(0, 1),
      flex: 1,
      // "&:first-child": {
      //   flex: 0,
      // },
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

  // web3 variables
  const [{ numContacts, timelock, txCost, contactList, owner }, dispatch] =
    useReducer((state, moreState) => ({ ...state, ...moreState }), {
      numContacts: "0",
      timelock: "30",
      txCost: "Calculating...",
      owner: "Calculating...",
      contactList: [],
    });

  // web3 functions
  const addContact = useCallback(() => {}, []);

  const removeContact = useCallback(() => {}, []);

  const payContact = useCallback(() => {}, []);

  const checkBalance = useCallback(() => {}, []);

  const withdrawFunds = useCallback(() => {}, []);

  // Contact selector handlers
  const [selectedIndex, setSelectedIndex] = useState(1);
  const handleListItemClick = useCallback((event, index) => {
    setSelectedIndex(index);
  }, []);

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
            <Logo network="ethereum" />
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
              elevation={4}
              className={[classes.paperPanel, classes.smallPanel]}
            >
              <Typography variant="h3">Contacts</Typography>
              <Box className={classes.contactWindow}>
                <List>
                  {contactList.map((contact) => (
                    <ListItemButton
                      selected={selectedIndex === 0}
                      onClick={(event) => handleListItemClick(event, 0)}
                      key={`contact-list-${contact.name}`}
                    >
                      <ListItemText primary={contact.name} />
                    </ListItemButton>
                  ))}
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
            <Paper elevation={4} className={classes.paperPanel}>
              <Box>
                <Typography variant="h3">Variables</Typography>
                <Box className={classes.optionsList}>
                  <Box className={classes.option}>
                    <Typography variant="body1">Total Contacts:</Typography>
                    <Typography variant="body1">{numContacts}</Typography>
                  </Box>
                  <Box className={classes.option}>
                    <Typography variant="body1">Security Timelock:</Typography>
                    <Typography variant="body1">
                      {timelock} (seconds)
                    </Typography>
                  </Box>
                  <Box className={classes.option}>
                    <Typography variant="body1">Transfer Cost:</Typography>
                    <Typography variant="body1">{txCost}</Typography>
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
                    color="secondary"
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
                    color="primary"
                    onClick={checkBalance}
                    className={classes.button}
                  >
                    <Typography variant="body1">Check Balance</Typography>
                  </Button>
                  <Button
                    variant="contained"
                    color="primary"
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
