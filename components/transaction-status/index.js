import { Typography, makeStyles, useTheme, Box } from "@material-ui/core";
import useTransaction from "hooks/useTransaction";
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

export default function TransactionStatus() {
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
