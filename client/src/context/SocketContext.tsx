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

interface SocketContextType {
  socket: Socket | null;
  onlineUsers: string[];
}

export const SocketContext = createContext<SocketContextType>({
  socket: null,
  onlineUsers: [],
});

export const SocketContextProvider: React.FC<{
  children: ReactNode;
}> = ({ children }) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [onlineUsers, setOnlineUsers] = useState<string[]>([]);

  const { authUser } = useContext(AuthContext);

  useEffect(() => {
    const setupSocket = () => {
      if (authUser) {
        // Create a new socket connection with the authenticated user's ID
        const newSocket = io("http://localhost:5555", {
          query: {
            userId: authUser._id,
          },
        });

        // Set the socket state
        setSocket(newSocket);

        // Listen for the "getOnlineUsers" event and update the online users state
        newSocket.on("getOnlineUsers", (users: string[]) => {
          setOnlineUsers(users);
        });

        // Return the new socket instance
        return newSocket;
      } else {
        // If no authenticated user, close any existing socket connection
        if (socket) {
          socket.close();
          setSocket(null);
        }
      }
    };

    // Call the setupSocket function to initialize the socket connection
    const newSocket = setupSocket();

    // Clean up the socket connection when the component unmounts or authUser changes
    return () => {
      if (newSocket) {
        newSocket.close();
      }
    };
  }, [authUser]); // Dependency array to re-run the effect when authUser changes

  // Memoize the context value to optimize performance
  const contextValue = useMemo(
    () => ({
      socket,
      onlineUsers,
    }),
    [socket, onlineUsers] // Dependencies for memoization
  );

  // Provide the context value to children components
  return (
    <SocketContext.Provider value={contextValue}>
      {children}
    </SocketContext.Provider>
  );
};
