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
  const [{ open, title, description, fields }, dispatch] = useReducer(
    (state, newState) => ({ ...state, ...newState }),
    {
      open: false,
      title: "",
      description: null,
      fields: null,
    }
  );

  const handleOpen = (newTitle, newDescription, newFields) => {
    dispatch({
      open: true,
      title: newTitle,
      description: newDescription,
      fields: newFields,
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
        fields,
        handleOpen,
        handleClose,
        Modal,
      }}
    >
      {children}
    </Context.Provider>
  );
}
