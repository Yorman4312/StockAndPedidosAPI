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

/**
 * Rutas para la gestión de productos.
 *
 * Todas las rutas requieren autenticación con JWT mediante `authMiddleware`.
 *
 * Endpoints disponibles:
 * - `POST /` → Crea un nuevo producto.
 * - `GET /` → Obtiene todos los productos.
 * - `GET /:id` → Obtiene un producto por su ID.
 * - `PUT /:id` → Actualiza un producto existente por su ID.
 * - `DELETE /:id` → Elimina un producto por su ID.
 *
 * @module productRoutes
 *
 * @example
 * // Registro en app.js o server.js
 * import productRoutes from "./presentation/routes/productRoutes.js";
 * app.use("/products", productRoutes);
 */
router.post("/", authMiddleware, createProduct);
router.get("/", authMiddleware, getProduct);
router.get("/:id", authMiddleware, getProductById);
router.put("/:id", authMiddleware, updateProduct);
router.delete("/:id", authMiddleware, deleteProduct);

export default router;
