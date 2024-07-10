import { createContext, useState, ReactNode, useEffect } from "react";
import { User } from "../types";

interface AuthContextType {
  authUser: User | null;
  setAuthUser: (user: User | null) => void;
}

export const AuthContext = createContext<AuthContextType>({
  authUser: null,
  setAuthUser: () => {},
});

export const AuthContextProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [authUser, setAuthUser] = useState<User | null>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("chat-user");
    if (storedUser) {
      setAuthUser(JSON.parse(storedUser));
    }
  }, []);

  return (
    <AuthContext.Provider value={{ authUser, setAuthUser }}>
      {children}
    </AuthContext.Provider>
  );
};
