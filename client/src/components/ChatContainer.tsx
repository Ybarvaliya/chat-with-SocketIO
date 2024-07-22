import { useContext, useEffect } from "react";
import MessageInput from "./MessageInput";
import Messages from "./Messages";
import { TiMessages } from "react-icons/ti";
import { AuthContext } from "../context/AuthContext";
import { ChatContext } from "../context/ChatContext";

const ChatContainer = () => 
  {
	const { selectedChat, setSelectedChat } = useContext(ChatContext)!;

	useEffect(() => {
		// cleanup function (unmounts)
		return () => setSelectedChat(null);
	}, [setSelectedChat]);

	return (
		<div className='md:min-w-[450px] flex flex-col w-[75%] h-full'>
			{!selectedChat ? (
				<NoChatSelected />
			) : (
				<>
					{/* Header */}
					<div className='bg-slate-500 px-4 py-2 mb-2'>
						<span className='label-text'>To:</span>{" "}
						<span className='text-gray-900 font-bold'>
							{selectedChat.fullName}
						</span>
					</div>
					<Messages />
					<MessageInput />
				</>
			)}
		</div>
	);
};
export default ChatContainer;

const NoChatSelected = () => {
	const { authUser } = useContext(AuthContext);
	return (
		<div className='flex items-center justify-center w-full h-full'>
			<div className='px-4 text-center sm:text-lg md:text-xl text-gray-200 font-semibold flex flex-col items-center gap-2'>
				<p>Welcome 👋 {authUser?.fullName} ❄</p>
				<p>Select a chat to start messaging</p>
				<TiMessages className='text-3xl md:text-6xl text-center' />
			</div>
		</div>
	);
};


