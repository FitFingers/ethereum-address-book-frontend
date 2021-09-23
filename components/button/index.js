import { Button as MuiButton, Tooltip } from "@material-ui/core";

// ===================================================
// COMPONENTS
// ===================================================

export default function Button({ children, network, tip, ...props }) {
  return (
    <Tooltip
      title={network ? tip : "You must connect your wallet to use this feature"}
      enterDelay={500}
    >
      <span>
        <MuiButton
          disabled={!network}
          variant="contained"
          fullWidth
          color="secondary"
          {...props}
        >
          {children}
        </MuiButton>
      </span>
    </Tooltip>
  );
}
