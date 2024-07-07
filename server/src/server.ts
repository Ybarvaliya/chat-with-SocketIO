import dotenv from "dotenv";
dotenv.config();

import express, { Express } from "express";
import cors from "cors";
import path from "path";
import cookieParser from "cookie-parser";

import authRoutes from "./routes/auth.routes";
import userRoutes from "./routes/user.routes";
import messageRoutes from "./routes/message.routes";

import connectToDB from "./connectToDB";
import { IUser } from "./models/user.model";

// Below code will make sure that TS knows about User in the Request Object for the protectRoute

declare module "express-serve-static-core" {
  interface Request {
    user?: IUser;
  }
}

const app: Express = express();

const corsOptions = {
  origin: "http://localhost:3000", // Change this to the URL of your frontend app
  credentials: true,
};

app.use(cors(corsOptions));
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

connectToDB();

app.use("/auth", authRoutes);
app.use("/users", userRoutes);
app.use("/messages", messageRoutes);

app.use(express.static(path.join(__dirname, "/frontend/dist")));

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "frontend", "dist", "index.html"));
});

const PORT: string | number = process.env.PORT || 5555;
app.listen(PORT, () => {
  console.log(`Server is running on PORT: ${PORT}`);
});
