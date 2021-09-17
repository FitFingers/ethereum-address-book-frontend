import React, { useContext, createContext, useCallback, useReducer } from "react";
import MuiSnackbar from "@material-ui/core/Snackbar";
import MuiAlert from "@material-ui/lab/Alert";

import { makeStyles } from "@material-ui/core";

// ===================================================
// STYLES
// ===================================================

const useStyles = makeStyles((theme) => ({
  alert: {
    background: ({ type }) => theme.palette[type].main,
  },
}));

// ===================================================
// USECONTEXT => ACCESS COMPONENT, HANDLERS
// ===================================================

export const Context = createContext(null);

export function useFeedback() {
  return useContext(Context);
}

// ===================================================
// COMPONENTS
// ===================================================

function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

function Snackbar() {
  const { type, message, open, handleClose } = useFeedback();
  const classes = useStyles({ type });

  return (
    <MuiSnackbar open={open} autoHideDuration={4000} onClose={handleClose}>
      <Alert
        onClose={handleClose}
        severity={type || "success"}
        className={classes.alert}
      >
        {message}
      </Alert>
    </MuiSnackbar>
  );
}

// ===================================================
// CONTEXT PROVIDER AND HANDLERS
// ===================================================

export function FeedbackContext({ children }) {
  const [{ open, type, message }, dispatch] = useReducer(
    (state, newState) => ({ ...state, ...newState }),
    {
      open: false,
      type: "success",
      message: "",
    }
  );

  const handleOpen = useCallback((newType, newMessage) => {
    dispatch({ open: true, type: newType, message: newMessage });
  }, []);

  const handleClose = useCallback((event, reason) => {
    if (reason === "clickaway") return;
    dispatch({ open: false });
  }, []);

  return (
    <Context.Provider
      value={{
        open,
        type,
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
