import { timeStamp } from "console";
import mongoose from "mongoose";
import { type } from "os";

const userSchema = mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      // unique: true,
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
    profilePicture: {
      type: String,
      default:
        "https://img.freepik.com/premium-vector/user-profile-icon-flat-style-member-avatar-vector-illustration-isolated-background-human-permission-sign-business-concept_157943-15752.jpg?semt=ais_hybrid&w=740",
    },
  },
  { timeStamps: true }
);

const User = mongoose.model("User", userSchema);
export default User;
