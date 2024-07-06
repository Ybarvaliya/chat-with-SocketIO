import User from "../models/user.model";
import { Request, Response } from "express";

export const getUsersForSidebar = async (req: Request, res: Response) => {
  try {
    const loggedInUserId = (req as Request & { user: { _id: string } }).user._id;
    const filteredUsers = await User.find({
      _id: { $ne: loggedInUserId },
    }).select("-password");

    res.status(200).json(filteredUsers);
  } catch (error) {
    if (error instanceof Error)
      console.error("Error in getUsersForSidebar: ", error.message);
    else console.log("Unknown Error in getUsersForSidebar");

    res.status(500).json({ error: "Internal server error" });
  }
};
