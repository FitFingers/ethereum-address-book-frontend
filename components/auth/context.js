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

// isAuthenticated: Boolean => does the user have an address book? (Signs in automatically, if so)
// contractAddress: String => the AddressBook contract address for this user/account's address
export function AuthContext({ children }) {
  const [{ isAuthenticated, contractAddress }, updateAuth] = useReducer(
    (state, newState) => ({ ...state, ...newState }),
    {
      isAuthenticated: false,
      contractAddress: null,
    }
  );

  const handleAuth = useCallback((address) => {
    updateAuth({
      isAuthenticated:
        address && address !== "0x0000000000000000000000000000000000000000",
      contractAddress: address,
    });
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
