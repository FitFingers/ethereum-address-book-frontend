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
    transition: theme.transitions.create(["color", "background"], {
      duration: 750, // theme.transitions.duration.complex,
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

// TODO: change isFactoryOwner etc to a context value in useAuth
export default function Option({
  tip,
  label,
  value,
  onlyOwner,
  isFactoryOwner,
}) {
  const [didUpdate, setDidUpdate] = useState(false);
  const classes = useStyles({ didUpdate });

  useEffect(() => {
    if (!value) return;
    setDidUpdate(true);
    setTimeout(() => setDidUpdate(false), 2500);
  }, [value]);

  return !onlyOwner || (onlyOwner && isFactoryOwner) ? (
    <Box className={classes.option}>
      <Tooltip title={tip} placement="right">
        <Typography variant="body1">{label}:</Typography>
      </Tooltip>
      <Typography variant="body1">{value || "..."}</Typography>
    </Box>
  ) : (
    <></>
  );
}
