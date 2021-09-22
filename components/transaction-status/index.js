import { Typography, makeStyles, useTheme, Box } from "@material-ui/core";
import FeedbackLink from "components/feedback-link";
import useTransaction from "hooks/useTransaction";
import { useMemo } from "react";
import PropagateLoader from "react-spinners/PropagateLoader";

// ===================================================
// STYLES
// ===================================================

const useStyles = makeStyles((theme) => ({
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

// Shows a loading animation while transaction status props are not at default
export default function TransactionStatus() {
  const { prevHash, prevSuccess } = useTransaction();
  const classes = useStyles();
  const theme = useTheme();
  const txLabel = useMemo(() => {
    if (!prevHash) return ""; // default => no tx
    if (prevSuccess === null) return "Pending"; // in progress
    return prevSuccess ? "Success" : "Error";
  }, [prevHash, prevSuccess]);
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
        <FeedbackLink id={prevHash} />
        <Typography variant="body1">Transaction status: {txLabel}</Typography>
      </Box>
    </Box>
  );
}
