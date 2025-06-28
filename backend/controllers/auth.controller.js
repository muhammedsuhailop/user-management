import User from "../models/user.model.js";
import bcryptjs from "bcryptjs";
import { errorHandler } from "../utils/error.js";
import jwt from "jsonwebtoken";

export const signup = async (req, res, next) => {
  const { username, email, password } = req.body;
  const hashedPassword = bcryptjs.hashSync(password, 10);
  const newUser = User({ username, email, password: hashedPassword });
  try {
    await newUser.save();
    res.status(201).json({ message: "User created successfully" });
  } catch (error) {
    // Duplicate Key
    if (error.code === 11000) {
      const duplicateField = Object.keys(error.keyPattern)[0];
      const message = `${duplicateField} already exists`;
      return next(errorHandler(409, message));
    }
    next(error);
  }
};

export const login = async (req, res, next) => {
  const { email, password } = req.body;
  try {
    const validUser = await User.findOne({ email });
    if (!validUser) return next(errorHandler(404, "User not found"));
    const validPassword = bcryptjs.compareSync(password, validUser.password);
    if (!validPassword) return next(errorHandler(401, "Wrong Credentials"));
    const token = jwt.sign({ id: validUser._id }, process.env.JWT_SECRET);
    res
      .cookie("access_token", token, { httpOnly: true, maxAge: 60 * 60 * 1000 })
      .status(200)
      .json({
        id: validUser._id,
        username: validUser.username,
        email: validUser.email,
        message: "Login successful",
      });
  } catch (error) {
    next(error);
  }
};

export const google = async (req, res, next) => {
  try {
    const user = await User.findOne({ email: req.body.email });

    if (user) {
      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
        expiresIn: "1h",
      });

      const { password, ...rest } = user._doc;

      return res
        .cookie("access_token", token, { httpOnly: true, maxAge: 3600000 })
        .status(200)
        .json(rest);
    } else {
      const genPassword = Math.random().toString(36).slice(-8);
      const hashedPassword = bcryptjs.hashSync(genPassword, 10);

      const newUser = new User({
        username: req.body.name,
        email: req.body.email,
        password: hashedPassword,
        profilePicture: req.body.photo,
      });

      const savedUser = await newUser.save();

      const token = jwt.sign({ id: savedUser._id }, process.env.JWT_SECRET, {
        expiresIn: "1h",
      });

      const { password, ...rest } = savedUser._doc;

      return res
        .cookie("access_token", token, { httpOnly: true, maxAge: 3600000 })
        .status(200)
        .json(rest);
    }
  } catch (error) {
    next(error);
  }
};
