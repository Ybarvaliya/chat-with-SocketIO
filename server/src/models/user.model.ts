import { model, Document, Schema } from "mongoose";

// Define the IUser type
export interface IUser extends Document {
  fullName: string;
  username: string;
  password: string;
  gender: "male" | "female";
  profilePic?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

const userSchema = new Schema<IUser>(
  {
    fullName: {
      type: String,
      required: true,
    },
    username: {
      type: String,
      required: [true, "Please Provide a Username"],
      unique: true,
    },
    password: {
      type: String,
      required: [true, "Please Provide Password"],
      minlength: 6,
    },
    gender: {
      type: String,
      required: true,
      enum: ["male", "female"],
    },
    profilePic: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);

const  User = model<IUser>("User", userSchema);

export default User;
