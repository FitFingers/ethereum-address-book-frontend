import { useCallback, useEffect, useMemo, useReducer } from "react";
import useFeedback from "components/feedback/context";
import useFactory from "./useFactory";
import useAddressBook from "./useAddressBook";
import useNetworkUpdates from "./useNetworkUpdates";
import useTransactionFeedback from "./useTransactionFeedback";
import useInitWeb3 from "./useInitWeb3";
import useSyncVariables from "./useSyncVariables";
import useTransaction from "hooks/useTransaction";
import useAuth from "components/auth/context";

// ===================================================
// UTIL / OPTIONS
// ===================================================

const validNetworks = ["rinkeby"];

// The order of the parameters to send to contract (sort order of params)
const formConfig = {
  addContact: ["name", "address"],
  removeContactByName: ["name"],
  payContactByName: ["name", "sendValue"],
  updateTimelock: ["seconds"],
  updateTransactionCost: ["value"],
};

function sortArguments(values, name) {
  return (formConfig[name] || []).map((key) => values[key]);
}

// ===================================================
// METAMASK HOOK
// ===================================================

export default function useMetaMask() {
  const { handleOpen } = useFeedback();
  const { updateTransaction } = useTransaction();
  const { contractAddress, handleAuth } = useAuth();

  // STATE
  // ===================================================
  // metamask / web3 state
  const [
    { account, network, factoryContract, addressBookContract },
    updateMetaMask,
  ] = useReducer((state, moreState) => ({ ...state, ...moreState }), {
    account: null,
    network: null,
    factoryContract: {},
    addressBookContract: {},
  });

  // factoryContract variables
  const [
    { totalContacts, timelock, txCost, contactList, owner, balance },
    dispatch,
  ] = useReducer((state, moreState) => ({ ...state, ...moreState }), {
    totalContacts: null, // total numbers of contacts in address book
    timelock: null, // time until address is whitelisted
    txCost: null, // cost to send a transaction via this service
    owner: null, // contract owner's address
    balance: null,
    contactList: [],
  });

  // UI variables
  const isOwner = useMemo(() => account && account === owner, [account, owner]);

  // HANDLERS
  // ===================================================
  // connect and set the user's public key
  const connectAccount = useCallback(async () => {
    const [acc] = await window.web3.eth.requestAccounts();
    updateMetaMask({ account: acc });
  }, []);

  // connect to the network
  const connectNetwork = useCallback(async () => {
    const connectedNetwork = await window.web3.eth.net.getNetworkType();
    updateMetaMask({ network: connectedNetwork });
  }, []);

  // connect to user's wallet
  const connectWallet = useCallback(async () => {
    try {
      await connectAccount();
      await connectNetwork();
    } catch (err) {
      console.debug("ERROR: couldn't connect wallet", { err });
      handleOpen("error", `Couldn't connect: ${err.message}`);
    }
  }, [connectAccount, connectNetwork, handleOpen]);

  // "unpack" the requested callback from the contract and return (don't invoke)
  const fetchCallback = useCallback(
    (functionName, contract) => {
      try {
        if (!contract?.methods) throw new Error("No contract defined");
        const callback = contract.methods[functionName];
        return () => callback?.().call({ from: account });
        // return () => callback().call({ from: account });
      } catch (err) {
        return () => console.log("DEBUG callback not set");
      }
    },
    [account]
  );

  // all-purpose submit function for Modal forms
  const submitForm = useCallback(
    async (values, name, data = {}, contract) => {
      try {
        const sortedArgs = sortArguments(values, name);
        await contract.methods[name](...sortedArgs) // fetch function
          .send({ from: account, ...data /*, value: txCost */ })
          .on("transactionHash", (txHash) => updateTransaction({ txHash }))
          .on("error", () => updateTransaction({ txSuccess: false }))
          .on("receipt", ({ status }) =>
            updateTransaction({ txSuccess: status })
          );
      } catch (err) {
        console.debug("DEBUG catch error", { err });
        handleOpen("error", `TX error: ${err.message}`);
      }
    },
    [account, handleOpen, updateTransaction]
  );

  // function to (re)initialise contract variables
  const refreshVariables = useCallback(async () => {
    if (!network) return;
    dispatch({
      totalContacts: await fetchCallback("totalContacts")(),
      timelock: await fetchCallback("securityTimelock")(),
      txCost: await fetchCallback("txCost")(),
      owner: await fetchCallback("owner")(),
      // contactList: await fetchCallback("readAllContacts")(),
      balance: await fetchCallback("checkBalance")(),
    });
    handleOpen("success", "Contract variables up-to-date!");
  }, [fetchCallback, handleOpen, network]);

  // EFFECT HOOKS
  // ===================================================
  // init web3
  useInitWeb3();

  // init factory contract
  useFactory(network, validNetworks, updateMetaMask);

  // listen for wallet connect, check whether user has address book, save address and create contract instance
  useEffect(() => {
    if (!account || !factoryContract.methods?.fetchAddressBook) return;
    async function fetchAddressBook() {
      const contractAddress = await factoryContract.methods
        ?.fetchAddressBook()
        .call({ from: account });
      handleAuth({ contractAddress });
    }
    fetchAddressBook();
  }, [account, factoryContract.methods, handleAuth]);

  console.log("DEBUG all", {
    contractAddress,
    factoryContract,
    addressBookContract,
    account,
  });

  // init address book contract once auth'd
  useAddressBook(network, validNetworks, updateMetaMask);

  // sync
  useSyncVariables(refreshVariables);

  // show feedback on certain events
  useNetworkUpdates(network);
  useTransactionFeedback(network);

  return {
    metamask: {
      account,
      network,
      factoryContract,
      addressBookContract,
      connectWallet,
      fetchCallback,
      submitForm,
    },
    addressBookContract: {
      isOwner,
      owner,
      totalContacts,
      timelock,
      txCost,
      contactList,
      balance,
      refreshVariables,
    },
    factoryContract: {},
  };
}
