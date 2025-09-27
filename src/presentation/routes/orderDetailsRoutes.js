import { Router } from "express";

import {
  createOrderDetails,
  getOrderDetails,
  getOrderDetailsById,
  updateOrderDetails,
  deleteOrderDetails
} from "../controllers/OrderDetailsController.js";

import { authMiddleware } from "../middlewares/authMiddleware.js";

const router = Router();
router.post("/", createOrderDetails);
router.get("/", authMiddleware, getOrderDetails);
router.get("/:id", getOrderDetailsById);
router.put("/:id", authMiddleware, updateOrderDetails);
router.delete("/:id", deleteOrderDetails);

export default router;