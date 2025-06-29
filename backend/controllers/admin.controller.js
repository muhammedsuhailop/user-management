import User from "../models/user.model.js";
import { errorHandler } from "../utils/error.js";
import bcryptjs from "bcryptjs";

export const dashboard = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const searchTerm = req.query.search || "";

    const skip = (page - 1) * limit;

    const query = {};
    if (searchTerm) {
      query.$or = [
        { username: { $regex: searchTerm, $options: "i" } },
        { email: { $regex: searchTerm, $options: "i" } },
      ];
    }

    const users = await User.find(query)
      .select("-password")
      .skip(skip)
      .limit(limit);

    const totalUsers = await User.countDocuments(query);

    const totalPages = Math.ceil(totalUsers / limit);

    res.status(200).json({
      users,
      currentPage: page,
      totalPages,
      totalUsers,
      limit,
    });
  } catch (error) {
    next(error);
  }
};

export const createNewUser = async (req, res, next) => {
  const { username, email, password, isAdmin, profilePicture } = req.body;

  if (!username || !email || !password) {
    return next(
      errorHandler(400, "Username, email, and password are required.")
    );
  }

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return next(errorHandler(409, "User with this email already exists."));
    }

    const hashedPassword = bcryptjs.hashSync(password, 10);

    const newUser = new User({
      username,
      email,
      password: hashedPassword,
      isAdmin: isAdmin || false,
      profilePicture:
        profilePicture ||
        "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png",
    });

    await newUser.save();

    const { password: pw, ...rest } = newUser._doc;
    res.status(201).json(rest);
  } catch (error) {
    next(error);
  }
};

export const editUserAdmin = async (req, res, next) => {
  if (req.user.id === req.params.id) {
    return next(
      errorHandler(
        403,
        "Forbidden: Admins cannot modify their own user data using this portal."
      )
    );
  }

  try {
    const updateData = { ...req.body };

    if (updateData.password) {
      updateData.password = bcryptjs.hashSync(updateData.password, 10);
    } else {
      delete updateData.password;
    }

    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      { $set: updateData },
      { new: true, runValidators: true }
    ).select("-password");

    if (!updatedUser) {
      return next(errorHandler(404, "User not found."));
    }

    res.status(200).json(updatedUser);
  } catch (error) {
    if (error.code === 11000) {
      const field = Object.keys(error.keyValue)[0];
      const value = error.keyValue[field];

      return next(
        errorHandler(400, `The ${field} "${value}" is already taken.`)
      );
    }
    next(error);
  }
};

export const deleteUser = async (req, res, next) => {
  try {
    if (req.user.id === req.params.id) {
      return next(
        errorHandler(403, "Forbidden: Admins cannot delete their own account.")
      );
    }

    const deletedUser = await User.findByIdAndDelete(req.params.id);

    if (!deletedUser) {
      return next(errorHandler(404, "User not found."));
    }

    res.status(200).json({ message: "User deleted successfully." });
  } catch (error) {
    next(error);
  }
};
