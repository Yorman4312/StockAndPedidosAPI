/**
 * USERREPOSITORYMONGO.JS - REPOSITORIO MONGO
 * ==========================================
 *
 * Implementa el repositorio para gestionar usuarios
 * en MongoDB utilizando el modelo de Mongoose `UserModel`.
 *
 * FUNCIONALIDADES PRINCIPALES:
 * ----------------------------
 * - Crear usuario
 * - Consultar todos los usuarios
 * - Consultar usuario por ID
 * - Actualizar usuario
 * - Eliminar usuario
 * - Buscar usuario por email (autenticación / validaciones)
 *
 * CASOS DE USO TÍPICOS:
 * ---------------------
 * - Registrar un nuevo usuario en la aplicación
 * - Listar todos los usuarios
 * - Consultar la información de un usuario específico
 * - Actualizar datos de perfil o credenciales
 * - Eliminar usuario
 * - Buscar usuario por correo electrónico para login o validaciones
 *
 * PATRÓN UTILIZADO:
 * -----------------
 * - Repository Pattern: Desacopla la lógica de negocio
 *   del acceso a datos en MongoDB.
 */

import { UserModel } from "../db/UserModel.js";

class UserRepositoryMongo {
  /**
   * CREA UN USUARIO
   * @param {Object} userData - Datos del usuario
   * @returns {Promise<Object>} Usuario creado en MongoDB
   */
  async create(userData) {
    const user = new UserModel(userData);
    return await user.save();
  }

  /**
   * OBTIENE TODOS LOS USUARIOS
   * @returns {Promise<Array>} Lista de usuarios
   */
  async findAll() {
    return await UserModel.find();
  }

  /**
   * OBTIENE UN USUARIO POR ID
   * @param {String} id - ID del usuario
   * @returns {Promise<Object|null>} Usuario encontrado o null
   */
  async findById(id) {
    return await UserModel.findById(id);
  }

  /**
   * ACTUALIZA UN USUARIO POR ID
   * @param {String} id - ID del usuario
   * @param {Object} userData - Datos a actualizar
   * @returns {Promise<Object|null>} Usuario actualizado o null
   */
  async update(id, userData) {
    return await UserModel.findByIdAndUpdate(id, userData, { new: true });
  }

  /**
   * ELIMINA UN USUARIO POR ID
   * @param {String} id - ID del usuario
   * @returns {Promise<Object|null>} Usuario eliminado o null
   */
  async delete(id) {
    return await UserModel.findByIdAndDelete(id);
  }

  /**
   * BUSCA UN USUARIO POR EMAIL
   * Útil para autenticación o validación de registros.
   * 
   * @param {String} email - Correo electrónico del usuario
   * @returns {Promise<Object|null>} Usuario encontrado o null
   */
  async findByUserEmail(email) {
    return await UserModel.findOne({ email: email });
  }
}

export default UserRepositoryMongo;