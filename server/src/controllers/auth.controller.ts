import bcrypt from "bcryptjs";
import User from "../models/user.model";
import { clearToken, generateTokenAndSetCookie } from "../utils/auth";

import { Request, Response } from "express";

export const signup = async (req: Request, res: Response) => {
  try {
    const { fullName, username, password, confirmPassword, gender } = req.body;

    if (password !== confirmPassword) {
      return res.status(400).json({ error: "Passwords don't match" });
    }

    const user = await User.findOne({ username });

    if (user) {
      return res.status(400).json({ error: "Username already exists" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // https://avatar-placeholder.iran.liara.run/

    const boyProfilePic = `https://avatar.iran.liara.run/public/boy?username=${username}`;
    const girlProfilePic = `https://avatar.iran.liara.run/public/girl?username=${username}`;

    const newUser = await User.create({
      fullName,
      username,
      password: hashedPassword,
      gender,
      profilePic: gender === "male" ? boyProfilePic : girlProfilePic,
    });

    if (newUser) {
      generateTokenAndSetCookie(newUser._id as string, res);

      res.status(201).json({
        _id: newUser._id,
        fullName: newUser.fullName,
        username: newUser.username,
        profilePic: newUser.profilePic,
      });
    } else {
      res.status(400).json({ error: "Invalid user data" });
    }
  } catch (error) {
    if (error instanceof Error)
      console.log("Error in signup controller", error.message);
    else console.log("Unknown Error: Error in signup controller");
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username });
    const isPasswordCorrect = await bcrypt.compare(
      password,
      user?.password || ""
    );

    if (!user || !isPasswordCorrect) {
      return res.status(400).json({ error: "Invalid username or password" });
    }

    generateTokenAndSetCookie(user._id as string, res);

    res.status(200).json({
      _id: user._id,
      fullName: user.fullName,
      username: user.username,
      profilePic: user.profilePic,
    });

  } catch (error) {
    if (error instanceof Error)
      console.log("Error in login controller", error.message);
    else console.log("Unknown Error: Error in login controller");
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const logout = (req: Request, res: Response) => {
  try {
    clearToken(res);
    res.status(200).json({ message: "Logged out successfully" });
  } catch (error) {
    if (error instanceof Error)
      console.log("Error in logout controller", error.message);
    else console.log("Unknown Error: Error in logout controller");
    res.status(500).json({ error: "Internal Server Error" });
  }
};
