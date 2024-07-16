import { useEffect, useState, useContext} from "react";
import toast from "react-hot-toast";
import { ChatContext } from "../../context/ChatContext";

const useGetMessages = () => {

  const [loading, setLoading] = useState(false);
  const { messages, setMessages, selectedChat } = useContext(ChatContext)!;

  useEffect(() => {

    const getMessages = async () => {
      setLoading(true);
     
      try {
    
        const res = await fetch(
          `http://localhost:5555/message/${selectedChat?._id}`
        );
        const data = await res.json();

        if (data.error) throw new Error(data.error);
        setMessages(data);
      
    } catch (error) {
        if (error instanceof Error) toast.error(error.message);
        console.log("Error in useGetMessage Hook");
      } finally {
        setLoading(false);
      }
    };

    if (selectedChat?._id) getMessages();
  }, [selectedChat?._id, setMessages]);

  return { messages, loading };
};
export default useGetMessages;
