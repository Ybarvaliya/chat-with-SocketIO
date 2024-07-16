import ChatContainer from "../components/ChatContainer";
import SearchInput from "../components/SearchInput";
import { useContext } from "react";

import { SocketContext } from "../context/SocketContext";
import { ChatContext } from "../context/ChatContext";

import useGetChats from "../hooks/useGetChats";
import useLogout from "../hooks/AuthHooks/useLogout";

import { ChatType } from "../types";

import { getRandomEmoji } from "../utils/emojis";
import { BiLogOut } from "react-icons/bi";

const Home = () => {
  return (
    <div className="flex sm:h-[450px] md:h-[550px] rounded-lg overflow-hidden bg-gray-400 bg-clip-padding backdrop-filter backdrop-blur-lg bg-opacity-0">
      <Sidebar />
      <ChatContainer />
    </div>
  );
};

const Sidebar = () => {
  const { loading, chats } = useGetChats();
  const { selectedChat, setSelectedChat } = useContext(ChatContext)!;
  const { onlineUsers } = useContext(SocketContext);
  return (
    <>
      <div className="border-r border-slate-500 p-4 flex flex-col">
        <SearchInput />

        <div className="divider px-3"></div>

        <div className="py-2 flex flex-col overflow-auto">
          {chats.map((chat: ChatType, idx) => (
            <>
              <div
                key={chat._id}
                className={`flex gap-2 items-center hover:bg-sky-500 rounded p-2 py-1 cursor-pointer ${
                  selectedChat?._id === chat._id ? "bg-sky-500" : ""
                }`}
                onClick={() => setSelectedChat(chat)}
              >
                <div
                  className={`avatar ${
                    onlineUsers.includes(chat._id.toString()) ? "online" : ""
                  }`}
                >
                  <div className="w-12 rounded-full">
                    <img src={chat.profilePic} alt="user avatar" />
                  </div>
                </div>
                <div className="flex flex-col flex-1">
                  <div className="flex gap-3 justify-between">
                    <p className="font-bold text-gray-200">{chat.fullName}</p>
                    <span className="text-xl">{getRandomEmoji()}</span>
                  </div>
                </div>
              </div>
              {!(idx === chats.length - 1) && (
                <div className="divider my-0 py-0 h-1" />
              )}
            </>
          ))}

          {loading ? (
            <span className="loading loading-spinner mx-auto"></span>
          ) : null}
        </div>
        <Logout></Logout>
      </div>
    </>
  );
};

const Logout = () => {
  const { loading, logout } = useLogout();
  return (
    <>
      <div className="mt-auto">
        {!loading ? (
          <BiLogOut
            className="w-6 h-6 text-white cursor-pointer"
            onClick={logout}
          />
        ) : (
          <span className="loading loading-spinner"></span>
        )}
      </div>
    </>
  );
};

export default Home;
