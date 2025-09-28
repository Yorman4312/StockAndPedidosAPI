/**
 * PRODUCT.JS - ENTIDAD DE DOMINIO "PRODUCT"
 * =========================================
 * 
 * Representa la entidad "Producto" dentro de la capa de dominio.
 * Define atributos, validaciones y reglas básicas para los
 * productos que forman parte del inventario del e-commerce.
 * 
 * CAMPOS PRINCIPALES:
 * - id: Identificador único del producto
 * - name: Nombre del producto (obligatorio, mínimo 2 caracteres)
 * - description: Descripción breve del producto
 * - price: Precio unitario del producto (obligatorio y >= 0)
 * - stock: Cantidad disponible en inventario (obligatorio y >= 0)
 * - category: Categoría a la que pertenece el producto (obligatorio)
 * - createdAt: Fecha de creación del producto
 * 
 * 🚨 VALIDACIONES:
 * - `name`: requerido, mínimo 2 caracteres
 * - `price`: requerido, debe ser mayor o igual a 0
 * - `stock`: requerido, no puede ser nulo ni negativo (permite stock en 0)
 * - `category`: requerido, no puede ser vacío
 * 
 * CASOS DE USO TÍPICOS:
 * - Registrar un nuevo producto en el inventario
 * - Actualizar datos de un producto existente (ej. stock, precio, categoría)
 * - Consultar productos por categoría o disponibilidad
 * - Controlar inventario según pedidos confirmados o cancelados
 * 
 * 🔄 RELACIÓN CON OTRAS ENTIDADES:
 * - Relación con OrderDetails → el stock se ajusta según la cantidad pedida
 * - Relación indirecta con Order → a través de OrderDetails
 * 
 * 🔐 CONSIDERACIONES:
 * - Debe validarse el stock antes de confirmar un pedido
 * - No se permite stock negativo (se previene inconsistencia en inventario)
 * - El precio corresponde al valor actual, no incluye historial de cambios
 * 
 * PATRONES Y PRINCIPIOS:
 * - Clean Architecture → Entidad de dominio pura
 * - SRP (Single Responsibility Principle) → Solo modela un producto
 */

class Product {
  /**
   * Constructor de la entidad Product
   * @param {Object} params - Parámetros para construir el producto
   * @param {string} params.id - Identificador único del producto
   * @param {string} params.name - Nombre del producto (mínimo 2 caracteres)
   * @param {string} params.description - Descripción breve del producto
   * @param {number} params.price - Precio unitario del producto (>= 0)
   * @param {number} params.stock - Cantidad en inventario (>= 0, puede ser 0)
   * @param {string} params.category - Categoría del producto
   * @param {Date} params.createdAt - Fecha de creación del producto
   * @throws {Error} - Si name, price, stock o category no cumplen validaciones
   */
  constructor({ id, name, description, price, stock, category, createdAt }) {
    if(!name || name.length < 2) throw new Error("❌ Nombre del producto inválido ❌");

    if(!price || price < 0) throw new Error("❌ Precio inválido ❌");

    if(stock == null || stock < 0) throw new Error("❌ Stock inválido ❌");

    if(!category) throw new Error("❌ Categoria inválida ❌");

    this.id = id;
    this.name = name;
    this.description = description;
    this.price = price;
    this.stock = stock;
    this.category = category;
    this.createdAt = createdAt;
  }
}

export default Product;
