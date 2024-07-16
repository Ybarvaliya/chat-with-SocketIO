import Message from "../models/message.model";
import User from "../models/user.model";
import Chat from "../models/chat.model";
import { Request, Response } from "express";
import { getReceiverSocketId, io } from "../socket/socket";

const sendMessage = async (req: Request, res: Response) => {
  const { message } = req.body;
  const chatId = req.params.chatId;

  if (!message || !chatId) {
    console.log("Invalid data passed into request");

    return res
      .status(400)
      .json({ error: "Please Provide All Fields To send Message" });
  }

  var newMessage = {
    sender: req.user?._id,
    message: message,
    chat: chatId,
  };

  try {
    let m = await Message.create(newMessage);

    m = await m.populate("sender", "name");
    m = await m.populate("chat");
    const populatedM = await User.populate(m, {
      path: "chat.users",
      select: "name email _id",
    });

    await Chat.findByIdAndUpdate(
      chatId,
      { latestMessage: populatedM },
      { new: true }
    );

    const { recieverId } = req.params;
    const receiverSocketId = getReceiverSocketId(recieverId);
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("newMessage", newMessage);
    }

    res.status(200).json(m);
  } catch (error) {
    if (error instanceof Error) console.error(error.message);
    res
      .status(400)
      .json({ Error: "Error in Message Contoller - Send Message" });
  }
};

const allMessages = async (req: Request, res: Response) => {
  try {
    const { chatId } = req.params;

    const getMessage = await Message.find({ chat: chatId })
      .populate("sender", "name email _id")
      .populate("chat");

    res.status(200).json(getMessage);
  } catch (error) {
    if (error instanceof Error) console.error(error.message);
    res
      .status(400)
      .json({ Error: "Error in Message Contoller - All Messages" });
  }
};

export { allMessages, sendMessage };
