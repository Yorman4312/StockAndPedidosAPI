/**
 * UPDATEORDERDETAILS.JS - CASO DE USO PARA ACTUALIZACIÓN DE DETALLES DE PEDIDO
 * ============================================================================
 * 
 * Este caso de uso maneja la actualización de detalles individuales de pedidos
 * con gestión automática e inteligente de stock e impacto en totales del pedido.
 * Es una pieza crítica que mantiene la integridad entre inventario y finanzas.
 * 
 * Funcionalidades principales:
 * - Actualización de cantidad en detalles específicos
 * - Gestión automática de stock basada en diferencias de cantidad
 * - Recálculo automático de subtotales
 * - Actualización automática del total del pedido principal
 * - Validación de stock disponible para incrementos
 * - Coordinación entre múltiples entidades del sistema
 * 
 * LÓGICA DE STOCK INTELIGENTE:
 * - Si aumenta cantidad: Valida stock y lo descuenta
 * - Si disminuye cantidad: Restaura stock automáticamente
 * - Solo valida disponibilidad en incrementos, no en decrementos
 * 
 * IMPACTO FINANCIERO:
 * - Recalcula subtotal del detalle (nueva cantidad × precio histórico)
 * - Actualiza total del pedido principal automáticamente
 * - Mantiene precios históricos intactos (no modifica unitPrice)
 * 
 * COORDINACIÓN DE ENTIDADES:
 * - OrderDetails: Actualiza cantidad y subtotal
 * - Product: Ajusta stock según diferencia de cantidad  
 * - Order: Actualiza total con diferencia de subtotales
 * 
 * Patrón de diseño: Clean Architecture / Use Case Pattern
 * Principio SOLID: Single Responsibility + Dependency Injection
 */

import OrderDetails from "../../../domain/entities/OrderDetails.js";

/**
 * CLASE UPDATEORDERDETAILS - CASO DE USO
 * ======================================
 * 
 * Maneja la actualización compleja de detalles de pedidos con
 * todas las implicaciones en stock, cálculos y totales del sistema.
 */
export default class UpdateOrderDetails {
  /**
   * CONSTRUCTOR
   * ===========
   * 
   * Inicializa el caso de uso con todas las dependencias necesarias
   * para coordinar la actualización entre múltiples entidades.
   * 
   * @param {Object} orderDetailsRepository - Repositorio para detalles de pedidos
   * @param {Object} orderRepository - Repositorio para pedidos principales
   * @param {Object} productRepository - Repositorio para productos y stock
   */
  constructor(orderDetailsRepository, orderRepository, productRepository) {
    this.orderDetailsRepository = orderDetailsRepository;
    this.orderRepository = orderRepository;
    this.productRepository = productRepository;
  }

