/**
 * PRODUCTREPOSITORYMONGO.JS - REPOSITORIO MONGO
 * =============================================
 * 
 * Implementa el repositorio para gestionar productos
 * en MongoDB utilizando el modelo de Mongoose `ProductModel`.
 * 
 * FUNCIONALIDADES PRINCIPALES:
 * - Crear producto
 * - Consultar todos los productos
 * - Consultar producto por ID
 * - Actualizar producto
 * - Actualizar stock (incrementar/disminuir)
 * - Eliminar producto
 * 
 * CASOS DE USO TÍPICOS:
 * - Registrar un nuevo producto en el inventario
 * - Listar todos los productos disponibles
 * - Consultar la información de un producto específico
 * - Actualizar datos de un producto (ej: precio, descripción, categoría)
 * - Ajustar stock tras una venta o reposición
 * - Eliminar un producto del catálogo
 * 
 * PATRÓN:
 * - Repository Pattern: Permite desacoplar la lógica de negocio
 *   del acceso a datos en MongoDB.
 */

import { ProductModel } from "../db/ProductModel.js";

class ProductRepositoryMongo {
  /**
   * CREA UN PRODUCTO
   * @param {Object} productData - Datos del producto
   * @returns {Promise<Object>} Producto creado en MongoDB
   */
  async create(productData) {
    const product = new ProductModel(productData);
    return await product.save();
  }

  /**
   * OBTIENE TODOS LOS PRODUCTOS
   * @returns {Promise<Array>} Lista de productos
   */
  async findAll() {
    return await ProductModel.find();
  }

  /**
   * OBTIENE UN PRODUCTO POR ID
   * @param {String} id - ID del producto
   * @returns {Promise<Object|null>} Producto encontrado o null
   */
  async findById(id) {
    return await ProductModel.findById(id);
  }

  /**
   * ACTUALIZA UN PRODUCTO POR ID
   * @param {String} id - ID del producto
   * @param {Object} productData - Datos a actualizar
   * @returns {Promise<Object|null>} Producto actualizado o null
   */
  async update(id, productData) {
    return await ProductModel.findByIdAndUpdate(id, productData, { new: true });
  }

  /**
   * ACTUALIZA EL STOCK DE UN PRODUCTO
   * Incrementa o disminuye la cantidad en inventario.
   * 
   * @param {String} productId - ID del producto
   * @param {Number} change - Valor positivo o negativo a aplicar
   * @returns {Promise<Object|null>} Producto actualizado o null
   */
  async updateStock(productId, change) {
    return await ProductModel.findByIdAndUpdate(
      productId,
      { $inc: { stock: change } },
      { new: true, runValidators: true }
    );
  }

  /**
   * ELIMINA UN PRODUCTO POR ID
   * @param {String} id - ID del producto
   * @returns {Promise<Object|null>} Producto eliminado o null
   */
  async delete(id) {
    return await ProductModel.findByIdAndDelete(id);
  }
}

export default ProductRepositoryMongo;
