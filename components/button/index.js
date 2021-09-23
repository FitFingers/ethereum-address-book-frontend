import { Button as MuiButton, Tooltip } from "@material-ui/core";
import useAuth from "components/auth/context";

// ===================================================
// COMPONENTS
// ===================================================

export default function Button({ children, noAuth, network, tip, ...props }) {
  const { isAuthenticated } = useAuth();
  return (
    <Tooltip
      title={network ? tip : "You must connect your wallet to use this feature"}
      enterDelay={500}
    >
      <span>
        <MuiButton
          disabled={!noAuth ?? !isAuthenticated}
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
