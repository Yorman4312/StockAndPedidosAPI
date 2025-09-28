import jwt from "jsonwebtoken";

/**
 * Clase encargada de la generación y verificación de tokens JWT.
 *
 * Centraliza la lógica de autenticación basada en tokens
 * para proteger rutas y manejar sesiones seguras.
 *
 * @class TokenGenerator
 *
 * @example
 * // Crear instancia
 * const tokenGenerator = new TokenGenerator("miClaveSecreta", "1h");
 *
 * // Generar token
 * const token = tokenGenerator.generate({ id: "123", role: "admin" });
 *
 * // Verificar token
 * const result = tokenGenerator.verify(token);
 * if (result.valid) {
 *   console.log("Usuario válido:", result.payload);
 * } else if (result.expired) {
 *   console.log("El token ha expirado");
 * }
 */
export default class TokenGenerator {
  /**
   * @param {string} secret - Clave secreta para firmar y verificar los tokens.
   * @param {string} [expiresIn="10m"] - Tiempo de expiración del token (ej: `"15m"`, `"1h"`, `"7d"`).
   */
  constructor(secret, expiresIn = process.env.JWT_EXPIRES_IN || "15m") {
    this.secret = secret;
    this.expiresIn = expiresIn;
  }

  /**
   * Genera un token JWT firmado.
   *
   * @param {Object} payload - Información a incluir en el token (ej: `{ id, role }`).
   * @returns {string} - Token JWT firmado.
   */
  generate(payload) {
    return jwt.sign(payload, this.secret, { expiresIn: this.expiresIn });
  }

  /**
   * Verifica la validez de un token JWT.
   *
   * @param {string} token - Token JWT a verificar.
   * @returns {{ valid: boolean, expired: boolean, payload: Object|null }}
   * - `valid`: indica si el token es válido.
   * - `expired`: indica si el token ha expirado.
   * - `payload`: datos decodificados si el token es válido.
   */
  verify(token) {
    try {
      const decoded = jwt.verify(token, this.secret);
      return { valid: true, expired: false, payload: decoded };
    } catch (err) {
      if (err.name === "TokenExpiredError") {
        return { valid: false, expired: true, payload: null };
      }
      return { valid: false, expired: false, payload: null };
    }
  }
}
