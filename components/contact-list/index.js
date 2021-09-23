import { makeStyles, List, ListItemText, ListItem } from "@material-ui/core";
import useMetaMask from "hooks/useMetaMask";

// ===================================================
// STYLES
// ===================================================

const useStyles = makeStyles((theme) => ({
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
  );
}
