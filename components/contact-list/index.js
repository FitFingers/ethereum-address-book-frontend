import { makeStyles, Box, List, ListItemText, ListItem } from "@material-ui/core";
import useMetaMask from "hooks/useMetaMask";

// ===================================================
// STYLES
// ===================================================

const useStyles = makeStyles((theme) => ({
  contactWindow: {
    borderRadius: theme.shape.borderRadius,
    background: theme.palette.background.default,
    boxShadow: `inset ${theme.shadows[3].replace(/\),/g, "),inset ")}`,
    marginBottom: theme.spacing(2),
    minHeight: 120,
    height: "100%",
    overflow: "auto",
    [theme.breakpoints.down("sm")]: {
      minHeight: 220,
    },

    "&::-webkit-scrollbar-track": {
      borderRadius: theme.shape.borderRadius,
      backgroundColor: "inherit",
      "-webkit-box-shadow": `inset 0 0 ${theme.spacing(
        0.5
      )} rgba(0, 0, 0, 0.3)`,
    },
    "&::-webkit-scrollbar": {
      width: theme.spacing(0.5),
      background: "#f5f5f5",
    },
    "&::-webkit-scrollbar-thumb": {
      backgroundColor: theme.palette.secondary.main,
      borderRadius: theme.shape.borderRadius,
      "-webkit-box-shadow": `inset 0 0 ${theme.spacing(
        0.5
      )} rgba(0, 0, 0, 0.3)`,
    },
  },
  listitem: {
    "& .MuiTypography-root": {
      transition: theme.transitions.create("color", {
        duration: theme.transitions.duration.shorter,
      }),
    },
    "&:hover": {
      color: theme.palette.getContrastText(theme.palette.secondary.main),
      background: theme.palette.secondary.light,
    },
    "&.Mui-selected": {
      color: theme.palette.getContrastText(theme.palette.secondary.main),
      background: theme.palette.secondary.main,
      "&:hover": {
        color: theme.palette.getContrastText(theme.palette.secondary.main),
        background: theme.palette.secondary.main,
      },
    },
  },
}));

// ===================================================
// COMPONENTS
// ===================================================

export default function ContactList({ selected, handleListItemClick }) {
  const classes = useStyles({ selected });
  const {
    addressBookContract: { contactList },
  } = useMetaMask();

  return (
    <Box className={classes.contactWindow}>
      <List>
        {contactList?.length ? (
          contactList.map(({ name }) => (
            <ListItem
              className={classes.listitem}
              button
              disableRipple
              selected={selected === name}
              onClick={() => handleListItemClick(name)}
              key={`contact-list-${name}`}
            >
              <ListItemText primary={name} />
            </ListItem>
          ))
        ) : (
          <ListItem>
            <ListItemText
              primary="Your address book appears to be empty!"
              secondary="Try connecting your wallet or adding a contact using the buttons on this page."
            />
          </ListItem>
        )}
      </List>
    </Box>
  );
}
