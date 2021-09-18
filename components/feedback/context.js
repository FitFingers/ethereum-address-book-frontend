import { useContext, createContext, useCallback, useReducer } from "react";
import { Snackbar } from "./index";

// ===================================================
// USECONTEXT => ACCESS COMPONENT, HANDLERS
// ===================================================

export const Context = createContext(null);

export default function useFeedback() {
  return useContext(Context);
}

// ===================================================
// CONTEXT PROVIDER AND HANDLERS
// ===================================================

export function FeedbackContext({ children }) {
  const [{ open, type, message, persist }, dispatch] = useReducer(
    (state, newState) => ({ ...state, ...newState }),
    {
      open: false,
      type: "success",
      message: "",
      persist: false,
    }
  );

  const handleOpen = useCallback((newType, newMessage, persist) => {
    dispatch({ open: true, type: newType, message: newMessage, persist });
  }, []);

  const handleClose = useCallback(
    (event, reason) => {
      if (persist) return;
      if (reason === "clickaway") return;
      dispatch({ open: false });
    },
    [persist]
  );

  return (
    <Context.Provider
      value={{
        open,
        type,
        persist,
        message,
        handleOpen,
        handleClose,
        Snackbar,
      }}
    >
      {children}
    </Context.Provider>
  );
}
