import Alert from "@material-ui/lab/Alert";
import { makeStyles, Slide, Typography } from "@material-ui/core";

// ===================================================
// STYLES
// ===================================================

// TODO: style different snackbar variants!
const useStyles = makeStyles((theme) => ({
  alert: {
    // "& .MuiAlert-filledError": {
    //   background: "orange !important",
    // },
    // "&.MuiAlert-filledSuccess": {
    //   background: theme.palette.success.main,
    //   // color: ({ type }) =>
    //   //   theme.palette.getContrastText(theme.palette[type].main),
    // },
    // "&.MuiAlert-filledError": {
    //   background: theme.palette.error.main,
    // },
    // "&.MuiAlert-filledInfo": {
    //   background: theme.palette.secondary.main,
    // },
  },
}));

// ===================================================
// COMPONENTS
// ===================================================

function Snackbar({ message }) {
  const classes = useStyles();

  return (
    <Alert elevation={6} variant="filled" className={classes.alert}>
      <Typography variant="body2">{message}</Typography>
    </Alert>
  );
}

export default function createSnackbar(key, message) {
  return (
    <div>
      <Snackbar id={key} message={message} />
    </div>
  );
}
