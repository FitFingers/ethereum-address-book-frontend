import { makeStyles, Box } from "@material-ui/core";
import Button from "components/button";

// ===================================================
// STYLES
// ===================================================

const useStyles = makeStyles((theme) => ({
  buttonRow: {
    display: "flex",
    margin: theme.spacing(0, -1),
    "&>span": {
      margin: theme.spacing(0, 1),
      flex: 1,
    },
  },
}));

// ===================================================
// COMPONENTS
// ===================================================

export default function ButtonRow({ buttons = [] }) {
  const classes = useStyles();
  return (
    <Box className={classes.buttonRow}>
      {buttons.map(({ action, tip, icon }) => (
        <Button onClick={action} tip={tip} key={`button-row-${tip}`}>
          {icon}
        </Button>
      ))}
    </Box>
  );
}
