import { useEffect, useState } from "react";
import toast from "react-hot-toast";

import { ChatType } from "../types.ts";

const useGetChats = (): {
  loading: boolean;
  chats: ChatType[];
} => {
  const [loading, setLoading] = useState(false);
  const [chats, setChats] = useState<ChatType[]>([]);

  useEffect(() => {
    const getChats = async () => {
      setLoading(true);
      try {
        const res = await fetch("http://localhost:5555/chat", {
          method: "GET",
          credentials: "include", // This will include cookies in the request
        });
        const data = await res.json();
        if (data.error) {
          throw new Error(data.error);
        }
        setChats(data);
      } catch (error) {
        if (error instanceof Error) toast.error(error.message);
        else console.log("Error in useGetChats Hook");
      } finally {
        setLoading(false);
      }
    };

    getChats();
  }, []);

  return { loading, chats };
};
export default useGetChats;
