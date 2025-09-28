/**
 * DELETEPRODUCT.JS - CASO DE USO PARA ELIMINACIÓN DE PRODUCTOS
 * ============================================================
 * 
 * Este caso de uso maneja la eliminación de productos del sistema.
 * Es una operación crítica que requiere consideraciones especiales
 * debido a las relaciones del producto con otras entidades del sistema.
 * 
 * Funcionalidades:
 * - Eliminación de productos por ID
 * - Abstracción de la capa de persistencia
 * - Implementación del patrón Use Case
 * 
 * CASOS DE USO TÍPICOS:
 * - Descontinuación de productos obsoletos
 * - Limpieza de productos de prueba o erróneos
 * - Gestión de catálogo por parte del administrador
 * - Eliminación de duplicados accidentales
 * 
 * ⚠️ CONSIDERACIONES CRÍTICAS DE INTEGRIDAD REFERENCIAL:
 * 
 * IMPACTO EN ORDERDETAILS:
 * - Si el producto tiene detalles de pedidos asociados, la eliminación podría:
 *   • Romper la integridad referencial
 *   • Causar errores en consultas de pedidos históricos
 *   • Perder información de auditoría y reportes
 * 
 * RECOMENDACIONES PARA PRODUCCIÓN:
 * 
 * 1. VALIDACIÓN PREVIA:
 *    - Verificar si el producto tiene pedidos asociados
 *    - Bloquear eliminación si hay referencias activas
 *    - Permitir solo si no hay OrderDetails relacionados
 * 
 * 2. SOFT DELETE (RECOMENDADO):
 *    - Marcar producto como "inactivo" en lugar de eliminar
 *    - Mantener datos históricos intactos
 *    - Ocultar de catálogo pero preservar en reportes
 * 
 * 3. ELIMINACIÓN EN CASCADA:
 *    - Si se permite eliminación física
 *    - Considerar eliminar OrderDetails relacionados primero
 *    - Implementar transacciones para consistencia
 * 
 * 4. ARCHIVADO:
 *    - Mover producto y sus relaciones a tablas de archivo
 *    - Mantener histórico pero liberar sistema principal
 * 
 * ESTADOS RECOMENDADOS PARA PRODUCTOS:
 * - active: Visible y vendible
 * - inactive: No visible, no vendible, pero conserva histórico
 * - discontinued: Marcado como descontinuado pero con histórico
 * - deleted: Solo para casos excepcionales sin referencias
 * 
 * Patrón de diseño: Clean Architecture / Use Case Pattern
 * Principio SOLID: Single Responsibility Principle
 */

/**
 * CLASE DELETEPRODUCT - CASO DE USO
 * =================================
 * 
 * Caso de uso que encapsula la lógica de eliminación de productos.
 * Implementa eliminación directa pero debería evolucionar hacia
 * validaciones de integridad o soft delete en producción.
 */
export default class DeleteProduct {
  /**
   * CONSTRUCTOR
   * ===========
   * 
   * Inicializa el caso de uso con la dependencia del repositorio
   * de productos mediante inyección de dependencias.
   * 
   * @param {Object} productRepository - Repositorio para operaciones CRUD de productos
   *                                   Debe implementar el método delete(id)
   */
  constructor(productRepository) {
    this.productRepository = productRepository;
  }

