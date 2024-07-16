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
          <div key={message._id} ref={lastMessageRef}>
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
  const formattedTime = extractTime(mess.createdAt!);

  const fromMe = mess.senderId === authUser?._id;
  const chatClassName = fromMe ? "chat-end" : "chat-start";
  const profilePic = fromMe ? authUser?.profilePic : selectedChat?.profilePic;
  const bubbleBgColor = fromMe ? "bg-blue-500" : "";

  return (
    <div className={`chat ${chatClassName}`}>
      <div className="chat-image avatar">
        <div className="w-10 rounded-full">
          <img alt="Tailwind CSS chat bubble component" src={profilePic} />
        </div>
      </div>
      <div className={`chat-bubble text-white ${bubbleBgColor} pb-2`}>
        {mess.message}
      </div>
      <div className="chat-footer opacity-50 text-xs flex gap-1 items-center">
        {formattedTime}
      </div>
    </div>
  );
};

const MessageSkeleton = () => {
  return (
    <>
      <div className="flex gap-3 items-center">
        <div className="skeleton w-10 h-10 rounded-full shrink-0"></div>
        <div className="flex flex-col gap-1">
          <div className="skeleton h-4 w-40"></div>
          <div className="skeleton h-4 w-40"></div>
        </div>
      </div>
      <div className="flex gap-3 items-center justify-end">
        <div className="flex flex-col gap-1">
          <div className="skeleton h-4 w-40"></div>
        </div>
        <div className="skeleton w-10 h-10 rounded-full shrink-0"></div>
      </div>
    </>
  );
};
