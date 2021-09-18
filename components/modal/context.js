import { createContext, useContext, useReducer } from "react";
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
// ===================================================}

export function ModalContext({ children }) {
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

  const handleOpen = ({
    title: newTitle,
    description: newDescription,
    contractFunction: newType,
    formDefaults: newFormDefaults,
    callback: newCallback,
  }) => {
    // const handleOpen = (newTitle, newDescription, newType, newCallback) => {
    dispatch({
      open: true,
      title: newTitle,
      description: newDescription,
      contractFunction: newType,
      formDefaults: newFormDefaults,
      callback: newCallback,
    });
  };

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
        handleOpen,
        handleClose,
        Modal,
      }}
    >
      {children}
    </Context.Provider>
  );
}
