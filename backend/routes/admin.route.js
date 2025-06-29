import express from "express";
import {
  createNewUser,
  dashboard,
  editUserAdmin,
  deleteUser,
} from "../controllers/admin.controller.js";
import { verifyTokenAndAdmin } from "../utils/verifyTokenAndAdmin.js";

const router = express.Router();

router.get("/dashboard", verifyTokenAndAdmin, dashboard);
router.post("/add-user", verifyTokenAndAdmin, createNewUser);
router.put("/edit-user/:id", verifyTokenAndAdmin, editUserAdmin);
router.delete("/delete-user/:id", verifyTokenAndAdmin, deleteUser);

export default router;
