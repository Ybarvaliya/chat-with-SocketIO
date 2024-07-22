import express from "express";
import { getMessages, sendMessage } from "../controllers/message.controller";
const router = express.Router();

router.route("/:recieverId").get(getMessages);
router.route("/send/:recieverId").post(sendMessage);

export default router;