import {
  useContext,
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useReducer,
} from "react";
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
// USECONTEXT => ACCESS COMPONENT, HANDLERS
// ===================================================

export const Context = createContext({
  metamask: {},
  addressBookContract: {},
  factoryContract: {},
});

export default function useMetaMask() {
  return useContext(Context);
}

// ===================================================
// UTIL / OPTIONS
// ===================================================

const validNetworks = ["rinkeby", "private"];

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

export function MetaMaskContext({ children }) {
  const { handleOpen } = useFeedback();
  const { updateTransaction } = useTransaction();
  const { isAuthenticated, handleAuth } = useAuth();

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

  // address book contract variables
  const [
    { totalContacts, timelock, contactList, owner, addressBookBalance },
    updateAddressBook,
  ] = useReducer((state, moreState) => ({ ...state, ...moreState }), {
    totalContacts: null, // total numbers of contacts in address book
    timelock: null, // time until address is whitelisted
    owner: null, // contract owner's address
    addressBookBalance: null,
    contactList: [],
  });

  // factory contract variables
  const [
    {
      txCost,
      totalAddressBooks,
      accountOpenCost,
      factoryBalance,
      factoryOwner,
    },
    updateFactory,
  ] = useReducer((state, moreState) => ({ ...state, ...moreState }), {
    txCost: null, // cost to send a transaction via this service
    totalAddressBooks: null, // total numbers of address books created
    accountOpenCost: null, // cost to start using this service
    factoryOwner: null, // factory contract owner's address
    factoryBalance: null,
  });

  // UI variables
  const { isOwner, isFactoryOwner } = useMemo(
    () => ({
      isOwner: account && account === owner,
      isFactoryOwner: account && account === factoryOwner,
    }),
    [account, factoryOwner, owner]
  );

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

  // search the DB to see if user has an address book already
  const fetchAddressBook = useCallback(async () => {
    try {
      const addressBook = await factoryContract.methods
        ?.fetchAddressBook()
        .call({ from: account });
      handleAuth(addressBook);
    } catch (err) {
      handleOpen("error", "You must sign up to continue");
    }
  }, [account, factoryContract.methods, handleAuth, handleOpen]);

  // read the requested value from the provided contract
  const readVariable = useCallback(
    async (functionName, contract) => {
      try {
        if (!contract?.methods) throw new Error("No contract defined");
        const callback = contract.methods[functionName];
        const result = await callback?.().call({ from: account });
        return result;
      } catch (err) {
        handleOpen("error", `Couldn't read from ${functionName}`);
      }
    },
    [account, handleOpen]
  );

  // all-purpose submit function for Modal forms
  const submitForm = useCallback(
    async (values, name, data = {}, contract, onSuccess) => {
      try {
        const sortedArgs = sortArguments(values, name);
        await contract.methods[name](...sortedArgs) // fetch function
          .send({ from: account, ...data /*, value: txCost */ })
          .on("transactionHash", (txHash) => updateTransaction({ txHash }))
          .on("error", () => updateTransaction({ txSuccess: false }))
          .on("receipt", ({ status }) => {
            updateTransaction({ txSuccess: status });
            if (onSuccess) onSuccess();
          });
      } catch (err) {
        handleOpen("error", `TX error: ${err.message}`);
      }
    },
    [account, handleOpen, updateTransaction]
  );

  // function to (re)initialise contract variables
  const refreshVariables = useCallback(async () => {
    if (!network) return;

    // update address book values
    if (isAuthenticated) {
      try {
        updateAddressBook({
          totalContacts: await readVariable(
            "readTotalContacts",
            addressBookContract
          ),
          timelock: await readVariable(
            "readSecurityTimelock",
            addressBookContract
          ),
          owner: await readVariable("owner", addressBookContract),
          addressBookBalance: await readVariable(
            "checkBalance",
            addressBookContract
          ),
          contactList: await readVariable(
            "readAllContacts",
            addressBookContract
          ),
        });
      } catch (err) {
        handleOpen("error", "Failed to update global variables");
      }
    }

    // update factory values
    if (factoryContract._address) {
      try {
        updateFactory({
          txCost: await readVariable("txCost", factoryContract),
          totalAddressBooks: await readVariable(
            "totalAddressBooks",
            factoryContract
          ),
          accountOpenCost: await readVariable(
            "accountOpenCost",
            factoryContract
          ),
          factoryBalance: await readVariable("checkBalance", factoryContract),
          factoryOwner: await readVariable("owner", factoryContract),
        });
      } catch (err) {
        handleOpen("error", "Failed to refresh your address book");
      }
    }
    handleOpen("success", "Contract variables up-to-date!");
  }, [
    network,
    isAuthenticated,
    factoryContract,
    handleOpen,
    readVariable,
    addressBookContract,
  ]);

  // EFFECT HOOKS
  // ===================================================
  // init web3
  useInitWeb3();

  // init factory contract
  useFactory(network, validNetworks, updateMetaMask);

  // init address book contract once auth'd
  useAddressBook(
    account,
    network,
    validNetworks,
    updateMetaMask,
    fetchAddressBook
  );

  // sync / hydrate vars
  useSyncVariables(refreshVariables);

  // show feedback on certain events
  useNetworkUpdates(network);
  useTransactionFeedback(network);

  return (
    <Context.Provider
      value={{
        metamask: {
          account,
          network,
          factoryContract,
          addressBookContract,
          connectWallet,
          submitForm,
        },
        addressBookContract: {
          isOwner,
          owner,
          totalContacts,
          timelock,
          contactList,
          addressBookBalance,
          refreshVariables,
        },
        factoryContract: {
          isFactoryOwner,
          txCost,
          totalAddressBooks,
          accountOpenCost,
          factoryBalance,
          factoryOwner,
          fetchAddressBook,
        },
      }}
    >
      {children}
    </Context.Provider>
  );
}
