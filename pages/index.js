import Head from "next/head";
// import Link from "next/link";
import {
  makeStyles,
  Box,
  Typography,
  AppBar,
  Toolbar,
  Paper,
} from "@material-ui/core";
import Logo from "components/logo";
import { useReducer } from "react";

// ===================================================
// UTIL
// ===================================================

/*
  VARS
  1. Total Contacts
  2. Security Timelock
  3. Transfer Cost
  4. Contacts (Array)
  5. Contacts (Mapping - address to index)
  6. Contacts (Mapping - name to index)
  7. Owner (of contract / address book)

  SCRIPTS
  1. Add Contact
  2. Remove Contact (by name)
  3. Pay Contact
  4. Check Balance
  5. Withdraw Funds
*/

// ===================================================
// STYLES
// ===================================================

export const useStyles = makeStyles((theme) => ({
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
    alignItems: "center",
    "&>*": {
      flex: 1,
    },
  },
  infoPanel: {
    border: "1px solid red",
    margin: "auto",
    padding: theme.spacing(3),
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
  },
  // paperPanelContainer: {
  //   width: "fit-content"
  // },
  paperPanel: {
    margin: "auto",
    padding: theme.spacing(3),
    maxWidth: theme.breakpoints.values.sm,
  },
  title: {
    //
  },
  description: {
    //
  },
  code: {
    //
  },
  grid: {
    //
  },
  card: {
    //
  },
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

  const { contacts, timelock, cost, list, owner } = useReducer(
    (state, moreState) => ({ ...state, ...moreState }),
    {
      contacts: "",
      timelock: "",
      cost: "",
      owner: "",
      list: "",
    }
  );

  return (
    <Box className={classes.container}>
      <Head>
        <title>Address Book Whitelist</title>
        <meta
          name="description"
          content="Address book for Ethereum users. Add and remove contracts and send transactions to them"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <AppBar color="primary">
        <Toolbar className={classes.toolbar}>
          <a href="https://www.jameshooper.io" target="_blank" rel="noreferrer">
            <Typography variant="h6">James Hooper</Typography>
          </a>
          <Box className={classes.tagline}>
            <Typography variant="h6">Active network:</Typography>
            <Logo network="ethereum" />
          </Box>
        </Toolbar>
      </AppBar>

      <main className={classes.main}>
        <Box className={classes.columns}>
          <Box className={classes.infoPanel}>
            <Typography variant="h1">Ethereum Address Book</Typography>
            <Typography variant="h2" color="textSecondary">
              Manage contacts and send transactions
            </Typography>
          </Box>
          {/* <Box> */}
          <Paper elevation={4} className={classes.paperPanel}>
            <Box>
              <Typography variant="h3">Variables</Typography>
              <Box className={classes.optionsList}>
                <Box>
                  <Typography variant="body1">Total Contacts:</Typography>
                  <Typography variant="body1">{contacts}</Typography>
                </Box>
                <Box>
                  <Typography variant="body1">Security Timelock:</Typography>
                  <Typography variant="body1">{timelock}</Typography>
                </Box>
                <Box>
                  <Typography variant="body1">Transfer Cost:</Typography>
                  <Typography variant="body1">{cost}</Typography>
                </Box>
                <Box>
                  <Typography variant="body1">Contacts List:</Typography>
                  <Typography variant="body1">{list}</Typography>
                </Box>
                <Box>
                  <Typography variant="body1">Contract Owner:</Typography>
                  <Typography variant="body1">{owner}</Typography>
                </Box>
              </Box>
            </Box>
            {/* <Box>
              <Typography variant="h3">Modifiers</Typography>
              <Box className={classes.optionsList}>
                <Typography variant="body1"></Typography>
              </Box>
            </Box> */}
            <Box>
              <Typography variant="h3">Functions</Typography>
              <Box className={classes.optionsList}>
                <Typography variant="body1">Add Contact</Typography>
                <Typography variant="body1">
                  Remove Contact (by name)
                </Typography>
                <Typography variant="body1">Pay Contact</Typography>
                <Typography variant="body1">Check Balance</Typography>
                <Typography variant="body1">Withdraw Funds</Typography>
              </Box>
            </Box>
          </Paper>
          {/* </Box> */}
        </Box>
      </main>

      <footer className={classes.footer}>
        <a
          href="https://www.jameshooper.io"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Typography variant="h6">
            © {new Date().getFullYear()} James Hooper
          </Typography>
        </a>
      </footer>
    </Box>
  );
}
