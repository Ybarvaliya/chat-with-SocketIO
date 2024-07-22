import mongoose, { Document, Schema, Types } from "mongoose";
import { IUser } from "./user.model";
import { IMessage } from "./message.model";

// Interface for Chat
interface IChat extends Document {
  chatName?: string;
  isGroupChat?: boolean;
  users: Types.ObjectId[];
  messages?: Types.ObjectId[];
  groupAdmin?: Types.ObjectId | IUser;
  createdAt?: Date;
  updatedAt?: Date;
}

// Schema for Chat
const chatSchema: Schema = new Schema<IChat>(
  {
    chatName: {
      type: String,
      trim: true,
    },
    isGroupChat: {
      type: Boolean,
      default: false,
    },
    users: [
      {
        type: Types.ObjectId,
        ref: "User",
        default: [],
      },
    ],
    messages: [
			{
				type: Types.ObjectId,
				ref: "Message",
				default: [],
			},
		],
    groupAdmin: {
      type: Types.ObjectId,
      ref: "User",
    },
		
  },
  { timestamps: true }
);

// Model for Chat
const Chat = mongoose.model<IChat>("Chat", chatSchema);

export default Chat;
export { IChat };
