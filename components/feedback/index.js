import MuiSnackbar from "@material-ui/core/Snackbar";
import MuiAlert from "@material-ui/lab/Alert";
import { makeStyles, Slide } from "@material-ui/core";
import useFeedback from "./context";

// ===================================================
// STYLES
// ===================================================

const useStyles = makeStyles((theme) => ({
  alert: {
    background: ({ type }) => theme.palette[type].main,
  },
}));

// ===================================================
// COMPONENTS
// ===================================================

function SlideRight(props) {
  return <Slide {...props} direction="right" />;
}

function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

export default function Snackbar() {
  const { type, message, open, persist, handleClose } = useFeedback();
  const classes = useStyles({ type });

  return (
    <MuiSnackbar
      open={open}
      anchorOrigin={{
        vertical: "bottom",
        horizontal: "left",
      }}
      onClose={handleClose}
      autoHideDuration={persist ? null : 4000}
      TransitionComponent={SlideRight}
    >
      <div>
        <Alert
          onClose={handleClose}
          severity={type || "success"}
          className={classes.alert}
        >
          {message}
        </Alert>
      </div>
    </MuiSnackbar>
  );
}
