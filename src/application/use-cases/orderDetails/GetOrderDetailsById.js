/**
 * GETORDERDETAILSBYID.JS - CASO DE USO PARA OBTENER UN DETALLE ESPECÍFICO
 * =======================================================================
 * 
 * Este caso de uso maneja la recuperación de un detalle específico de pedido
 * mediante su ID único. Proporciona acceso granular a la información de
 * relaciones individuales producto-pedido.
 * 
 * Funcionalidades:
 * - Obtención de un detalle específico por ID
 * - Abstracción de la capa de persistencia
 * - Implementación del patrón Use Case
 * 
 * CASOS DE USO TÍPICOS:
 * - Consulta de información específica de un item en un pedido
 * - Validación de existencia antes de operaciones (actualizar/eliminar)
 * - Auditoría de transacciones individuales por item
 * - Verificación de precios históricos de productos específicos
 * - Análisis detallado de devoluciones o reclamaciones
 * - Debugging y troubleshooting de problemas específicos
 * 
 * DIFERENCIACIÓN DE CASOS DE USO:
 * - GetOrderDetailsById: Un detalle específico por su ID único
 * - GetOrderDetailsByOrderId: Todos los detalles de UN pedido
 * - GetOrderDetails: Todos los detalles de TODOS los pedidos
 * 
 * INFORMACIÓN DISPONIBLE EN EL DETALLE:
 * Un detalle individual contiene:
 * - Identificación única del detalle
 * - Relación con el pedido padre (orderId)
 * - Relación con el producto (productId)  
 * - Cantidad específica comprada
 * - Precio unitario histórico (precio en el momento de compra)
 * - Subtotal calculado (cantidad × precio unitario)
 * - Timestamps de creación y actualización
 * 
 * VALOR DEL PRECIO HISTÓRICO:
 * - Preserva el precio pagado originalmente
 * - Independiente del precio actual del producto
 * - Esencial para auditorías y reconciliaciones
 * - Permite análisis de variaciones de precios en el tiempo
 * 
 * CONSIDERACIONES DE SEGURIDAD:
 * - Validar permisos del usuario para acceder al detalle
 * - En sistemas multi-tenant, verificar ownership
 * - Validar que el usuario tenga acceso al pedido padre
 * 
 * CONSIDERACIONES DE RENDIMIENTO:
 * - Consulta simple y rápida por índice primario
 * - Considerar caché para detalles consultados frecuentemente
 * - Implementar populate si se necesita info de producto/pedido
 * 
 * Patrón de diseño: Clean Architecture / Use Case Pattern  
 * Principio SOLID: Single Responsibility Principle
 */

/**
 * CLASE GETORDERDETAILSBYID - CASO DE USO
 * =======================================
 * 
 * Caso de uso especializado en la recuperación de detalles
 * específicos de pedidos mediante identificador único.
 * Proporciona acceso granular a información de transacciones.
 */
export default class GetOrderDetailsById {
  /**
   * CONSTRUCTOR
   * ===========
   * 
   * Inicializa el caso de uso con la dependencia del repositorio
   * de detalles de pedido mediante inyección de dependencias.
   * 
   * @param {Object} orderDetailsRepository - Repositorio para operaciones CRUD de detalles
   *                                        Debe implementar el método findById(id)
   */
  constructor(orderDetailsRepository) {
    this.orderDetailsRepository = orderDetailsRepository;
  }

