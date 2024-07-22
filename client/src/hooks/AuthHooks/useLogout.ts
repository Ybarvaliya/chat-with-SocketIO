import { useContext, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import toast from "react-hot-toast";

const useLogout = () => {
  const [loading, setLoading] = useState(false);
  const { setAuthUser } = useContext(AuthContext);

  const logout = async () => {
    setLoading(true);

    try {
      const res = await fetch("http://localhost:5555/auth/logout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        
      });
      const data = await res.json();
      if (data.error) {
        throw new Error(data.error);
      }

      localStorage.removeItem("chat-user");
      setAuthUser(null);
      toast.success("Logged out successfully!");
    } catch (error) {
      if (error instanceof Error) toast.error(error.message);
      else toast.error("An unknown error occurred.");
      console.error("Error in useLogout Hook", error);
    } finally {
      setLoading(false);
    }
  };

  return { loading, logout };
};

export default useLogout;
