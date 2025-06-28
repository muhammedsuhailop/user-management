import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import userRoute from "./routes/user.route.js";
import authRoute from "./routes/auth.route.js";
import cookieParser from 'cookie-parser';
dotenv.config();

mongoose
  .connect(process.env.MONGO)
  .then(() => {
    console.log("Connected DB");
  })
  .catch((err) => {
    console.error(err);
  });

const app = express();
app.use(express.json());
app.use(cookieParser())

app.listen(3000, () => {
  console.log("App running in PORT 3000");
});

app.use("/user", userRoute);
app.use("/auth", authRoute);

app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server Error";
  return res.status(statusCode).json({
    success: false,
    message,
    statusCode,
  });
});
