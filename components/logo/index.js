import { useMemo } from "react";
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
  ethereum: EthereumLogo,
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
    padding: theme.spacing(1, 2),
    mixBlendMode: network === "rinkeby" ? "multiply" : "normal",
    "& .MuiSvgIcon-root": {
      marginLeft: theme.spacing(1),
    },
  }),
}));

// ===================================================
// COMPONENTS
// ===================================================

export default function Logo({ network = "ethereum" }) {
  const classes = useStyles({ network });
  const logo = useMemo(() => logos[network], [network]);
  return (
    <Box className={classes.logo}>
      {logo ? (
        <Image alt={`${network} Logo`} src={logo} layout="intrinsic" />
      ) : (
        <Button variant="contained" color="secondary">
          <Typography variant="body2">Connect</Typography>
          <AccountBalanceWalletIcon fontSize="medium" color="primary" />
        </Button>
      )}
    </Box>
  );
}
