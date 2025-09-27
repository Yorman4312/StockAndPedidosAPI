import { Router } from "express";

import {
  createProduct,
  getProduct,
  getProductById,
  updateProduct,
  deleteProduct
} from "../controllers/ProductController.js";

import { authMiddleware } from "../middlewares/authMiddleware.js";

const router = Router();
router.post("/", createProduct);
router.get("/", authMiddleware, getProduct);
router.get("/:id", getProductById);
router.put("/:id", authMiddleware, updateProduct);
router.delete("/:id", deleteProduct);

export default router;