import MessageContainer from "../components/MessageContainer";
import Conversation from "../components/Conversation";
import SearchInput from "../components/SearchInput";

import useGetConversations from "../hooks/useGetConversations";
import useLogout from "../hooks/useLogout";

import { getRandomEmoji } from "../utils/emojis";
import { BiLogOut } from "react-icons/bi";

import { ConversationType } from "../types";

const Home = () => {
  return (
    <div className="flex sm:h-[450px] md:h-[550px] rounded-lg overflow-hidden bg-gray-400 bg-clip-padding backdrop-filter backdrop-blur-lg bg-opacity-0">
      
      <Sidebar />
      <MessageContainer />
    
    </div>
  );
};

const Sidebar = () => {
  const { loading, conversations } = useGetConversations();
  return (
    <>
      <div className="border-r border-slate-500 p-4 flex flex-col">
        <SearchInput />

        <div className="divider px-3"></div>

        <div className="py-2 flex flex-col overflow-auto">
          {conversations.map((conv: ConversationType, idx) => (
            <Conversation
              key={conv._id}
              conversation={conv}
              emoji={getRandomEmoji()}
              lastIdx={idx === conversations.length - 1}
            />
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
