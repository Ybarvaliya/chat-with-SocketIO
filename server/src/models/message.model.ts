import { Document, Schema, Types, model } from "mongoose";
import { IUser } from "./user.model";
import { IChat } from "./chat.model";

// Interface for Message
interface IMessage extends Document {
  sender: Types.ObjectId | IUser;
  receiver: Types.ObjectId | IUser;
  message: string;
  _id: Types.ObjectId
  createdAt?: Date;
  updatedAt?: Date;
}

// Schema for Message
const messageSchema: Schema = new Schema<IMessage>(
  {
    sender: {
      type: Types.ObjectId,
      ref: "User",
      required: true,
    },
    receiver: {
			type: Types.ObjectId,
			ref: "User",
			required: true,
		},
    message: {
      type: String,
      required: true,
    },
    // chat: {
    //   type: Types.ObjectId,
    //   ref: "Chat",
    //   required: true,
    // },
  },
  { timestamps: true }
);

// Model for Message
const Message = model<IMessage>("Message", messageSchema);

export default Message;
export { IMessage };
