/**
 * ORDERREPOSITORYMONGO.JS - REPOSITORIO MONGO
 * ============================================
 * 
 * Implementa el repositorio para gestionar órdenes
 * en MongoDB utilizando el modelo de Mongoose `OrderModel`.
 * 
 * FUNCIONALIDADES PRINCIPALES:
 * - Crear una orden
 * - Consultar todas las órdenes
 * - Consultar orden por ID
 * - Actualizar orden por ID
 * - Eliminar orden por ID
 * 
 * CASOS DE USO TÍPICOS:
 * - Registrar una nueva compra asociada a un usuario
 * - Consultar todas las órdenes del sistema
 * - Modificar estado de la orden (ej: pendiente, pagada, cancelada)
 * - Eliminar una orden si no fue procesada
 * 
 * PATRÓN:
 * - Repository Pattern: Desacopla la lógica de negocio
 *   de la persistencia en la base de datos.
 */

import { OrderModel } from "../db/OrderModel.js";

class OrderRepositoryMongo {
  /**
   * CREA UNA ORDEN
   * @param {Object} orderData - Datos de la orden
   * @returns {Promise<Object>} Documento creado en MongoDB
   */
  async create(orderData) {
    const order = new OrderModel(orderData);
    return await order.save();
  }

  /**
   * OBTIENE TODAS LAS ÓRDENES
   * @returns {Promise<Array>} Lista de todas las órdenes
   */
  async findAll() {
    return await OrderModel.find();
  }

  /**
   * OBTIENE UNA ORDEN POR ID
   * @param {String} id - ID de la orden
   * @returns {Promise<Object|null>} Documento encontrado o null
   */
  async findById(id) {
    return await OrderModel.findById(id);
  }

  /**
   * ACTUALIZA UNA ORDEN POR ID
   * @param {String} id - ID de la orden
   * @param {Object} orderData - Datos a actualizar
   * @returns {Promise<Object|null>} Documento actualizado o null
   */
  async update(id, orderData) {
    return await OrderModel.findByIdAndUpdate(id, orderData, { new: true });
  }

  /**
   * ELIMINA UNA ORDEN POR ID
   * @param {String} id - ID de la orden
   * @returns {Promise<Object|null>} Documento eliminado o null
   */
  async delete(id) {
    return await OrderModel.findByIdAndDelete(id);
  }
}

export default OrderRepositoryMongo;
