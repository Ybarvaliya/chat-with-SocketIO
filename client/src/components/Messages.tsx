import { useContext, useEffect, useRef } from "react";
import useGetMessages from "../hooks/MessageHooks/useGetMessages.ts";
import useListenMessages from "../hooks/MessageHooks/useListenMessages.ts";
import { extractTime } from "../utils/extractTime.ts";
import { AuthContext } from "../context/AuthContext.tsx";
import { ChatContext } from "../context/ChatContext.tsx";
import { MessageType } from "../types.ts";

const Messages = () => {
  useListenMessages();
  const { messages, loading } = useGetMessages();

  const lastMessageRef = useRef<HTMLDivElement | null>(null);
  const prevMessages = useRef<MessageType[]>([]);

  useEffect(() => {
    if (messages.length > prevMessages.current.length) {
      setTimeout(() => {
        if (lastMessageRef.current) {
          (lastMessageRef.current as HTMLElement).scrollIntoView({
            behavior: "smooth",
          });
        }
      }, 100);
    }
    
    // Update prevMessages.current after the effect logic
    prevMessages.current = messages;
  }, [messages]);

  return (
    <div className="px-4 flex-1 overflow-auto">
      {!loading &&
        messages.length > 0 &&
        messages.map((message: MessageType) => (
          <div key={message.id} ref={lastMessageRef}>
            <Message mess={message} />
          </div>
        ))}

      {loading && [...Array(3)].map((_, idx) => <MessageSkeleton key={idx} />)}

      {!loading && messages.length === 0 && (
        <p className="text-center">Send a message to start the conversation</p>
      )}
    </div>
  );
};
export default Messages;

const Message = ({ mess }: { mess: MessageType }) => {
  const { authUser } = useContext(AuthContext);
  const { selectedChat } = useContext(ChatContext)!;
  const formattedTime = extractTime(mess.createdAt.toString());

  const fromMe = mess.sender === authUser?._id;
  const chatClassName = fromMe ? "justify-end" : "justify-start";
  const profilePic = fromMe ? authUser?.profilePic : selectedChat?.profilePic;
  const bubbleBgColor = fromMe ? "bg-blue-500" : "bg-gray-700";

  return (
    <div className={`flex items-end mb-4 ${chatClassName}`}>
      {!fromMe && (
        <div className="w-10 h-10 rounded-full overflow-hidden">
          <img src={profilePic} alt="Profile" />
        </div>
      )}
      <div className={`max-w-xs mx-2 p-3 rounded-lg ${bubbleBgColor} text-white shadow-lg`}>
        {mess.message}
      </div>
      <div className="text-xs text-gray-400 ml-2">
        {formattedTime}
      </div>
      {fromMe && (
        <div className="w-10 h-10 rounded-full overflow-hidden">
          <img src={profilePic} alt="Profile" />
        </div>
      )}
    </div>
  );
};

const MessageSkeleton = () => (
  <div className="flex items-end mb-4">
    <div className="w-10 h-10 bg-gray-200 rounded-full animate-pulse"></div>
    <div className="max-w-xs mx-2 p-3 rounded-lg bg-gray-200 text-white shadow-lg animate-pulse"></div>
    <div className="text-xs text-gray-200 ml-2 animate-pulse">•••</div>
  </div>
);