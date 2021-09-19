import {
  Backdrop,
  Typography,
  makeStyles,
  Modal as MuiModal,
  Fade,
  useTheme,
  Paper,
  Divider,
  Box,
} from "@material-ui/core";
import Form from "components/form";
import useTransaction from "hooks/useTransaction";
import useModal from "./context";
import PropagateLoader from "react-spinners/PropagateLoader";

// ===================================================
// STYLES
// ===================================================

const useStyles = makeStyles((theme) => ({
  modal: {
    position: "absolute",
    inset: "25%",
    padding: theme.spacing(3),
    overflowY: "auto",
    textAlign: "center",
    display: "flex",
    flexDirection: "column",

    [theme.breakpoints.down("sm")]: {
      inset: theme.spacing(12, 5, 5),
    },
    [theme.breakpoints.down("xs")]: {
      inset: theme.spacing(12, 2, 2),
    },
  },
  // titles: {},
  divider: {
    marginBottom: theme.spacing(2),
  },
  txStatus: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    height: "100%",
    marginTop: theme.spacing(2),
    "& .MuiTypography-root:last-child": {
      fontWeight: "bold",
    },
  },
  spinner: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
  },
}));

// ===================================================
// COMPONENTS
// ===================================================

export default function Modal() {
  const classes = useStyles();
  const theme = useTheme();
  const { title, description, contractFunction, open, handleClose } =
    useModal();

  return (
    <MuiModal
      open={open}
      onClose={handleClose}
      aria-labelledby={`modal-${title}`}
      disableScrollLock
      BackdropComponent={Backdrop}
      BackdropProps={{
        timeout: theme.transitions.duration.standard,
      }}
    >
      <Fade in={open}>
        <Paper elevation={9} className={classes.modal}>
          <Box className={classes.titles}>
            {title && (
              <Typography
                variant="h5"
                component="span"
                display="block"
                color="textPrimary"
              >
                {title}
              </Typography>
            )}
            {description && (
              <Typography
                variant="h6"
                component="span"
                display="block"
                color="textSecondary"
              >
                {description}
              </Typography>
            )}
          </Box>
          <Divider light className={classes.divider} />
          {contractFunction && <Form />}
          <TransactionStatus />
        </Paper>
      </Fade>
    </MuiModal>
  );
}

function TransactionStatus() {
  const { prevHash, prevSuccess } = useTransaction();
  const classes = useStyles();
  const theme = useTheme();
  return (
    <Box className={classes.txStatus}>
      <Box className={classes.spinner}>
        <PropagateLoader
          color={theme.palette.secondary.main}
          loading={prevHash && prevSuccess === null}
          size={15}
        />
      </Box>
      <Box>
        <Typography variant="body1">Transaction hash: {prevHash}</Typography>
        <Typography variant="body1">
          Transaction status:{" "}
          {prevSuccess !== null
            ? prevSuccess
              ? "Success"
              : "Error"
            : "Pending"}
        </Typography>
      </Box>
    </Box>
  );
}
