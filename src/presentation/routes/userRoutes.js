import { Router } from "express";

import {
  createUser,
  getUser,
  getUserById,
  updateUser,
  deleteUser
} from "../controllers/UserController.js";

import { authMiddleware } from "../middlewares/authMiddleware.js";

const router = Router();
router.post("/", createUser);
router.get("/", authMiddleware, getUser);
router.get("/:id", authMiddleware, getUserById);
router.put("/:id", authMiddleware, updateUser);
router.delete("/:id", authMiddleware, deleteUser);

export default router;