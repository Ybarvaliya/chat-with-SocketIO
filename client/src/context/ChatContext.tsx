import { createContext, useState, ReactNode } from "react";
import { ChatType, MessageType } from "../types";

// Define the context type
interface ChatContextType {
  selectedChat: ChatType | null;
  setSelectedChat: (selectedChat: ChatType | null) => void;
  messages: MessageType[];
  setMessages: (messages: MessageType[]) => void;
}

// Create the context with default values
export const ChatContext = createContext<ChatContextType | undefined>(
  undefined
);

export const ChatContextProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [selectedChat, setSelectedChat] = useState<ChatType | null>(null);
  const [messages, setMessages] = useState<MessageType[]>([]);

  return (
    <ChatContext.Provider
      value={{
        selectedChat,
        setSelectedChat,
        messages,
        setMessages,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};
