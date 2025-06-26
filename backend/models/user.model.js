import { timeStamp } from "console";
import mongoose from "mongoose";
import { type } from "os";

const userSchema = mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    isAdmin: {
      type: Boolean,
      default: false,
    },
    password: {
      type: String,
      required: true,
    },
  },
  { timeStamps: true }
);

const User = mongoose.model("User", userSchema);
export default User;
