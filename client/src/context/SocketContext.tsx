import React, {
  createContext,
  useState,
  useEffect,
  useContext,
  ReactNode,
} from "react";
import { AuthContext } from "./AuthContext";
import io, { Socket } from "socket.io-client";

// Define types for context values and provider props
interface SocketContextType {
  socket: Socket | null;
  onlineUsers: string[];
}

interface SocketContextProviderProps {
  children: ReactNode;
}

// Create the context with default values
export const SocketContext = createContext<SocketContextType | undefined>(undefined);

export const SocketContextProvider: React.FC<SocketContextProviderProps> = ({
  children,
}) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [onlineUsers, setOnlineUsers] = useState<string[]>([]);
  const { authUser } = useContext(AuthContext);

  useEffect(() => {
    const func = () => {
      if (authUser) {
        const newSocket = io("https://chat-app-yt.onrender.com", {
          query: {
            userId: authUser._id,
          },
        });

        setSocket(newSocket);

        newSocket.on("getOnlineUsers", (users: string[]) => {
          setOnlineUsers(users);
        });

        return () => newSocket.close();
      } else {
        if (socket) {
          socket.close();
          setSocket(null);
        }
      }
    };
    func();
  }, [authUser]);

  return (
    <SocketContext.Provider value={{ socket, onlineUsers }}>
      {children}
    </SocketContext.Provider>
  );
};


