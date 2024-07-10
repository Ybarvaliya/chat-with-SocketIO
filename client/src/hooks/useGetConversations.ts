import { useEffect, useState } from "react";
import toast from "react-hot-toast";

import { ConversationType } from "../types.ts";

const useGetConversations = (): {
  loading: boolean;
  conversations: ConversationType[];
} => {
  const [loading, setLoading] = useState(false);
  const [conversations, setConversations] = useState<ConversationType[]>([]);

  useEffect(() => {
    const getConversations = async () => {
      setLoading(true);
      try {
        const res = await fetch("http://localhost:5555/users");
        const data = await res.json();
        if (data.error) {
          throw new Error(data.error);
        }
        setConversations(data);
      } catch (error) {
        if (error instanceof Error) toast.error(error.message);
        else console.log("Error in useGetConversations Hook");
      } finally {
        setLoading(false);
      }
    };

    getConversations();
  }, []);

  return { loading, conversations };
};
export default useGetConversations;
