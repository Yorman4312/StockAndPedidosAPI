/**
 * LOGINUSER.JS - CASO DE USO PARA INICIO DE SESIÓN DE USUARIOS
 * =============================================================
 * 
 * Este caso de uso maneja la autenticación de un usuario mediante
 * email y contraseña, verificando credenciales y generando un token
 * de acceso (JWT) para sesiones seguras.
 * 
 * Funcionalidades:
 * - Validación de credenciales (email y contraseña)
 * - Comparación de contraseñas encriptadas con bcrypt (u otro encrypter)
 * - Generación de un token JWT seguro
 * - Retorno de la información del usuario (sin password)
 * 
 * CASOS DE USO TÍPICOS:
 * - Inicio de sesión en el sistema
 * - Generación de token para acceder a rutas protegidas
 * - Autenticación en panel administrativo
 * 
 * INFORMACIÓN RETORNADA:
 * - token: JWT con id y email del usuario
 * - user: Objeto con información básica del usuario
 *   (excluye password y campos internos como __v)
 * 
 * 🔐 CONSIDERACIONES DE SEGURIDAD:
 * - Nunca retornar contraseñas (ni siquiera encriptadas)
 * - El token debe tener expiración y estar firmado con secret seguro
 * - Implementar bloqueo tras múltiples intentos fallidos de login
 * - Almacenar el token en cliente de manera segura (HTTPOnly Cookie o Secure Storage)
 * 
 * Patrón de diseño: Clean Architecture / Use Case Pattern
 * Principio SOLID: Single Responsibility Principle
 */

export default class LoginUser {
  /**
   * Constructor de la clase LoginUser
   * @param {Object} userRepository - Repositorio para acceder a los datos de usuarios
   * @param {Object} passwordEncrypter - Servicio para comparar contraseñas encriptadas
   * @param {Object} tokenGenerator - Servicio para generar tokens JWT
   */
  constructor(userRepository, passwordEncrypter, tokenGenerator) {
    this.userRepository = userRepository;
    this.passwordEncrypter = passwordEncrypter;
    this.tokenGenerator = tokenGenerator;
  }

  /**
   * Ejecuta el proceso de login de un usuario
   * @param {Object} params - Parámetros del login
   * @param {string} params.email - Correo electrónico del usuario
   * @param {string} params.password - Contraseña ingresada por el usuario
   * @returns {Promise<{token: string, user: Object}>} - Devuelve el token de acceso y los datos del usuario
   * @throws {Error} - Si el usuario no existe o la contraseña es incorrecta
   */
  async execute({ email, password }) {
    // Buscar usuario por email
    const user = await this.userRepository.findByUserEmail(email);
    if(!user) throw new Error("❌ Usuario no encontrado ❌");

    // Validar contraseña
    const isValid = await this.passwordEncrypter.comparePassword(password, user.password);
    if(!isValid) throw new Error("❌ Contrasena incorrecta ❌");

    // Generar token JWT
    const token = this.tokenGenerator.generate({ id: user.id, email: user.email });

    // Excluir password y campo interno __v antes de retornar
    const { password: _, __v, ...userData } = user.toObject();

    return { token, user: userData };
  }
}
