import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
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

app.listen(3000, () => {
  console.log("App running in PORT 3000");
});
