import express from "express";
import { signup } from "../controllers/auth.controller.js";
import { login, google } from "../controllers/auth.controller.js";

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.post("/google", google);

export default router;
