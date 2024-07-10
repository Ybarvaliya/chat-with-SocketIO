import React, {
  createContext,
  useState,
  useEffect,
  useContext,
  ReactNode,
  useMemo,
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
export const SocketContext = createContext<SocketContextType>({
  socket: null,
  onlineUsers: [],
});

export const SocketContextProvider: React.FC<SocketContextProviderProps> = ({
  children,
}) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [onlineUsers, setOnlineUsers] = useState<string[]>([]);
  const { authUser } = useContext(AuthContext);

  useEffect(() => {
    const setupSocket = () => {
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

        return newSocket;
      } else {
        if (socket) {
          socket.close();
          setSocket(null);
        }
      }
    };

    const newSocket = setupSocket();

    return () => {
      if (newSocket) {
        newSocket.close();
      }
    };
  }, [authUser]);

  const contextValue = useMemo(
    () => ({
      socket,
      onlineUsers,
    }),
    [socket, onlineUsers]
  );

  return (
    <SocketContext.Provider value={contextValue}>
      {children}
    </SocketContext.Provider>
  );
};
