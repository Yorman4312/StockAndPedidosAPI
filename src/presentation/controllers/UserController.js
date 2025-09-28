/**
 * Controlador para manejar operaciones sobre usuarios.
 *
 * Este controlador conecta la capa de presentación con los casos de uso de aplicación,
 * gestionando la creación, consulta, actualización y eliminación de usuarios.
 */

import CreateUser from "../../application/use-cases/user/CreateUser.js";
import GetUser from "../../application/use-cases/user/GetUser.js";
import GetUserById from "../../application/use-cases/user/GetUserById.js";
import UpdateUser from "../../application/use-cases/user/UpdateUser.js";
import DeleteUser from "../../application/use-cases/user/DeleteUser.js";

import PasswordEncrypter from "../../presentation/security/password_encrypter.js";
import UserRepositoryMongo from "../../infrastructure/repositories/UserRepositoryMongo.js";

// Instancias de dependencias
const userRepository = new UserRepositoryMongo();
const passwordEncrypter = new PasswordEncrypter();

/**
 * Crea un nuevo usuario.
 *
 * @route POST /users
 * @param {Object} req - Objeto de solicitud con los datos del usuario en el body.
 * @param {Object} res - Objeto de respuesta con el usuario creado.
 */
export const createUser = async (req, res) => {
  try {
    const createUser = new CreateUser(userRepository, passwordEncrypter);
    const user = await createUser.execute(req.body);
    res.status(201).json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/**
 * Obtiene todos los usuarios registrados.
 *
 * @route GET /users
 * @param {Object} req - Objeto de solicitud.
 * @param {Object} res - Objeto de respuesta con la lista de usuarios.
 */
export const getUser = async (req, res) => {
  try {
    const getUser = new GetUser(userRepository);
    const user = await getUser.execute();
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/**
 * Obtiene un usuario por su ID.
 *
 * @route GET /users/:id
 * @param {Object} req - Objeto de solicitud con el ID en los parámetros.
 * @param {Object} res - Objeto de respuesta con el usuario encontrado o error 404.
 */
export const getUserById = async (req, res) => {
  try {
    const getUserById = new GetUserById(userRepository);
    const user = await getUserById.execute(req.params.id);
    if (!user) return res.status(404).json({ message: "Usuario no encontrado" });
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/**
 * Actualiza un usuario por su ID.
 *
 * @route PUT /users/:id
 * @param {Object} req - Objeto de solicitud con el ID en los parámetros y los datos en el body.
 * @param {Object} res - Objeto de respuesta con el usuario actualizado o error 404.
 */
export const updateUser = async (req, res) => {
  try {
    const updateUser = new UpdateUser(userRepository);
    const user = await updateUser.execute(req.params.id, req.body);
    if (!user) return res.status(404).json({ message: "Usuario no encontrado" });
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/**
 * Elimina un usuario por su ID.
 *
 * @route DELETE /users/:id
 * @param {Object} req - Objeto de solicitud con el ID en los parámetros.
 * @param {Object} res - Objeto de respuesta con mensaje de confirmación o error 404.
 */
export const deleteUser = async (req, res) => {
  try {
    const deleteUser = new DeleteUser(userRepository);
    const result = await deleteUser.execute(req.params.id);
    if (!result) return res.status(404).json({ message: "Usuario no encontrado" });
    res.json({ message: "✅ Usuario eliminado correctamente ✅" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
