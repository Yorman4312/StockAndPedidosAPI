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

/**
 * Rutas para la gestión de usuarios.
 *
 * Endpoints disponibles:
 * - `POST /auth/register` → Registro de un nuevo usuario (no requiere autenticación).
 * - `GET /` → Obtiene todos los usuarios (requiere autenticación).
 * - `GET /:id` → Obtiene un usuario por su ID (requiere autenticación).
 * - `PUT /:id` → Actualiza un usuario existente por su ID (requiere autenticación).
 * - `DELETE /:id` → Elimina un usuario por su ID (requiere autenticación).
 *
 * @module userRoutes
 *
 * @example
 * // Registro en app.js o server.js
 * import userRoutes from "./presentation/routes/userRoutes.js";
 * app.use("/users", userRoutes);
 */
router.post("/auth/register", createUser);
router.get("/", authMiddleware, getUser);
router.get("/:id", authMiddleware, getUserById);
router.put("/:id", authMiddleware, updateUser);
router.delete("/:id", authMiddleware, deleteUser);

export default router;
