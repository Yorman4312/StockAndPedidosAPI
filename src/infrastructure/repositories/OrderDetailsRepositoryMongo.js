/**
 * ORDERDETAILSREPOSITORYMONGO.JS - REPOSITORIO MONGO
 * ===================================================
 * 
 * Implementa el repositorio para gestionar los detalles de orden
 * en MongoDB utilizando el modelo de Mongoose `OrderDetailsModel`.
 * 
 * FUNCIONALIDADES PRINCIPALES:
 * - Crear un detalle de orden individual
 * - Crear múltiples detalles de orden en lote
 * - Buscar todos los detalles
 * - Buscar detalle por ID
 * - Buscar todos los detalles asociados a una orden específica
 * - Actualizar un detalle de orden por ID
 * - Eliminar un detalle de orden por ID
 * 
 * CASOS DE USO TÍPICOS:
 * - Registrar productos comprados en una orden
 * - Consultar todos los ítems asociados a una orden
 * - Actualizar cantidad o precio de un producto en una orden
 * - Eliminar un detalle de orden si un producto fue retirado
 * 
 * PATRÓN:
 * - Repository Pattern: Abstrae la capa de acceso a datos,
 *   desacoplando la lógica de negocio de la persistencia.
 */

import { OrderDetailsModel } from "../db/OrderDetailsModel.js";

class OrderDetailsRepositoryMongo {
  /**
   * CREA UN DETALLE DE ORDEN
   * @param {Object} orderDetailsData - Datos del detalle de orden
   * @returns {Promise<Object>} Documento creado en MongoDB
   */
  async create(orderDetailsData) {
    const orderDetails = new OrderDetailsModel(orderDetailsData);
    return await orderDetails.save();
  }

  /**
   * CREA VARIOS DETALLES DE ORDEN EN LOTE
   * @param {Array<Object>} detailsArray - Lista de detalles de orden
   * @returns {Promise<Array>} Documentos creados en MongoDB
   */
  async createMany(detailsArray) {
    return await OrderDetailsModel.insertMany(detailsArray);
  }

  /**
   * OBTIENE TODOS LOS DETALLES DE ORDEN
   * @returns {Promise<Array>} Lista de todos los detalles de orden
   */
  async findAll() {
    return await OrderDetailsModel.find();
  }

  /**
   * OBTIENE DETALLE DE ORDEN POR ID
   * @param {String} id - ID del detalle
   * @returns {Promise<Object|null>} Documento encontrado o null
   */
  async findById(id) {
    return await OrderDetailsModel.findById(id);
  }

  /**
   * OBTIENE TODOS LOS DETALLES ASOCIADOS A UNA ORDEN
   * @param {String} orderId - ID de la orden
   * @returns {Promise<Array>} Lista de detalles asociados a esa orden
   */
  async findAllByOrderId(orderId) {
    return await OrderDetailsModel.find({ orderId: orderId });
  }

  /**
   * ACTUALIZA UN DETALLE DE ORDEN POR ID
   * @param {String} id - ID del detalle
   * @param {Object} orderDetailsData - Datos a actualizar
   * @returns {Promise<Object|null>} Documento actualizado o null
   */
  async update(id, orderDetailsData) {
    return await OrderDetailsModel.findByIdAndUpdate(id, orderDetailsData, { new: true });
  }

  /**
   * ELIMINA UN DETALLE DE ORDEN POR ID
   * @param {String} id - ID del detalle
   * @returns {Promise<Object|null>} Documento eliminado o null
   */
  async delete(id) {
    return await OrderDetailsModel.findByIdAndDelete(id);
  }
}

export default OrderDetailsRepositoryMongo;