  /**
   * EXECUTE - MÉTODO PRINCIPAL DE EJECUCIÓN
   * =======================================
   * 
   * Ejecuta la búsqueda de un detalle específico de pedido por su ID único.
   * 
   * Proceso:
   * 1. Recibe el ID del detalle a buscar
   * 2. Delega la consulta al repositorio correspondiente
   * 3. Retorna el detalle encontrado o null si no existe
   * 
   * ESTRUCTURA DEL DETALLE RETORNADO:
   * {
   *   _id: "64a1b2c3d4e5f6789abcdef0",        // ID único del detalle
   *   orderId: "64a1b2c3d4e5f6789abcdef1",    // ID del pedido padre
   *   productId: "64a1b2c3d4e5f6789abcdef2",  // ID del producto
   *   amount: 3,                               // Cantidad comprada
   *   unitPrice: 29.99,                        // Precio en momento de compra
   *   subtotal: 89.97,                         // 3 × 29.99
   *   createdAt: "2024-01-15T10:30:00Z",
   *   updatedAt: "2024-01-15T10:30:00Z"
   * }
   * 
   * ANÁLISIS POSIBLE CON UN DETALLE:
   * - Verificar precio pagado vs precio actual del producto
   * - Calcular margen de ganancia si se conoce el costo
   * - Auditar cambios en el tiempo (updatedAt vs createdAt)
   * - Validar integridad de cálculos (amount × unitPrice = subtotal)
   * - Rastrear historial de un producto específico en pedidos
   * 
   * CASOS DE RETORNO:
   * - Detalle encontrado: Retorna objeto completo del detalle
   * - Detalle no encontrado: Retorna null
   * - Error de BD: Lanza excepción
   * - ID inválido: Puede retornar null o lanzar excepción según implementación
   * 
   * @param {string} id - ID único del detalle de pedido (MongoDB ObjectId)
   *                     Formato típico: "64a1b2c3d4e5f6789abcdef0"
   * 
   * @returns {Promise<Object|null>} Objeto del detalle encontrado o null si no existe
   * 
   * @throws {Error} Si el ID tiene formato inválido o hay errores de base de datos
   * 
   * @example
   * // Uso básico del caso de uso
   * const getOrderDetailsById = new GetOrderDetailsById(orderDetailsRepository);
   * const detail = await getOrderDetailsById.execute("64a1b2c3d4e5f6789abcdef0");
   * 
   * if (detail) {
   *   console.log(`Producto: ${detail.productId}`);
   *   console.log(`Cantidad: ${detail.amount}`);
   *   console.log(`Precio unitario: $${detail.unitPrice}`);
   *   console.log(`Subtotal: $${detail.subtotal}`);
   * } else {
   *   console.log('Detalle no encontrado');
   * }
   * 
   * @example
   * // Uso para validación antes de operaciones
   * const detail = await getOrderDetailsById.execute(detailId);
   * 
   * if (!detail) {
   *   throw new Error('Detalle no encontrado, no se puede proceder');
   * }
   * 
   * // Proceder con operación (actualizar, eliminar, etc.)
   * console.log('Detalle válido, procediendo...');
   * 
   * @example
   * // Uso para auditoría de precios
   * const detail = await getOrderDetailsById.execute(detailId);
   * 
   * if (detail) {
   *   // Comparar precio histórico vs precio actual
   *   const currentProduct = await productRepository.findById(detail.productId);
   *   const priceDifference = currentProduct.price - detail.unitPrice;
   *   
   *   console.log(`Precio pagado: $${detail.unitPrice}`);
   *   console.log(`Precio actual: $${currentProduct.price}`);
   *   console.log(`Diferencia: $${priceDifference}`);
   *   
   *   if (priceDifference > 0) {
   *     console.log('El producto subió de precio');
   *   } else if (priceDifference < 0) {
   *     console.log('El producto bajó de precio'); 
   *   } else {
   *     console.log('El precio se mantiene igual');
   *   }
   * }
   * 
   * @example
   * // Uso con manejo completo de errores
   * try {
   *   const detail = await getOrderDetailsById.execute(detailId);
   *   
   *   if (detail) {
   *     // Validar integridad de datos
   *     const expectedSubtotal = detail.amount * detail.unitPrice;
   *     if (Math.abs(detail.subtotal - expectedSubtotal) > 0.01) {
   *       console.warn('Posible inconsistencia en cálculo de subtotal');
   *     }
   *     
   *     return detail;
   *   } else {
   *     return null;
   *   }
   * } catch (error) {
   *   console.error('Error al obtener detalle:', error.message);
   *   throw error;
   * }
   */
  async execute(id) {
    return await this.orderDetailsRepository.findById(id);
  }
}