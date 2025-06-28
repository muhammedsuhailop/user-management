import express from "express";
import { logout, test, updateUser } from "../controllers/user.controller.js";
import { verifyToken } from "../utils/verifyUser.js";

const router = express.Router();

router.get("/", test);
router.put("/update/:id", verifyToken, updateUser);
router.post("/logout", logout);

export default router;
