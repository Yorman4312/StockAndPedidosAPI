/**
 * UPDATEORDER.JS - CASO DE USO PARA ACTUALIZACIÓN DE PEDIDOS
 * ==========================================================
 * 
 * Este caso de uso maneja la lógica completa de actualización de pedidos,
 * incluyendo el manejo automático de stock basado en cambios de estado.
 * Es una de las piezas más críticas del sistema ya que gestiona la 
 * integridad del inventario.
 * 
 * Funcionalidades principales:
 * - Actualización de datos del pedido
 * - Gestión automática de stock basada en cambios de estado
 * - Detección de cancelaciones y reactivaciones
 * - Restauración/descuento de inventario según el estado
 * - Validación de existencia del pedido
 * 
 * LÓGICA DE STOCK AUTOMÁTICA:
 * - Status true → false (Cancelación): Stock se SUMA (restaura inventario)
 * - Status false → true (Reactivación): Stock se RESTA (descuenta inventario)
 * - Otros cambios: No afectan el stock
 * 
 * Patrón de diseño: Clean Architecture / Use Case Pattern
 * Principio SOLID: Single Responsibility + Dependency Injection
 */

import Order from "../../../domain/entities/Order.js";

/**
 * CLASE UPDATEORDER - CASO DE USO
 * ===============================
 * 
 * Implementa la lógica completa de actualización de pedidos con
 * gestión inteligente de inventario. Coordina múltiples repositorios
 * para mantener la consistencia de datos.
 */
export default class UpdateOrder {
  /**
   * CONSTRUCTOR
   * ===========
   * 
   * Inicializa el caso de uso con todas las dependencias necesarias
   * para manejar pedidos, detalles y gestión de stock.
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
   * Ejecuta la actualización de un pedido con manejo automático de stock.
   * 
   * Proceso completo:
   * 1. Verificación de existencia del pedido
   * 2. Detección de cambios de estado críticos
   * 3. Gestión automática de stock si es necesario
   * 4. Actualización de los datos del pedido
   * 
   * CASOS DE GESTIÓN DE STOCK:
   * 
   * CANCELACIÓN (true → false):
   * - El pedido estaba confirmado (stock ya descontado)
   * - Se cancela el pedido
   * - Se RESTAURA el stock (suma las cantidades)
   * 
   * REACTIVACIÓN (false → true):
   * - El pedido estaba cancelado (stock ya restaurado)
   * - Se reactiva el pedido
   * - Se DESCUENTA el stock nuevamente (resta las cantidades)
   * 
   * @param {string} orderId - ID único del pedido a actualizar
   * @param {Object} updateData - Datos a actualizar en el pedido
   * @param {boolean} [updateData.status] - Nuevo estado del pedido
   * @param {number} [updateData.total] - Nuevo total (si aplica)
   * @param {string} [updateData.userId] - Cambio de usuario (si aplica)
   * 
   * @returns {Promise<Object|null>} Pedido actualizado o null si no existe
   * 
   * @throws {Error} Si hay errores en la base de datos o validaciones
   * 
   * @example
   * // Cancelar un pedido (restaura stock automáticamente)
   * const updateOrder = new UpdateOrder(orderRepo, detailsRepo, productRepo);
   * const result = await updateOrder.execute("64a1b2c3d4e5f6789abcdef0", {
   *   status: false
   * });
   * 
   * // Reactivar un pedido (descuenta stock automáticamente)
   * const result = await updateOrder.execute("64a1b2c3d4e5f6789abcdef0", {
   *   status: true
   * });
   */
  async execute(orderId, updateData) {
    /**
     * PASO 1: VERIFICACIÓN DE EXISTENCIA
     * =================================
     * 
     * Se obtiene el pedido actual para:
     * - Verificar que existe
     * - Conocer el estado actual (crítico para gestión de stock)
     * - Detectar qué cambios se están realizando
     */
    const oldOrder = await this.orderRepository.findById(orderId);

    // Si el pedido no existe, no se puede actualizar
    if(!oldOrder) {
      return null;
    }

    /**
     * PASO 2: DETECCIÓN DE CAMBIOS CRÍTICOS DE ESTADO
     * ===============================================
     * 
     * Se identifican los cambios que requieren gestión de stock:
     */
    
    // CANCELACIÓN: De confirmado (true) a cancelado (false)
    // Efecto: Debe restaurar el stock que fue descontado
    const isCancellation = oldOrder.status === true && updateData.status === false;
    
    // REACTIVACIÓN: De cancelado (false) a confirmado (true)  
    // Efecto: Debe descontar el stock nuevamente
    const isReactivation = oldOrder.status === false && updateData.status === true;

    /**
     * PASO 3: GESTIÓN AUTOMÁTICA DE STOCK
     * ===================================
     * 
     * Solo se ejecuta si hay cambios de estado que afecten el inventario
     */
    if(isCancellation || isReactivation) {
      // Obtener todos los detalles del pedido para saber qué productos y cantidades afectar
      const details = await this.orderDetailsRepository.findAllByOrderId(orderId);

      if(details && details.length > 0) {
        /**
         * CÁLCULO DEL CAMBIO DE STOCK
         * ==========================
         */
        let stockChange = 0;

        if(isCancellation) {
          // Cancelación: SUMAR stock (restaurar inventario)
          stockChange = 1;
        } else if(isReactivation) {
          // Reactivación: RESTAR stock (descontar inventario)
          stockChange = -1;
        }

        /**
         * APLICACIÓN DE CAMBIOS DE STOCK
         * =============================
         * 
         * Para cada producto en el pedido, se actualiza el stock
         * según la cantidad original y el tipo de cambio
         */
        for(const detail of details) {
          // El cambio final considera la cantidad del detalle
          const finalStockChange = detail.amount * stockChange; 
          await this.productRepository.updateStock(detail.productId, finalStockChange);
        }
      }
    }

    /**
     * PASO 4: ACTUALIZACIÓN DEL PEDIDO
     * ================================
     * 
     * Una vez gestionado el stock (si era necesario),
     * se procede a actualizar los datos del pedido
     */
    const updatedOrder = await this.orderRepository.update(orderId, updateData)
    return updatedOrder;
  }
}