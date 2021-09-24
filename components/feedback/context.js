import { SnackbarProvider } from "notistack";
import { makeStyles } from "@material-ui/core";
// import createSnackbar from "components/feedback";

// ===================================================
// STYLES
// ===================================================

const useStyles = makeStyles((theme) => ({
  success: {
    background: theme.palette.success.main,
    color: theme.palette.getContrastText(theme.palette.success.main),
  },
  error: {
    background: theme.palette.error.main,
    color: theme.palette.getContrastText(theme.palette.error.main),
  },
  info: {
    background: theme.palette.info.main,
    color: theme.palette.getContrastText(theme.palette.info.main),
  },
}));

// ===================================================
// CONTEXT WRAPPER (extends notisnack => own component solely for modulation)
// ===================================================

export function FeedbackContext({ children }) {
  const classes = useStyles();
  return (
    <SnackbarProvider
      preventDuplicate
      autoHideDuration={3000}
      maxSnack={3}
      variant="success"
      // content={createSnackbar} // breaks coloring
      classes={{
        variantSuccess: classes.success,
        variantError: classes.error,
        variantInfo: classes.info,
      }}
    >
      {children}
    </SnackbarProvider>
  );
}
