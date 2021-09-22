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
import useModal from "./context";
import TransactionStatus from 'components/transaction-status'

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
