import Message, {IMessage} from "../models/message.model";
import Chat from "../models/chat.model";
import { Request, Response } from "express";
import { getReceiverSocketId, io } from "../socket/socket";
import { Types } from "mongoose";

const sendMessage = async (req: Request, res: Response) => {
  try {
    const message  = req.body.msg;
    const receiverId  = req.params.recieverId;
    const sId = req.user?._id as Types.ObjectId;
    const senderId = sId.toString();
    
    console.log(message, receiverId, senderId);

    const newMessage = await Message.create({
      sender: senderId,
      receiver: receiverId,
      message,
    });

    let chat = await Chat.findOne({
      users: { $all: [senderId, receiverId] },
    });
    
    if (chat) {
      chat.messages?.push(newMessage._id);
    }
    else{
      chat = await Chat.create({
        users: [senderId, receiverId],
        messages: [newMessage]
      });
    }
    
    // this will run in parallel
    await Promise.all([chat.save(), newMessage.save()]);

    const receiverSocketId = getReceiverSocketId(receiverId);
    console.log(receiverSocketId)
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("newMessage", newMessage);
    }

    res.status(201).json(newMessage);
  } catch (error) {
    if (error instanceof Error)
      console.log("Error in sendMessage controller: ", error.message);
    else console.log("Error in sendMessage controller");
    res.status(500).json({ error: "Internal server error" });
  }

};

const getMessages = async (req: Request, res: Response) => {
	try {
		const recieverId = req.params.recieverId;
		const senderId = req.user?._id;

		const chat = await Chat.findOne({
			users: { $all: [senderId, recieverId] },
		}).populate("messages"); // NOT REFERENCE BUT ACTUAL MESSAGES

		if (!chat) return res.status(200).json([]);
		const messages = chat.messages;

		res.status(200).json(messages);
	} catch (error) {
    if (error instanceof Error)
      console.log("Error in getMessage controller: ", error.message);
    else console.log("Error in getMessage controller");
		res.status(500).json({ error: "Internal server error" });
	}
};


export { getMessages, sendMessage };
