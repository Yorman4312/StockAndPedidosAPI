import { Router } from "express";
import LoginController from "../controllers/loginController.js";

const router = Router();

/**
 * Rutas de autenticación para login.
 *
 * Define el endpoint principal de inicio de sesión:
 * - `POST /` → Realiza la autenticación del usuario con email y contraseña.
 * 
 * @module loginRoutes
 *
 * @example
 * // Registro de rutas en app.js o server.js
 * import loginRoutes from "./presentation/routes/loginRoutes.js";
 * app.use("/login", loginRoutes);
 */
router.post("/", (req, res) => LoginController.login(req, res));

export default router;
