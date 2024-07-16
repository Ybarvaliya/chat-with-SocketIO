import { useContext, useEffect } from "react";
import { SocketContext } from "../../context/SocketContext";
import notificationSound from "../../assets/sounds/notification.mp3";
import { ChatContext } from "../../context/ChatContext";

// Custom hook to listen for new messages
const useListenMessages = () => {
    
    const { socket } = useContext(SocketContext);
    const { messages, setMessages } = useContext(ChatContext)!;

    // useEffect hook to set up and clean up the socket event listener
    useEffect(() => {

        const SocketFun = () => {
            
            socket?.on("newMessage", (newMessage) => {

                const sound = new Audio(notificationSound);
                sound.play();

                // Update the messages state with the new message
                setMessages([...messages, newMessage]);
            });

            // Clean up the event listener when the component unmounts or dependencies change
            return () => socket?.off("newMessage");
        }

        SocketFun();
    }, [socket, setMessages, messages]); 
};

export default useListenMessages;
