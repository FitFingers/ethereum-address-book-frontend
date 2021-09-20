import { useEffect, useState } from "react";
import { makeStyles, Box, Typography, Tooltip } from "@material-ui/core";

// ===================================================
// STYLES
// ===================================================

const useStyles = makeStyles((theme) => ({
  option: ({ didUpdate }) => ({
    background: didUpdate
      ? theme.palette.background.toolbar
      : theme.palette.background.paper,
    padding: theme.spacing(0, 1),
    margin: theme.spacing(0, -1),
    borderRadius: theme.shape.borderRadius,
    color: didUpdate
      ? theme.palette.secondary.main
      : theme.palette.text.primary,
    transition: theme.transitions.create("color", {
      duration: theme.transitions.duration.standard,
    }),
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
  }),
}));

// ===================================================
// COMPONENTS
// ===================================================

export default function Option({ tip, label, value }) {
  const [didUpdate, setDidUpdate] = useState(false);
  const classes = useStyles({ didUpdate });

  useEffect(() => {
    if (!value) return;
    setDidUpdate(true);
    setTimeout(() => setDidUpdate(false), 4000);
  }, [value]);

  console.log('DEBUG', { label, value})

  return (
    <Box className={classes.option}>
      <Tooltip title={tip} placement="right">
        <Typography variant="body1">{label}:</Typography>
      </Tooltip>
      <Typography variant="body1">{value || "..."}</Typography>
    </Box>
  );
}
