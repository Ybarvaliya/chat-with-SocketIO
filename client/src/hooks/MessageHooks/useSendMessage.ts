import { useState, useContext } from "react";
import {ChatContext} from "../../context/ChatContext";
import toast from "react-hot-toast";
import { MessageType } from "../../types";

const useSendMessage = () => {
  const [loading, setLoading] = useState(false);
  const { messages, setMessages, selectedChat } = useContext(ChatContext)!;

  const sendMessage = async (message: MessageType) => {
    setLoading(true);
    try {
      const msg: string = message.message;
      console.log(selectedChat?._id, "yuval", msg);
      const res = await fetch(
        `http://localhost:5555/message/send/${selectedChat?._id}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({ msg }),
        }
      );
      const data = await res.json();
      if (data.error) throw new Error(data.error);

      setMessages([...messages, data]);
    } catch (error) {
      if (error instanceof Error) toast.error(error.message);
      console.log("Error in useSendMessage Hook");
    } finally {
      setLoading(false);
    }
  };

  return { sendMessage, loading };
};
export default useSendMessage;
