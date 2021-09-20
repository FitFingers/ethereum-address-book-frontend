import { useCallback, useEffect, useMemo, useReducer } from "react";
import useFeedback from "components/feedback/context";
import useContract from "./useContract";
import useNetworkUpdates from "./useNetworkUpdates";
import useTransactionFeedback from "./useTransactionFeedback";
import useInitWeb3 from "./useInitWeb3";
import useSyncVariables from "./useSyncVariables";
import useTransaction from "hooks/useTransaction";
import { FACTORY_ABI, ADDRESS_BOOK_ABI } from "util/abi";
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
  const { isAuthenticated, handleAuth } = useAuth();

  // STATE
  // ===================================================
  // metamask / web3 state
  const [{ account, network, contract }, updateMetaMask] = useReducer(
    (state, moreState) => ({ ...state, ...moreState }),
    {
      account: null,
      network: null,
      contract: {},
    }
  );

  // contract variables
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
    (functionName) => {
      try {
        if (!contract?.methods) throw new Error("No contract defined");
        const callback = contract.methods[functionName];
        return () => callback?.().call({ from: account });
        // return () => callback().call({ from: account });
      } catch (err) {
        return () => console.log("DEBUG callback not set");
      }
    },
    [contract.methods, account]
  );

  // all-purpose submit function for Modal forms
  const submitForm = useCallback(
    async (values, name, data = {}) => {
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
    [account, contract.methods, handleOpen, updateTransaction]
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
  useContract(
    network,
    validNetworks,
    updateMetaMask,
    FACTORY_ABI,
    "factoryContract"
  );

  // listen for wallet connect, check whether user has address book, save address and create contract instance
  useEffect(() => {
    if (!account || !contract.methods?.fetchAddressBook) return;
    async function fetchAddressBook() {
      const addressBookAddress = await contract.methods
        ?.fetchAddressBook()
        .call({ from: account });
      handleAuth(addressBookAddress);
    }
    fetchAddressBook();
  }, [account, contract.methods, handleAuth]);
  console.log("DEBUG", { isAuthenticated });
  // init address book contract once auth'd

  useContract(
    network,
    validNetworks,
    updateMetaMask,
    isAuthenticated ? ADDRESS_BOOK_ABI : null,
    "addressBookContract"
  );

  // sync
  useSyncVariables(refreshVariables);

  // show feedback on certain events
  useNetworkUpdates(network);
  useTransactionFeedback(network);

  return {
    metamask: {
      account,
      network,
      contract,
      connectWallet,
      fetchCallback,
      submitForm,
    },
    contract: {
      isOwner,
      owner,
      totalContacts,
      timelock,
      txCost,
      contactList,
      balance,
      refreshVariables,
    },
  };
}
