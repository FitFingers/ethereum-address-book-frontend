import { makeStyles, Box, Typography } from "@material-ui/core";
import Button from "components/button";

// ===================================================
// STYLES
// ===================================================

const useStyles = makeStyles((theme) => ({
  buttonList: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-end",
    flex: 1,
    margin: theme.spacing(1),
    "&>span": {
      margin: theme.spacing(1, 0),
      "&:last-child": {
        marginBottom: 0,
      },
    },
  },
}));

// ===================================================
// COMPONENTS
// ===================================================

export default function ButtonList({ buttons = [] }) {
  const classes = useStyles();

  const minOneButton = buttons.some((btn) => btn?.conditions?.every(Boolean));

  return (
    <>
      {minOneButton && (
        <Box className={classes.buttonList}>
          {buttons.map(
            ({ conditions = [true], label, action, ...button }, idx) => (
              <>
                {conditions.every(Boolean) && (
                  <Button
                    {...button}
                    onClick={action}
                    key={`button-list-${label}-${idx}`} // TODO: change!
                  >
                    <Typography variant="body1">{label}</Typography>
                  </Button>
                )}
              </>
            )
          )}
        </Box>
      )}
    </>
  );
}
