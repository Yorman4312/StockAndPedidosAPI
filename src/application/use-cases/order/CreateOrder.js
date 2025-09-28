/**
 * CREATEORDER.JS - CASO DE USO PARA CREACIÓN DE PEDIDOS
 * =====================================================
 * 
 * Este caso de uso maneja la lógica completa de creación de pedidos,
 * incluyendo validaciones de stock, cálculos automáticos y gestión
 * de inventario en tiempo real.
 * 
 * Funcionalidades principales:
 * - Validación de existencia de productos
 * - Verificación de stock disponible
 * - Actualización automática de inventario (descuenta stock)
 * - Cálculo automático de subtotales y total del pedido
 * - Creación transaccional de pedido y detalles
 * 
 * Patrón de diseño: Clean Architecture / Use Case Pattern
 * Principio SOLID: Dependency Injection
 */

import Order from "../../../domain/entities/Order.js";

/**
 * CLASE CREATEORDER - CASO DE USO
 * ===============================
 * 
 * Implementa el patrón de inyección de dependencias para
 * desacoplar la lógica de negocio de las implementaciones
 * específicas de persistencia de datos.
 */
export default class CreateOrder {
  /**
   * CONSTRUCTOR
   * ===========
   * 
   * Inicializa el caso de uso con las dependencias necesarias
   * para interactuar con las diferentes entidades del sistema.
   * 
   * @param {Object} orderRepository - Repositorio para operaciones CRUD de pedidos
   * @param {Object} orderDetailsRepository - Repositorio para detalles de pedidos
   * @param {Object} productRepository - Repositorio para gestión de productos y stock
   */
  constructor(orderRepository, orderDetailsRepository, productRepository) {
    this.orderRepository = orderRepository;
    this.orderDetailsRepository = orderDetailsRepository;
    this.productRepository = productRepository;
  }

  /**
   * EXECUTE - MÉTODO PRINCIPAL DE EJECUCIÓN
   * =======================================
   * 
   * Ejecuta todo el proceso de creación de un pedido siguiendo estos pasos:
   * 
   * 1. Separación de datos del pedido y sus detalles
   * 2. Validación de productos y stock para cada detalle
   * 3. Actualización automática del stock (descuento)
   * 4. Cálculo de subtotales y total del pedido
   * 5. Creación del pedido principal
   * 6. Creación de todos los detalles del pedido
   * 
   * @param {Object} orderData - Datos completos del pedido
   * @param {Array} orderData.details - Array de detalles del pedido
   * @param {string} orderData.userId - ID del usuario que realiza el pedido
   * @param {boolean} orderData.status - Estado inicial del pedido
   * 
   * @returns {Object} Objeto con el pedido creado y sus detalles
   * @throws {Error} Si un producto no existe o no hay stock suficiente
   */
  async execute(orderData) {
    // Separación de detalles del pedido y datos principales
    const { details, ...orderHeaderData } = orderData;

    // Variables para el cálculo del total y validación de detalles
    let orderTotal = 0;
    const verifiedDetails = [];

    /**
     * VALIDACIÓN Y PROCESAMIENTO DE CADA DETALLE
     * ==========================================
     * 
     * Para cada producto en el pedido se realiza:
     * - Verificación de existencia del producto
     * - Validación de stock disponible
     * - Actualización del inventario (descuento de stock)
     * - Cálculo de precios y subtotales
     */
    for(const detail of details) {
      // Búsqueda del producto en la base de datos
      const product = await this.productRepository.findById(detail.productId);

      // Validación: El producto debe existir
      if(!product) {
        throw new Error(`El producto con ID ${detail.productId} no encontrado`);
      }

      // Validación: Debe haber stock suficiente para la cantidad solicitada
      if(product.stock < detail.amount) {
        throw new Error(` ⚠️ Stock insuficiente. Stock actual: ${product.stock}, Stock solicitado: ${detail.amount} ⚠️`);
      }

      /**
       * ACTUALIZACIÓN AUTOMÁTICA DE STOCK
       * =================================
       * 
       * Se descuenta el stock inmediatamente al crear el pedido.
       * El valor negativo indica una reducción del inventario.
       * Esto asegura que el stock se mantenga actualizado en tiempo real.
       */
      const stockChange = detail.amount * -1;
      await this.productRepository.updateStock(detail.productId, stockChange);

      /**
       * CÁLCULOS FINANCIEROS
       * ===================
       * 
       * Se toma el precio actual del producto (no el enviado por el cliente)
       * para evitar manipulaciones de precios desde el frontend.
       */
      const verifiedUnitPrice = product.price;
      const verifiedSubtotal = verifiedUnitPrice * detail.amount;
      orderTotal += verifiedSubtotal;

      // Preparación del detalle verificado para guardar
      verifiedDetails.push({
        orderId: null, // Se asignará después de crear el pedido principal
        productId: detail.productId,
        amount: detail.amount,
        unitPrice: verifiedUnitPrice,
        subtotal: verifiedSubtotal
      });
    }

    /**
     * CREACIÓN DEL PEDIDO PRINCIPAL
     * ============================
     * 
     * Se crea la entidad Order con el total calculado automáticamente
     * basado en los precios actuales de los productos.
     */
    const order = new Order({ ...orderHeaderData, total: orderTotal });
    const orderToSave = {
      userId: order.userId,
      total: orderTotal,
      status: order.status
    };

    // Persistencia del pedido en la base de datos
    const newOrder = await this.orderRepository.create(orderToSave);
    const orderId = newOrder._id;

    /**
     * CREACIÓN DE LOS DETALLES DEL PEDIDO
     * ==================================
     * 
     * Se asigna el ID del pedido creado a todos los detalles
     * y se guardan en lote para optimizar las operaciones de BD.
     */
    const detailsToSave = verifiedDetails.map(detail => ({
      ...detail,
      orderId: orderId
    }));

    // Creación en lote de todos los detalles del pedido
    const newDetails = await this.orderDetailsRepository.createMany(detailsToSave);

    /**
     * RETORNO DEL RESULTADO
     * ====================
     * 
     * Se devuelve tanto el pedido principal como todos sus detalles
     * para que el controlador pueda enviar la respuesta completa al cliente.
     */
    return {
      order: newOrder,
      details: newDetails
    };
  }
}