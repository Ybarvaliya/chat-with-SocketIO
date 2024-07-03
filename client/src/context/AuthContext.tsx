import { createContext, useState, ReactNode } from "react";

interface AuthContextType {
  authUser: boolean;
  setAuthUser: (user: any) => void;
}

export const AuthContext = createContext<AuthContextType>({
  authUser: false,
  setAuthUser: () => {},
});

export const AuthContextProvider: React.FC<{
  children: ReactNode;
}> = ({ children }) => {
  const [authUser, setAuthUser] = useState<any>(
    JSON.parse(localStorage.getItem("chat-user") || "null")
  );

  return (
    <AuthContext.Provider value={{ authUser, setAuthUser }}>
      {children}
    </AuthContext.Provider>
  );
};
