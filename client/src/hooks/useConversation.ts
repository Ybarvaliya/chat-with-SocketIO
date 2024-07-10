import { create } from "zustand";
import { ConversationType } from "../types";

interface ConversationState {
  selectedConversation: ConversationType | null;
  setSelectedConversation: (selectedConversation: ConversationType) => void;
  messages: string[];
  setMessages: (messages: string[]) => void;
}

const useConversation = create<ConversationState>((set) => ({
  selectedConversation: null,
  setSelectedConversation: (selectedConversation) => set({ selectedConversation }),
  messages: [],
  setMessages: (messages) => set({ messages }),
}));

export default useConversation;