  /**
   * EXECUTE - MÉTODO PRINCIPAL DE EJECUCIÓN
   * =======================================
   * 
   * Ejecuta la eliminación de un producto específico por su ID.
   * 
   * ⚠️ ADVERTENCIA: Esta implementación realiza eliminación física directa
   * sin validaciones de integridad referencial. Para sistemas de producción,
   * considerar implementar las validaciones y estrategias mencionadas arriba.
   * 
   * Proceso actual:
   * 1. Recibe el ID del producto a eliminar
   * 2. Delega la eliminación al repositorio correspondiente
   * 3. Retorna el resultado de la operación
   * 
   * PROCESO RECOMENDADO PARA PRODUCCIÓN:
   * 1. Validar existencia del producto
   * 2. Verificar referencias en OrderDetails
   * 3. Decidir estrategia (soft delete, bloqueo, cascada)
   * 4. Ejecutar eliminación/desactivación según estrategia
   * 5. Registrar operación en logs de auditoría
   * 
   * IMPACTOS POTENCIALES:
   * 
   * SI HAY ORDERDETAILS RELACIONADOS:
   * - Queries de pedidos pueden fallar
   * - Reportes de ventas se verán afectados
   * - Pérdida de información histórica de precios
   * - Problemas de auditoría y trazabilidad
   * 
   * SI NO HAY REFERENCIAS:
   * - Eliminación segura sin impactos
   * - Ideal para productos de prueba o duplicados
   * - No afecta integridad del sistema
   * 
   * @param {string} id - ID único del producto a eliminar (MongoDB ObjectId)
   *                     Formato: "64a1b2c3d4e5f6789abcdef0"
   * 
   * @returns {Promise<Object>} Resultado de la operación de eliminación
   *                           Típicamente incluye información sobre registros afectados
   * 
   * @throws {Error} Si el producto no existe o hay errores en la base de datos
   * 
   * @example
   * // Uso básico (SOLO para productos sin referencias)
   * const deleteProduct = new DeleteProduct(productRepository);
   * const result = await deleteProduct.execute("64a1b2c3d4e5f6789abcdef0");
   * 
   * if (result.deletedCount > 0) {
   *   console.log('Producto eliminado exitosamente');
   * } else {
   *   console.log('Producto no encontrado');
   * }
   * 
   * @example
   * // Implementación RECOMENDADA con validaciones (pseudocódigo)
   * // async execute(id) {
   * //   // 1. Verificar existencia
   * //   const product = await this.productRepository.findById(id);
   * //   if (!product) throw new Error('Producto no encontrado');
   * //   
   * //   // 2. Verificar referencias
   * //   const hasOrders = await this.orderDetailsRepository.existsByProductId(id);
   * //   if (hasOrders) {
   * //     throw new Error('No se puede eliminar: producto tiene pedidos asociados');
   * //   }
   * //   
   * //   // 3. Eliminar de forma segura
   * //   return await this.productRepository.delete(id);
   * // }
   * 
   * @example
   * // Alternativa con SOFT DELETE (recomendado)
   * // async execute(id) {
   * //   return await this.productRepository.update(id, { 
   * //     status: 'inactive',
   * //     deletedAt: new Date()
   * //   });
   * // }
   * 
   * @example
   * // Uso con manejo completo de errores
   * try {
   *   const result = await deleteProduct.execute(productId);
   *   
   *   if (result.deletedCount > 0) {
   *     console.log('Producto eliminado correctamente');
   *     // TODO: Invalidar caché si se usa
   *     // TODO: Notificar a otros servicios si es necesario
   *   } else {
   *     console.log('El producto no fue encontrado');
   *   }
   * } catch (error) {
   *   console.error('Error al eliminar producto:', error.message);
   *   
   *   // Manejo específico según el tipo de error
   *   if (error.message.includes('referencia')) {
   *     console.log('Considerar desactivar en lugar de eliminar');
   *   }
   * }
   * 
   * @example
   * // Escenarios de uso seguros
   * 
   * // ✅ SEGURO: Producto de prueba sin pedidos
   * await deleteProduct.execute(testProductId);
   * 
   * // ✅ SEGURO: Producto duplicado creado por error
   * await deleteProduct.execute(duplicateProductId);
   * 
   * // ⚠️ RIESGOSO: Producto con historial de ventas
   * // Mejor usar soft delete o desactivación
   * // await productRepository.update(id, { status: 'inactive' });
   */
  async execute(id) {
    return await this.productRepository.delete(id);
  }
}