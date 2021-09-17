import Image from "next/image";
import { makeStyles, Box } from "@material-ui/core";

import RinkebyLogo from "public/rinkeby-logo-landscape.jpeg";
import EthereumLogo from "public/ethereum-logo-landscape-purple.png";

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
  }),
}));

// ===================================================
// COMPONENTS
// ===================================================

export default function Logo({ network = "ethereum" }) {
  const classes = useStyles({ network });
  return (
    <Box className={classes.logo}>
      <Image alt={`${network} Logo`} src={logos[network]} layout="intrinsic" />
    </Box>
  );
}
