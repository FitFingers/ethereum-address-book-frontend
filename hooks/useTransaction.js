import { useContext, createContext, useReducer } from "react";

// ===================================================
// USECONTEXT => ACCESS COMPONENT, HANDLERS
// ===================================================

export const Context = createContext(null);

export default function useTransaction() {
  return useContext(Context);
}

// ===================================================
// CONTEXT PROVIDER AND HANDLERS
// ===================================================

export function TransactionContext({ children }) {
  const [{ txHash, txSuccess, prevHash, prevSuccess }, updateTransaction] =
    useReducer((state, newState) => ({ ...state, ...newState }), {
      txHash: null,
      txSuccess: null,
      prevHash: null,
      prevSuccess: null,
    });

    console.log('DEBUG', { prevSuccess, prevHash, txSuccess })

  return (
    <Context.Provider
      value={{
        txHash,
        txSuccess,
        prevHash,
        prevSuccess,
        updateTransaction,
      }}
    >
      {children}
    </Context.Provider>
  );
}
