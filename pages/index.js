import { useCallback, useState } from "react";
import Head from "next/head";
import Link from "next/link";
import {
  makeStyles,
  Box,
  Typography,
  AppBar,
  Toolbar,
  Paper,
} from "@material-ui/core";
import PersonAddIcon from "@material-ui/icons/PersonAdd";
import PersonRemoveIcon from "@material-ui/icons/PersonAddDisabled";
import PaymentIcon from "@material-ui/icons/Payment";
import Logo from "components/logo";
import Button from "components/button";
import useMetaMask from "hooks/useMetaMask";
import useModal from "components/modal/context";
import { etherscan } from "util/network-data";
import useAuth from "components/auth/context";
import { getFactoryAddress } from "util/env-funcs";
import DataDisplayPanel from "components/data-display-panel";
import ContactList from "components/contact-list";

/*
  TODO:
  2. Disable icon buttons before login / show disabled address buttons instead of hide
  4. "A controlled component is changed to uncontrolled"
  5. Style notisnack
*/

// ===================================================
// UTIL (PAGE OPTIONS)
// ===================================================

const FACTORY_ADDRESS = getFactoryAddress("dev");

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
    justifyContent: "flex-start",
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
  buttonColumns: {
    display: "flex",
    margin: theme.spacing(-1),
    [theme.breakpoints.down("sm")]: {
      display: "flex",
      flexDirection: "column",
    },
  },
  buttonList: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-end",
    flex: 1,
    margin: theme.spacing(1),
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
  const { openModal } = useModal();
  const { isAuthenticated, contractAddress } = useAuth();

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
    addressBookContract: { refreshVariables },
    factoryContract: {
      txCost,
      accountOpenCost,
      isFactoryOwner,
      fetchAddressBook,
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
    openModal({
      title: "Add Contact",
      description: desc.addContact(),
      contractFunction: "addContact",
      callback: (values) =>
        submitForm(values, "addContact", {}, addressBookContract),
    });
  }, [openModal, addressBookContract, submitForm]);

  const removeContactByName = useCallback(() => {
    openModal({
      title: "Remove Contact",
      description: desc.removeContactByName[!!selected](selected),
      contractFunction: "removeContactByName",
      formDefaults: { name: selected },
      callback: (values) =>
        submitForm(values, "removeContactByName", {}, addressBookContract),
    });
  }, [openModal, selected, addressBookContract, submitForm]);

  const payContactByName = useCallback(() => {
    openModal({
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
          addressBookContract
        ),
    });
  }, [openModal, selected, addressBookContract, submitForm, txCost]);

  const withdrawAddressBookFunds = useCallback(() => {
    openModal({
      title: "Withdraw Funds",
      description: "Withdraw the funds in this smart contract",
      contractFunction: "withdraw",
      callback: () => submitForm({}, "withdraw", {}, addressBookContract),
    });
  }, [addressBookContract, openModal, submitForm]);

  const updateTimelock = useCallback(() => {
    openModal({
      title: "Update Security Timelock",
      description:
        "Change the security timelock. This will change the length of time that must pass before you may transfer ETH to a new contact",
      contractFunction: "updateTimelock",
      callback: (values) =>
        submitForm(values, "updateTimelock", {}, addressBookContract),
    });
  }, [openModal, addressBookContract, submitForm]);

  // TODO:
  // const removeAddressBook = useCallback(() => {
  //   openModal({
  //     title: "Close Account",
  //     description:
  //       "Remove your address book from our systems",
  //     contractFunction: "removeAddressBook",
  //     callback: () =>
  //       submitForm(values, "removeAddressBook", {}, factoryContract),
  //   });
  // }, [openModal, factoryContract, submitForm]);

  // factory .send functions
  // ===================================================
  const createAddressBook = useCallback(() => {
    openModal({
      title: "Create Address Book",
      description: "Open an account to start using this service",
      contractFunction: "createAddressBook",
      callback: (values) =>
        submitForm(
          values,
          "createAddressBook",
          {
            value: Number(accountOpenCost),
          },
          factoryContract,
          fetchAddressBook // onSuccess
        ),
    });
  }, [
    openModal,
    submitForm,
    accountOpenCost,
    factoryContract,
    fetchAddressBook,
  ]);

  const updateAccountOpenCost = useCallback(() => {
    openModal({
      title: "Update Account Cost",
      description: "Change the price charged to start using this service",
      contractFunction: "updateAccountOpenCost",
      callback: (values) =>
        submitForm(values, "updateAccountOpenCost", {}, factoryContract),
    });
  }, [openModal, factoryContract, submitForm]);

  const updateTransactionCost = useCallback(() => {
    openModal({
      title: "Update Transaction Cost",
      description: "Change the value this service charges for each interaction",
      contractFunction: "updateTransactionCost",
      callback: (values) =>
        submitForm(values, "updateTransactionCost", {}, factoryContract),
    });
  }, [openModal, factoryContract, submitForm]);

  const withdrawFactoryFunds = useCallback(() => {
    openModal({
      title: "Withdraw Funds",
      description: "Withdraw the funds in this smart contract",
      contractFunction: "withdraw",
      callback: () => submitForm({}, "withdraw", {}, factoryContract),
    });
  }, [factoryContract, openModal, submitForm]);

  return (
    <Box className={classes.container}>
      <Head>
        <title>Address Book</title>
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
              <Typography>Address Book</Typography>
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
              <Typography variant="h1">Address Book</Typography>
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
                <ContactList
                  selected={selected}
                  handleListItemClick={handleListItemClick}
                />
              </Box>
              <Box className={classes.buttonRow}>
                <Button
                  onClick={removeContactByName}
                  tip="Remove the selected contact"
                >
                  <PersonRemoveIcon />
                </Button>
                <Button
                  onClick={payContactByName}
                  tip="Pay the selected contact"
                >
                  <PaymentIcon />
                </Button>
                <Button onClick={addContact} tip="Add a new contact">
                  <PersonAddIcon />
                </Button>
              </Box>
            </Paper>
          </Box>

          <Box>
            <Paper elevation={5} className={classes.paperPanel}>
              <Box>
                <Typography variant="h3">Variables</Typography>
                <DataDisplayPanel />
              </Box>
              <Box>
                <Typography variant="h3">Functions</Typography>
                <Box className={classes.buttonColumns}>
                  <Box className={classes.buttonList}>
                    {/* UNAUTHENTICATED BUTTONS */}
                    {!network && (
                      <Button
                        noAuth
                        color="primary"
                        tip="Connect your wallet"
                        onClick={connectWallet}
                      >
                        <Typography variant="body1">
                          Connect Your Wallet
                        </Typography>
                      </Button>
                    )}
                    {network && !isAuthenticated && (
                      <Button
                        noAuth
                        color="primary"
                        tip="Create a new address book"
                        onClick={createAddressBook}
                      >
                        <Typography variant="body1">
                          Create Address Book
                        </Typography>
                      </Button>
                    )}

                    {/* ADDRESS BOOK BUTTONS */}
                    <Button onClick={addContact} tip="Add a new contact">
                      <Typography variant="body1">Add Contact</Typography>
                    </Button>
                    <Button
                      onClick={removeContactByName}
                      tip="Remove the selected contact"
                    >
                      <Typography variant="body1">Remove Contact</Typography>
                    </Button>
                    <Button
                      onClick={payContactByName}
                      tip="Pay the selected contact"
                    >
                      <Typography variant="body1">Pay Contact</Typography>
                    </Button>

                    {/* VARIABLE / UI BUTTONS */}
                    {isAuthenticated && (
                      <>
                        <Button
                          color="primary"
                          tip="Refresh the contract data"
                          onClick={refreshVariables}
                        >
                          <Typography variant="body1">Refresh Data</Typography>
                        </Button>
                        <Button
                          color="primary"
                          tip="Update the security timelock"
                          onClick={updateTimelock}
                        >
                          <Typography variant="body1">
                            Update Timelock
                          </Typography>
                        </Button>
                        {/* <Button
                          color="primary"
                          tip="Check the balance of this smart contract"
                          onClick={checkAddressBookBalance}
                        >
                          <Typography variant="body1">Check Balance</Typography>
                        </Button> */}
                        <Button
                          color="primary"
                          tip="Withdraw the balance from the smart contract. Please note that this will be 0 unless you sent ETH to your address book directly!"
                          onClick={withdrawAddressBookFunds}
                        >
                          <Typography variant="body1">
                            Withdraw Funds
                          </Typography>
                        </Button>
                      </>
                    )}
                  </Box>

                  {/* ADMIN BUTTONS */}
                  {isFactoryOwner && (
                    <Box className={classes.buttonList}>
                      <Button
                        color="primary"
                        tip="Update the account open cost"
                        onClick={updateAccountOpenCost}
                      >
                        <Typography variant="body1">
                          Update Account Cost
                        </Typography>
                      </Button>
                      <Button
                        color="primary"
                        tip="Update the transaction cost"
                        onClick={updateTransactionCost}
                      >
                        <Typography variant="body1">Update TX Cost</Typography>
                      </Button>
                      {/* <Button
                        color="primary"
                        tip="Check the balance of this smart contract"
                        onClick={checkFactoryBalance}
                      >
                        <Typography variant="body1">Check Balance</Typography>
                      </Button> */}
                      <Button
                        color="primary"
                        tip="Withdraw the balance from the smart contract"
                        onClick={withdrawFactoryFunds}
                      >
                        <Typography variant="body1">Withdraw Funds</Typography>
                      </Button>
                    </Box>
                  )}
                </Box>
              </Box>
            </Paper>
          </Box>
        </Box>
      </main>

      <footer className={classes.footer}>
        {contractAddress && (
          <Link
            passHref
            href={`${etherscan[network]}address/${contractAddress}`}
          >
            <a target="_blank" rel="noreferrer">
              <Typography variant="h6">
                Your address book:{" "}
                <Typography variant="h6" component="span" color="secondary">
                  {contractAddress}
                </Typography>
              </Typography>
            </a>
          </Link>
        )}
        <Link passHref href={`${etherscan[network]}address/${FACTORY_ADDRESS}`}>
          <a target="_blank" rel="noreferrer">
            <Typography variant="h6">
              Contract address:{" "}
              <Typography variant="h6" component="span" color="secondary">
                {FACTORY_ADDRESS}
              </Typography>
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
