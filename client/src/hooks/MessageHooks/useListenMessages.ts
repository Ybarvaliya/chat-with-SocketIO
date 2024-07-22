import { useContext, useEffect } from "react";
import { SocketContext } from "../../context/SocketContext";
import notificationSound from "../../assets/sounds/notification.mp3";
import { ChatContext } from "../../context/ChatContext";
import { MessageType } from "../../types";

const useListenMessages = () => {
  const { socket } = useContext(SocketContext);
  const { messages, setMessages } = useContext(ChatContext)!;

  useEffect(() => {
    const handleNewMessage = (newMessage: MessageType) => {
      const sound = new Audio(notificationSound);
      sound.play();
      console.log(newMessage);
      setMessages([...messages, newMessage]);
      console.log(messages)
    };

    socket?.on("newMessage", handleNewMessage);

    return () => {
      socket?.off("newMessage", handleNewMessage);
    };
  }, [socket, setMessages, messages]);

  return null;
};

export default useListenMessages;
