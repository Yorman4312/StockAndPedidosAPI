import { Router } from "express";

import {
  createOrder,
  getOrder,
  getOrderById,
  updateOrder,
  deleteOrder
} from "../controllers/OrderController.js";

import { authMiddleware } from "../middlewares/authMiddleware.js";

const router = Router();
router.post("/", createOrder);
router.get("/", authMiddleware, getOrder);
router.get("/:id", getOrderById);
router.put("/:id", authMiddleware, updateOrder);
router.delete("/:id", deleteOrder);

export default router;