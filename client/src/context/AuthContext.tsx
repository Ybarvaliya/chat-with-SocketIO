import { createContext, useState, ReactNode } from "react";

import { User } from "../types";

interface AuthContextType {
  authUser: User | null;
  setAuthUser: (user: User) => void;
}

export const AuthContext = createContext<AuthContextType>({
  authUser: null,
  setAuthUser: () => {},
});

export const AuthContextProvider: React.FC<{
  children: ReactNode;
}> = ({ children }) => {
  const [authUser, setAuthUser] = useState<User>(
    JSON.parse(localStorage.getItem("chat-user") || "null")
  );

  return (
    <AuthContext.Provider value={{ authUser, setAuthUser }}>
      {children}
    </AuthContext.Provider>
  );
};
