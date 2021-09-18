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
  const [{ open, title, description, options, submitCallback }, dispatch] =
    useReducer((state, newState) => ({ ...state, ...newState }), {
      open: false,
      title: "",
      description: null,
      options: {},
      submitCallback: () => {},
    });

  const handleOpen = (newTitle, newDescription, newOptions, newCallback) => {
    dispatch({
      open: true,
      title: newTitle,
      description: newDescription,
      options: newOptions || {},
      submitCallback: newCallback,
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
        options,
        submitCallback,
        handleOpen,
        handleClose,
        Modal,
      }}
    >
      {children}
    </Context.Provider>
  );
}
