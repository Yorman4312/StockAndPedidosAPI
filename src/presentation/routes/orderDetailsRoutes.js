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

/**
 * Rutas para la gestión de los detalles de las órdenes.
 *
 * Todas las rutas están protegidas con autenticación JWT mediante `authMiddleware`.
 * 
 * Endpoints disponibles:
 * - `POST /` → Crea un nuevo detalle de orden.
 * - `GET /` → Obtiene todos los detalles de órdenes.
 * - `GET /:id` → Obtiene un detalle de orden por su ID.
 * - `PUT /:id` → Actualiza un detalle de orden existente por su ID.
 * - `DELETE /:id` → Elimina un detalle de orden por su ID.
 *
 * @module orderDetailsRoutes
 *
 * @example
 * // Registro en app.js o server.js
 * import orderDetailsRoutes from "./presentation/routes/orderDetailsRoutes.js";
 * app.use("/order-details", orderDetailsRoutes);
 */
router.post("/", authMiddleware, createOrderDetails);
router.get("/", authMiddleware, getOrderDetails);
router.get("/:id", authMiddleware, getOrderDetailsById);
router.put("/:id", authMiddleware, updateOrderDetails);
router.delete("/:id", authMiddleware, deleteOrderDetails);

export default router;
