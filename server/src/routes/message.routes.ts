import express from "express";
import { allMessages, sendMessage } from "../controllers/message.controller";
const router = express.Router();

router.route("/:chatId").get(allMessages);
router.route("/send/:recieverId").post(sendMessage);

export default router;