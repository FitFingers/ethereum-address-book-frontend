import useTransaction from "hooks/useTransaction";
import { createContext, useCallback, useContext, useReducer } from "react";
import Modal from "./index";

// ===================================================
// USE CONTEXT => ACCESS COMPONENT AND HANDLERS
// ===================================================

const Context = createContext({});

export default function useModal() {
  return useContext(Context);
}

// ===================================================
// MODAL CONTEXT => PROVIDER AND HANDLERS
// ===================================================

export function ModalContext({ children }) {
  const { updateTransaction } = useTransaction();
  const [
    { open, title, description, contractFunction, formDefaults, callback },
    dispatch,
  ] = useReducer((state, newState) => ({ ...state, ...newState }), {
    open: false,
    title: "",
    description: null,
    contractFunction: null,
    formDefaults: {},
    callback: () => {},
  });

  const openModal = useCallback(
    ({
      title: newTitle,                // Modal heading
      description: newDescription,    // Modal subheading
      contractFunction: newType,      // Name of function as it appears in the smart contract
      formDefaults: newFormDefaults,  // JSON Object of default field values (used to pass dynamic initial vars)
      callback: newCallback,          // Function to call on submit (allows custom construction of params etc)
    }) => {
      updateTransaction({ prevHash: null, prevSuccess: null });
      dispatch({
        open: true,
        title: newTitle,
        description: newDescription,
        contractFunction: newType,
        formDefaults: newFormDefaults,
        callback: newCallback,
      });
    },
    [updateTransaction]
  );

  const handleClose = (event, reason) => {
    if (reason === "clickaway") return;
    dispatch({ open: false });
  };

  return (
    <Context.Provider
      value={{
        open,
        title,
        description,
        contractFunction,
        formDefaults,
        callback,
        openModal,
        handleClose,
        Modal,
      }}
    >
      {children}
    </Context.Provider>
  );
}
