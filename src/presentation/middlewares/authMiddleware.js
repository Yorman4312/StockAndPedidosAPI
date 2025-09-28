import TokenGenerator from "../../presentation/security/token_generator.js";

const tokenGenerator = new TokenGenerator(
  process.env.JWT_SECRET,
  process.env.JWT_EXPIRES_IN || "15m"
);

/**
 * Middleware de autenticación para proteger rutas privadas.
 *
 * Verifica la validez del token JWT enviado en el encabezado `Authorization`.
 * - Si no hay token, responde con `401 Unauthorized`.
 * - Si el token está expirado o es inválido, responde con `403 Forbidden`.
 * - Si el token es válido, añade la información del usuario a `req.user` y permite continuar.
 *
 * @function authMiddleware
 * @param {Object} req - Objeto de solicitud de Express.
 * @param {Object} res - Objeto de respuesta de Express.
 * @param {Function} next - Función para pasar al siguiente middleware o controlador.
 *
 * @example
 * // Proteger una ruta
 * import { authMiddleware } from "./middlewares/authMiddleware.js";
 *
 * app.get("/profile", authMiddleware, (req, res) => {
 *   res.json({ user: req.user });
 * });
 */
export function authMiddleware(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({ error: "Token requerido" });
  }

  const result = tokenGenerator.verify(token);

  if (!result.valid) {
    if (result.expired) {
      return res.status(403).json({ error: "Token expirado" });
    }
    return res.status(403).json({ error: "Token inválido" });
  }

  req.user = result.payload;
  next();
}
