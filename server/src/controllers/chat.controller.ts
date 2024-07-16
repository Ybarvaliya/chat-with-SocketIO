import Chat from "../models/chat.model";
import User from "../models/user.model";
import { Request, Response } from "express";

// Gets Whole Chat
const getChat = async (req: Request, res: Response) => {
  const { userId } = req.body;

  if (!userId) {
    return res.send("No User Exists!");
  }

  // Fetch the chat(s)
  const chats = await Chat.find({
    isGroupChat: false,
    $and: [
      { users: { $elemMatch: { $eq: req.user?.id } } },
      { users: { $elemMatch: { $eq: userId } } },
    ],
  })
    .populate("users", "-password")
    .populate("latestMessage")
    .exec();

  // Populate the sender field of the latestMessage
  const populatedChats = await User.populate(chats, {
    path: "latestMessage.sender",
    select: "name email _id",
  });

  if (populatedChats.length > 0) {
    res.send(populatedChats[0]);
  } else {
    const createChat = await Chat.create({
      chatName: "sender",
      isGroupChat: false,
      users: [req.user?._id, userId],
    });

    const fullChat = await Chat.findOne({ _id: createChat._id }).populate(
      "users",
      "-password"
    );

    res.status(201).json(fullChat);
  }
};

// Get all chats 
const getChats = async (req: Request, res: Response) => {
  // const chat = await Chat.find({ users: { $elemMatch: { $eq: req.user?.id } } })
  //   .populate("users", "-password")
  //   .populate("groupAdmin", "-password")
  //   .populate("latestMessage")
  //   .sort({ updatedAt: -1 });

  // const user = await User.populate(chat, {
  //   path: "latestMessage.sender",
  //   select: "name email _id",
  // });

  // res.status(201).json(user);

  const loggedInUserId = req.user?._id;
  const filteredUsers = await User.find({
    _id: { $ne: loggedInUserId },
  }).select("-password");

  res.status(200).json(filteredUsers);
};

// To create Group
const createGroup = async (req: Request, res: Response) => {
  if (!req.body.users || !req.body.name) {
    return res.status(400).send({ message: "Please Fill all the fields" });
  }

  var users = JSON.parse(req.body.users);

  if (users.length < 2) {
    return res
      .status(400)
      .send("More than 2 users are required to form a group chat");
  }

  users.push(req.user?.id);

  const groupChat = await Chat.create({
    chatName: req.body.name,
    users: users,
    isGroupChat: true,
    groupAdmin: req.user?.id,
  });

  const fullGroupChat = await Chat.findOne({ _id: groupChat._id })
    .populate("users", "-password")
    .populate("groupAdmin", "-password");

  res.status(200).json(fullGroupChat);
};

// Rename Group
const renameGroup = async (req: Request, res: Response) => {
  const { chatId, chatName } = req.body;

  const updateChat = await Chat.findByIdAndUpdate(
    chatId,
    {
      chatName: chatName,
    },
    {
      new: true,
    }
  )
    .populate("users", "-password")
    .populate("groupAdmin", "-password");

  if (!updateChat) {
    throw new Error("Chat Not Found");
  } else {
    res.json(updateChat);
  }
};

// Add user to Group
const addUserToGroup = async (req: Request, res: Response) => {
  const { chatId, userId } = req.body;

  const addUser = await Chat.findByIdAndUpdate(
    chatId,
    {
      $push: { users: userId },
    },
    {
      new: true,
    }
  )
    .populate("users", "-password")
    .populate("groupAdmin", "-password");

  if (!addUser) {
    throw new Error("Chat Not Found");
  } else {
    res.status(201).json(addUser);
  }
};

// Remove user from Group
const removeFromGroup = async (req: Request, res: Response) => {
  const { chatId, userId } = req.body;

  const removeUser = await Chat.findByIdAndUpdate(
    chatId,
    {
      $pull: { users: userId },
    },
    {
      new: true,
    }
  )
    .populate("users", "-password")
    .populate("groupAdmin", "-password");

  if (!removeUser) {
    throw new Error("Chat Not Found");
  } else {
    res.status(201).json(removeUser);
  }
};

export {
  getChat,
  getChats,
  createGroup,
  removeFromGroup,
  renameGroup,
  addUserToGroup,
};
