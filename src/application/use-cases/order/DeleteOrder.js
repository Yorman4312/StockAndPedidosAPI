/**
 * DELETEORDER.JS - CASO DE USO PARA ELIMINACIÓN DE PEDIDOS
 * ========================================================
 * 
 * Este caso de uso maneja la lógica de eliminación de pedidos
 * del sistema. Implementa el patrón Clean Architecture para
 * mantener la separación de responsabilidades.
 * 
 * Funcionalidades:
 * - Eliminación de pedidos por ID
 * - Abstracción de la capa de persistencia
 * - Implementación del patrón Use Case
 * 
 * IMPORTANTE: Este caso de uso realiza eliminación directa.
 * Para un sistema de producción, considerar:
 * - Eliminación lógica (soft delete) en lugar de física
 * - Validación de permisos de usuario
 * - Verificación de estado del pedido antes de eliminar
 * - Restauración del stock si el pedido tenía status: true
 * 
 * Patrón de diseño: Clean Architecture / Use Case Pattern
 * Principio SOLID: Single Responsibility Principle
 */

/**
 * CLASE DELETEORDER - CASO DE USO
 * ===============================
 * 
 * Caso de uso simple que encapsula la lógica de eliminación
 * de pedidos. Sigue el principio de responsabilidad única
 * al enfocarse únicamente en la eliminación.
 */
export default class DeleteOrder {
  /**
   * CONSTRUCTOR
   * ===========
   * 
   * Inicializa el caso de uso con la dependencia del repositorio
   * de pedidos mediante inyección de dependencias.
   * 
   * @param {Object} orderRepository - Repositorio para operaciones CRUD de pedidos
   *                                 Debe implementar el método delete(id)
   */
  constructor(orderRepository) {
    this.orderRepository = orderRepository;
  }

  /**
   * EXECUTE - MÉTODO PRINCIPAL DE EJECUCIÓN
   * =======================================
   * 
   * Ejecuta la eliminación de un pedido específico por su ID.
   * 
   * Proceso:
   * 1. Recibe el ID del pedido a eliminar
   * 2. Delega la eliminación al repositorio correspondiente
   * 3. Retorna el resultado de la operación
   * 
   * CONSIDERACIONES DE NEGOCIO:
   * - Si el pedido tenía status: true, el stock YA fue descontado
   * - Si el pedido tenía status: false, el stock YA fue restaurado
   * - En un sistema real, podría ser necesario manejar la restauración
   *   del stock si se elimina un pedido con status: true
   * 
   * @param {string} id - ID único del pedido a eliminar
   * 
   * @returns {Promise<Object>} Resultado de la operación de eliminación
   *                           El formato depende de la implementación del repositorio
   * 
   * @throws {Error} Si el pedido no existe o hay errores en la base de datos
   * 
   * @example
   * // Uso típico del caso de uso
   * const deleteOrder = new DeleteOrder(orderRepository);
   * const result = await deleteOrder.execute("64a1b2c3d4e5f6789abcdef0");
   */
  async execute(id) {
    return await this.orderRepository.delete(id);
  }
}