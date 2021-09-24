import { SnackbarProvider } from "notistack";
import createSnackbar from "components/feedback";

// ===================================================
// CONTEXT WRAPPER (extends notisnack => own component solely for modulation)
// ===================================================

export function FeedbackContext({ children }) {
  return (
    <SnackbarProvider
      preventDuplicate
      autoHideDuration={3000}
      maxSnack={3}
      variant="success"
      content={createSnackbar}
    >
      {children}
    </SnackbarProvider>
  );
}
