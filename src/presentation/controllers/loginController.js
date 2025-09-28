/**
 * LOGINCONTROLLER.JS - CONTROLADOR DE AUTENTICACIÓN
 * ==================================================
 *
 * Controlador encargado del proceso de **inicio de sesión** de usuarios.
 * Recibe la solicitud HTTP desde la capa de presentación, utiliza el caso
 * de uso `LoginUser` y retorna un token JWT junto con los datos del usuario.
 *
 * DEPENDENCIAS:
 * -------------
 * - LoginUser (Caso de uso): Lógica para validar credenciales y generar token.
 * - UserRepositoryMongo: Repositorio para acceder a los datos de usuario en MongoDB.
 * - PasswordEncrypter: Servicio para comparar contraseñas encriptadas.
 * - TokenGenerator: Servicio para generar tokens JWT.
 * - User (Entidad): Representación de usuario en el dominio.
 *
 * FLUJO:
 * ------
 * 1. El cliente envía un `email` y `password` en el body de la petición.
 * 2. El caso de uso `LoginUser` valida las credenciales:
 *    - Verifica que el usuario exista.
 *    - Comprueba que la contraseña sea correcta.
 *    - Genera un token JWT.
 * 3. El controlador devuelve un objeto con el `token` y los datos del usuario (sin contraseña).
 *
 * RESPUESTAS HTTP:
 * ----------------
 * - 200 (OK): Inicio de sesión exitoso → devuelve `{ token, user }`.
 * - 401 (Unauthorized): Credenciales incorrectas o usuario no encontrado → `{ error: mensaje }`.
 *
 * CASOS DE USO TÍPICOS:
 * ---------------------
 * - Autenticación de usuarios en la aplicación.
 * - Generación de token JWT para proteger rutas privadas.
 */

import LoginUser from "../../application/use-cases/user/LoginUser.js";
import UserRepository from "../../infrastructure/repositories/UserRepositoryMongo.js";
import PasswordEncrypter from "../security/password_encrypter.js";
import TokenGenerator from "../security/token_generator.js";
import UserModel from "../../domain/entities/User.js";

// Instancias de dependencias
const passwordEncrypter = new PasswordEncrypter();
const userRepository = new UserRepository(UserModel);
const tokenGenerator = new TokenGenerator(process.env.JWT_SECRET || "supersecretcode");

// Caso de uso LoginUser con dependencias inyectadas
const loginUser = new LoginUser(userRepository, passwordEncrypter, tokenGenerator);

export default class LoginController {
  /**
   * LOGIN DE USUARIO
   * ----------------
   * Endpoint: POST /login
   *
   * @param {Object} req - Objeto Request con { email, password }
   * @param {Object} res - Objeto Response para enviar la respuesta al cliente
   * @returns {JSON} token JWT + datos del usuario (sin contraseña)
   */
  static async login(req, res) {
    try {
      const { token, user } = await loginUser.execute(req.body);
      res.json({ token, user });
    } catch (err) {
      res.status(401).json({ error: err.message });
    }
  }
}
