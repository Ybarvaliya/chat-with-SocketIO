import jwt, { JwtPayload } from "jsonwebtoken";
import User, { IUser } from "../models/user.model";
import { NextFunction, Request, Response } from "express";

const protectRoute = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const token = req.cookies.jwt;
    if (!token)
      return res
        .status(401)
        .json({ error: "Unauthorized - No Token Provided" });

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET as string
    ) as JwtPayload;

    if (!decoded || !decoded.userId)
      return res.status(401).json({ error: "Unauthorized - Invalid Token" });

    const user: IUser | null = await User.findById(decoded.userId).select("-password");

    if (!user) return res.status(404).json({ error: "User not found" });

    req.user = user;
    next(); 
  } catch (error) {
    console.error("Error in protectRoute middleware:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export default protectRoute;