  /**
   * EXECUTE - MÉTODO PRINCIPAL DE EJECUCIÓN
   * =======================================
   * 
   * Ejecuta la actualización completa de un detalle de pedido con
   * todas sus implicaciones en stock y totales del pedido.
   * 
   * Proceso completo:
   * 1. Validación de existencia del detalle
   * 2. Cálculo de diferencias de cantidad
   * 3. Validación de stock para incrementos
   * 4. Actualización de stock del producto
   * 5. Recálculo de subtotal del detalle
   * 6. Actualización del detalle
   * 7. Actualización del total del pedido principal
   * 
   * CASOS DE STOCK:
   * 
   * INCREMENTO DE CANTIDAD (ej: de 2 a 5 unidades):
   * - Diferencia: +3 unidades
   * - Validación: ¿Hay 3 unidades disponibles?
   * - Stock: Se descuentan 3 unidades
   * - Total pedido: Se suma la diferencia de subtotal
   * 
   * DECREMENTO DE CANTIDAD (ej: de 5 a 2 unidades):
   * - Diferencia: -3 unidades  
   * - Validación: No requerida (siempre se puede decrementar)
   * - Stock: Se restauran 3 unidades
   * - Total pedido: Se resta la diferencia de subtotal
   * 
   * @param {string} detailId - ID único del detalle a actualizar
   * @param {Object} updateData - Datos de actualización
   * @param {number} updateData.amount - Nueva cantidad del producto
   * 
   * @returns {Promise<Object>} Detalle actualizado con nuevos valores
   * 
   * @throws {Error} Si el detalle no existe o no hay stock suficiente
   * 
   * @example
   * // Incrementar cantidad (requiere validación de stock)
   * const updateOrderDetails = new UpdateOrderDetails(detailsRepo, orderRepo, productRepo);
   * 
   * const updatedDetail = await updateOrderDetails.execute("64a1b2c3d4e5f6789abcdef0", {
   *   amount: 5 // Era 2, ahora será 5 (incremento de 3)
   * });
   * 
   * // Resultado:
   * // - Stock del producto se reduce en 3 unidades
   * // - Subtotal se recalcula: 5 × precio_histórico
   * // - Total del pedido se incrementa por la diferencia
   * 
   * @example
   * // Decrementar cantidad (no requiere validación de stock)
   * const updatedDetail = await updateOrderDetails.execute("64a1b2c3d4e5f6789abcdef0", {
   *   amount: 1 // Era 3, ahora será 1 (decremento de 2)
   * });
   * 
   * // Resultado:
   * // - Stock del producto se incrementa en 2 unidades
   * // - Subtotal se recalcula: 1 × precio_histórico
   * // - Total del pedido se reduce por la diferencia
   */
  async execute(detailId, updateData) {
    /**
     * EXTRACCIÓN DE NUEVA CANTIDAD
     * ============================
     * 
     * Se obtiene la nueva cantidad deseada de los datos de actualización
     */
    const { amount: newAmount } = updateData;

    /**
     * PASO 1: VALIDACIÓN DE EXISTENCIA
     * ================================
     * 
     * Se verifica que el detalle existe y se obtienen sus datos actuales
     * necesarios para los cálculos posteriores
     */
    const oldDetail = await this.orderDetailsRepository.findById(detailId);
    if(!oldDetail) {
      throw new Error("❌ Detalle del pedido no encontrado ❌");
    }

    /**
     * EXTRACCIÓN DE DATOS CRÍTICOS
     * ============================
     * 
     * Se obtienen los valores necesarios para los cálculos de diferencias
     */
    const oldAmount = oldDetail.amount;        // Cantidad actual
    const price = oldDetail.unitPrice;         // Precio histórico (no cambia)
    const productId = oldDetail.productId;     // ID del producto afectado
    const orderId = oldDetail.orderId;         // ID del pedido padre

    /**
     * PASO 2: CÁLCULO DE DIFERENCIAS
     * ==============================
     * 
     * Se calculan las diferencias que determinarán los ajustes necesarios
     */
    const quantityDifference = newAmount - oldAmount;  // Diferencia de cantidad
    const stockChange = quantityDifference * -1;       // Cambio de stock (inverso)

    /**
     * PASO 3: VALIDACIÓN DE STOCK PARA INCREMENTOS
     * ============================================
     * 
     * Solo se valida stock cuando se incrementa la cantidad.
     * Los decrementos siempre son válidos ya que liberan stock.
     * 
     * NOTA: Hay un error lógico en la condición original (!quantityDifference > 0)
     * Debería ser (quantityDifference > 0) para incrementos
     */
    if(!quantityDifference > 0) { // ⚠️ POSIBLE BUG: Debería ser (quantityDifference > 0)
      const product = await this.productRepository.findById(productId);
      if(!product || product.stock < quantityDifference) {
        throw new Error(`⚠️ Stock insuficiente. Solo ${product.stock} unidades disponibles ⚠️`)
      }
    }

    /**
     * PASO 4: ACTUALIZACIÓN DE STOCK
     * ==============================
     * 
     * Se aplica el cambio de stock calculado:
     * - Incremento de cantidad → Decremento de stock (stockChange negativo)
     * - Decremento de cantidad → Incremento de stock (stockChange positivo)
     */
    await this.productRepository.updateStock(productId, stockChange);

    /**
     * PASO 5: RECÁLCULO DE SUBTOTAL
     * =============================
     * 
     * Se recalcula el subtotal con la nueva cantidad pero manteniendo
     * el precio histórico original para preservar la integridad de precios
     */
    const newSubtotal = newAmount * price;
    const subtotalDifference = newSubtotal - oldDetail.subtotal;

    /**
     * PASO 6: ACTUALIZACIÓN DEL DETALLE
     * =================================
     * 
     * Se actualiza el detalle con la nueva cantidad y subtotal
     * 
     * ⚠️ POSIBLE TYPO: "amonut" debería ser "amount"
     */
    const updatedDetail = await this.orderDetailsRepository.update(detailId, {
      amonut: newAmount,    // ⚠️ POSIBLE TYPO: debería ser "amount"
      subtotal: newSubtotal
    });

    /**
     * PASO 7: ACTUALIZACIÓN DEL TOTAL DEL PEDIDO
     * ==========================================
     * 
     * Se actualiza el total del pedido principal usando $inc para
     * incrementar/decrementar el total según la diferencia de subtotal
     * 
     * Esto es más eficiente que recalcular todo el total del pedido
     */
    await this.orderRepository.update(orderId, { $inc: { total: subtotalDifference } });

    /**
     * RETORNO DEL RESULTADO
     * ====================
     * 
     * Se retorna el detalle actualizado para que el controlador
     * pueda enviar la respuesta al cliente
     */
    return updatedDetail;
  }
}