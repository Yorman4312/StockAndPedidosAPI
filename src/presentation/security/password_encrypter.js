import bcrypt from "bcryptjs";

/**
 * Clase encargada de manejar el cifrado y la verificación de contraseñas
 * utilizando la librería `bcryptjs`.
 *
 * Esta clase abstrae la lógica de encriptación de contraseñas
 * para mantener la seguridad centralizada y facilitar la reutilización.
 *
 * @class PasswordEncrypter
 *
 * @example
 * // Crear instancia
 * const encrypter = new PasswordEncrypter();
 *
 * // Hashear contraseña
 * const hashed = await encrypter.hashPassword("miPassword123");
 *
 * // Comparar contraseñas
 * const isMatch = await encrypter.comparePassword("miPassword123", hashed);
 */
export default class PasswordEncrypter {
  constructor() {
    /**
     * Número de rondas de "salting" usadas por bcrypt.
     * Mientras más alto el valor, más seguro pero más lento el proceso.
     * @type {number}
     */
    this.saltRounds = 10;
  }

  /**
   * Genera un hash seguro de la contraseña.
   *
   * @async
   * @param {string} password - Contraseña en texto plano.
   * @returns {Promise<string>} - Contraseña hasheada.
   */
  async hashPassword(password) {
    return await bcrypt.hash(password, this.saltRounds);
  }

  /**
   * Compara una contraseña en texto plano con su versión hasheada.
   *
   * @async
   * @param {string} password - Contraseña ingresada por el usuario.
   * @param {string} hashedPassword - Contraseña previamente hasheada almacenada en BD.
   * @returns {Promise<boolean>} - Retorna `true` si coinciden, `false` en caso contrario.
   */
  async comparePassword(password, hashedPassword) {
    return await bcrypt.compare(password, hashedPassword);
  }
}
