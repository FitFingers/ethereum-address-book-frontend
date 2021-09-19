import { Button, Tooltip } from "@material-ui/core";

// ===================================================
// COMPONENTS
// ===================================================

export default function MyButton({ children, network, tip, ...props }) {
  return (
    <Tooltip
      title={network ? tip : "You must connect your wallet to use this feature"}
      enterDelay={500}
    >
      <span>
        <Button
          disabled={!network}
          variant="contained"
          fullWidth
          color="primary"
          {...props}
        >
          {children}
        </Button>
      </span>
    </Tooltip>
  );
}
