import { SyntheticEvent, useContext, useState } from "react";
import { IoSearchSharp } from "react-icons/io5";
import useGetChats from "../hooks/useGetChats";
import toast from "react-hot-toast";
import { ChatContext } from "../context/ChatContext";

const SearchInput = () => {
  const [search, setSearch] = useState("");
  const { setSelectedChat } = useContext(ChatContext)!;
  const { chats } = useGetChats();

  const handleSubmit = (e: SyntheticEvent) => {
    e.preventDefault();
    if (!search) return;
    if (search.length < 3) {
      return toast.error("Search term must be at least 3 characters long");
    }

    const chat = chats.find((c) =>
      c.fullName.toLowerCase().includes(search.toLowerCase())
    );

    if (chat) {
      setSelectedChat(chat);
      setSearch("");
    } else toast.error("No such user found!");
  };
  return (
    <form onSubmit={handleSubmit} className="flex items-center gap-2">
      <input
        type="text"
        placeholder="Search…"
        className="input input-bordered rounded-full p-2"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
      <button type="submit" className="btn btn-circle bg-sky-500 text-white p-2 rounded-full">
        <IoSearchSharp className="w-6 h-6 outline-none" />
      </button>
    </form>
  );
};
export default SearchInput;
