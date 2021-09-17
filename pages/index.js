import Head from "next/head";
import Image from "next/image";
import {
  makeStyles,
  Box,
  Typography,
  AppBar,
  Toolbar,
} from "@material-ui/core";

// ===================================================
// STYLES
// ===================================================

const useStyles = makeStyles((theme) => ({
  container: {
    height: "100vh",
    width: "100vw",
    background: theme.palette.background.default,
  },
  main: {
    //
  },
  title: {
    //
  },
  description: {
    //
  },
  code: {
    //
  },
  grid: {
    //
  },
  card: {
    //
  },
  footer: {
    //
  },
}));

// ===================================================
// COMPONENTS
// ===================================================

export default function Home() {
  const classes = useStyles();
  return (
    <Box className={classes.container}>
      <Head>
        <title>Address Book Whitelist</title>
        <meta
          name="description"
          content="Address book for Ethereum users. Add and remove contracts and send transactions to them"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <AppBar color="primary">
        <Toolbar></Toolbar>
      </AppBar>

      <main className={classes.main}>
        <Typography variant="h1" className={classes.title}>
          Welcome to <a href="https://nextjs.org">Next.js!</a>
        </Typography>

        <Typography variant="body1" className={classes.description}>
          Get started by editing{" "}
          <code className={classes.code}>pages/index.js</code>
        </Typography>

        <Box className={classes.grid}>
          <a href="https://nextjs.org/docs" className={classes.card}>
            <Typography variant="h2">Documentation &rarr;</Typography>
            <Typography variant="body1">
              Find in-depth information about Next.js features and API.
            </Typography>
          </a>

          <a href="https://nextjs.org/learn" className={classes.card}>
            <Typography variant="h2">Learn &rarr;</Typography>
            <Typography variant="body1">
              Learn about Next.js in an interactive course with quizzes!
            </Typography>
          </a>

          <a
            href="https://github.com/vercel/next.js/tree/master/examples"
            className={classes.card}
          >
            <Typography variant="h2">Examples &rarr;</Typography>
            <Typography variant="body1">
              Discover and deploy boilerplate example Next.js projects.
            </Typography>
          </a>

          <a
            href="https://vercel.com/new?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
            className={classes.card}
          >
            <Typography variant="h2">Deploy &rarr;</Typography>
            <Typography variant="body1">
              Instantly deploy your Next.js site to a public URL with Vercel.
            </Typography>
          </a>
        </Box>
      </main>

      <footer className={classes.footer}>
        <a
          href="https://vercel.com?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Typography variant="body1">
            © {new Date().getFullYear()} James Hooper
          </Typography>
        </a>
      </footer>
    </Box>
  );
}
