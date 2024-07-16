import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { AuthContextProvider } from "./context/AuthContext.tsx";
import { SocketContextProvider } from "./context/SocketContext.tsx";
import { ChatContextProvider } from "./context/ChatContext.tsx";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <AuthContextProvider>
      <SocketContextProvider>
        <ChatContextProvider>
          <App />
        </ChatContextProvider>
      </SocketContextProvider>
    </AuthContextProvider>
  </React.StrictMode>
);
