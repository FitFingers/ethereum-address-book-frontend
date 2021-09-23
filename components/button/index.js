import { Button as MuiButton, Tooltip } from "@material-ui/core";
import useAuth from "components/auth/context";

// ===================================================
// COMPONENTS
// ===================================================

export default function Button({ children, tip, noAuth, ...props }) {
  const { isAuthenticated } = useAuth();
  const usable = noAuth || isAuthenticated;

  return (
    <Tooltip
      title={usable ? tip : "You must connect your wallet to use this feature"}
      enterDelay={500}
    >
      <span>
        <MuiButton
          disabled={!usable}
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
