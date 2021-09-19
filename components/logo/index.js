import Image from "next/image";
import { makeStyles, Button, Box, Typography } from "@material-ui/core";

import RinkebyLogo from "public/rinkeby-logo-landscape.jpeg";
import EthereumLogo from "public/ethereum-logo-landscape-purple.png";
import AccountBalanceWalletIcon from "@material-ui/icons/AccountBalanceWallet";

// NextJS doesn't support this type of dynamic import on static images
// import dynamic from "next/dynamic";
// const RinkebyLogo = dynamic(() => import("public/rinkeby-logo-landscape.jpeg"));
// const EthereumLogo = dynamic(() => import("public/ethereum-logo-landscape-purple.png"));

// ===================================================
// UTIL
// ===================================================

const logos = {
  main: EthereumLogo,
  rinkeby: RinkebyLogo,
};

// ===================================================
// STYLES
// ===================================================

const useStyles = makeStyles((theme) => ({
  logo: {
    position: "relative",
    maxWidth: 180,
    width: "100%",
    height: "auto",
    padding: theme.spacing(1, 2),
    mixBlendMode: "multiply", // network === "rinkeby" ? "multiply" : "normal", // TODO: network updates, but new styles aren't applied?
    "& .MuiSvgIcon-root": {
      marginLeft: theme.spacing(1),
      color: theme.palette.background.toolbar,
    },
  },
}));

// ===================================================
// COMPONENTS
// ===================================================

export default function Logo({ network, handleClick }) {
  const classes = useStyles({ network });
  const logo = logos[network];
  return (
    <Box className={classes.logo} onClick={handleClick}>
      {logo ? (
        <Image alt={`${network} Logo`} src={logo} layout="intrinsic" />
      ) : (
        <Button variant="contained" color="primary">
          <Typography variant="body2">{network || "Connect"}</Typography>
          <AccountBalanceWalletIcon fontSize="medium" />
        </Button>
      )}
    </Box>
  );
}
