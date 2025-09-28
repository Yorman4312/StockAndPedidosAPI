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

/**
 * Rutas para la gestión de órdenes.
 *
 * Todas las rutas están protegidas con autenticación JWT mediante `authMiddleware`.
 * 
 * Endpoints disponibles:
 * - `POST /` → Crea una nueva orden.
 * - `GET /` → Obtiene todas las órdenes.
 * - `GET /:id` → Obtiene una orden por su ID.
 * - `PUT /:id/cancel` → Cancela una orden existente por su ID.
 * - `DELETE /:id` → Elimina una orden por su ID.
 *
 * @module orderRoutes
 *
 * @example
 * // Registro en app.js o server.js
 * import orderRoutes from "./presentation/routes/orderRoutes.js";
 * app.use("/orders", orderRoutes);
 */
router.post("/", authMiddleware, createOrder);
router.get("/", authMiddleware, getOrder);
router.get("/:id", authMiddleware, getOrderById);
router.put("/:id/cancel", authMiddleware, updateOrder);
router.delete("/:id", authMiddleware, deleteOrder);

export default router;
