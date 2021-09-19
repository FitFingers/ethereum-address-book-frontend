import { makeStyles, Box, Typography, Tooltip } from "@material-ui/core";

// ===================================================
// STYLES
// ===================================================

const useStyles = makeStyles((theme) => ({
  option: {
    display: "flex",
    justifyContent: "space-between",
    whiteSpace: "nowrap",
    "&>:last-child": {
      fontWeight: "bold",
      overflow: "hidden",
      textOverflow: "ellipsis",
      flex: 1,
      maxWidth: 150,
      textAlign: "right",
      marginLeft: theme.spacing(5),
    },
  },
}));

// ===================================================
// COMPONENTS
// ===================================================

export default function Option({ tip, label, value }) {
  const classes = useStyles();
  return (
    <Box className={classes.option}>
      <Tooltip title={tip} placement="right">
        <Typography variant="body1">{label}:</Typography>
      </Tooltip>
      <Typography variant="body1">{value || "..."}</Typography>
    </Box>
  );
}
