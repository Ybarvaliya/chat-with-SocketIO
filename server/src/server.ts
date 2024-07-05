import dotenv from "dotenv";
dotenv.config();

import express, { Express, Request, Response } from "express";
import cors from "cors";
import path from "path";
import cookieParser from "cookie-parser";

import authRoutes from "./routes/auth.routes";
// import messageRoutes from "./routes/message.routes.ts";
// import userRoutes from "./routes/user.routes.ts";

import connectToDB from "./connectToDB";
// import { app, server } from "./socket/socket.js";
// import { Server } from "socket.io";

const app: Express = express();


const corsOptions = {
  origin: "http://localhost:3000", // Change this to the URL of your frontend app
  credentials: true,
};

app.use(cors(corsOptions));
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const __dirname = path.resolve();

connectToDB();

app.use("/api/auth", authRoutes);
// app.use("/api/messages", messageRoutes);
// app.use("/api/users", userRoutes);

app.use(express.static(path.join(__dirname, "/frontend/dist")));

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "frontend", "dist", "index.html"));
});

const PORT: string | number = process.env.PORT || 3000;

// const io = new Server(server, {
//   cors: {
//     origin: "http://localhost:3000", // URL of your frontend app
//     methods: ["GET", "POST"],
//     credentials: true,
//   },
// });

// io.on("connection", (socket) => {
//   console.log("a user connected");
// });

app.listen(PORT, () => {
  console.log(`Server is running on PORT: ${PORT}`);
});
