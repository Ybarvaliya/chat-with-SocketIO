import dotenv from "dotenv";
dotenv.config();

import express, {Request, Response} from "express";
import cors from "cors";
import path from "path";
import cookieParser from "cookie-parser";

import authRoutes from "./routes/auth.routes";
import chatRoutes from "./routes/chat.routes";
import messageRoutes from "./routes/message.routes";

import connectToDB from "./connectToDB";
import { IUser } from "./models/user.model";
import protectRoute from "./middleware/protectRoute";

import { app, server } from "./socket/socket";

// Below code will make sure that TS knows about User in the Request Object for the protectRoute

declare module "express-serve-static-core" {
  interface Request {
    user?: IUser;
  }
}

app.use(cors({
  origin: 'http://localhost:5173', 
  credentials: true,
}));

app.use(cookieParser(process.env.COOKIE_SECRET));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use("/auth", authRoutes);
app.use("/chat", protectRoute, chatRoutes);
app.use("/message", protectRoute, messageRoutes);

// app.use(express.static(path.join(__dirname, "/frontend/dist")));

// app.get("*", (req, res) => {
//   res.sendFile(path.join(__dirname, "frontend", "dist", "index.html"));
// });

const PORT: string | number = process.env.PORT || 5555;

server.listen(PORT, () => {
  connectToDB();
  console.log(`Server Running on port ${PORT}`);
});
