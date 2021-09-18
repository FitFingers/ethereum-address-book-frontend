import {
  Backdrop,
  Box,
  Typography,
  makeStyles,
  Modal as MuiModal,
  Fade,
  useTheme,
  Paper,
  Divider,
} from "@material-ui/core";
import Form from "components/form";
import useModal from "./context";

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

    [theme.breakpoints.down("sm")]: {
      inset: theme.spacing(12, 5, 5),
    },
    [theme.breakpoints.down("xs")]: {
      inset: theme.spacing(12, 1, 1),
    },
  },
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
  const { title, description, type, formDefaults, open, handleClose } = useModal();

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
          <Divider light className={classes.divider} />
          {type && <Form type={type} formDefaults={formDefaults} />}
        </Paper>
      </Fade>
    </MuiModal>
  );
}
