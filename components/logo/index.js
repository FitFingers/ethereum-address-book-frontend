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
  logo: ({ network }) => ({
    position: "relative",
    maxWidth: 180,
    width: "100%",
    height: "auto",
    mixBlendMode: network === "rinkeby" ? "multiply" : "normal",
    padding: theme.spacing(network === "rinkeby" ? 1 : 0, 2),
    margin: theme.spacing(network === "rinkeby" ? -2 : 0, 0),
    "& .MuiSvgIcon-root": {
      marginLeft: theme.spacing(1),
      color: theme.palette.background.toolbar,
    },
    [theme.breakpoints.down("sm")]: {
      "& .MuiButton-root": {
        margin: theme.spacing(0, -1),
      },
    },
  }),
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
