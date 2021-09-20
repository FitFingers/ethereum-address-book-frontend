import { useContext, createContext, useCallback, useReducer } from "react";

// ===================================================
// USECONTEXT => ACCESS COMPONENT, HANDLERS
// ===================================================

export const Context = createContext(null);

export default function useAuth() {
  return useContext(Context);
}

// ===================================================
// CONTEXT PROVIDER AND HANDLERS
// ===================================================

export function AuthContext({ children }) {
  const [{ isAuthenticated, contractAddress }, updateAuth] = useReducer(
    (state, newState) => ({ ...state, ...newState }),
    {
      isAuthenticated: false,
    }
  );

  const handleAuth = useCallback((address) => {
    updateAuth({ isAuthenticated: !!address, contractAddress: address });
  }, []);

  return (
    <Context.Provider
      value={{
        isAuthenticated,
        contractAddress,
        handleAuth,
      }}
    >
      {children}
    </Context.Provider>
  );
}
