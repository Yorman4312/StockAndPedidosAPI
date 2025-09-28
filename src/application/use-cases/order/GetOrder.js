/**
 * GETORDER.JS - CASO DE USO PARA OBTENER TODOS LOS PEDIDOS
 * ========================================================
 * 
 * Este caso de uso maneja la recuperación de todos los pedidos
 * del sistema. Implementa el patrón Clean Architecture para
 * mantener la separación entre lógica de negocio y persistencia.
 * 
 * Funcionalidades:
 * - Obtención de todos los pedidos del sistema
 * - Abstracción de la capa de persistencia
 * - Implementación del patrón Use Case
 * 
 * Casos de uso típicos:
 * - Panel de administración para ver todos los pedidos
 * - Reportes generales de ventas
 * - Auditoría de transacciones
 * - Dashboard ejecutivo con métricas
 * 
 * CONSIDERACIONES DE RENDIMIENTO:
 * - Para sistemas con muchos pedidos, considerar implementar paginación
 * - Agregar filtros por fecha, usuario, estado, etc.
 * - Implementar caché para consultas frecuentes
 * - Considerar proyección de campos para optimizar transferencia de datos
 * 
 * Patrón de diseño: Clean Architecture / Use Case Pattern
 * Principio SOLID: Single Responsibility Principle
 */

/**
 * CLASE GETORDER - CASO DE USO
 * ============================
 * 
 * Caso de uso especializado en la recuperación de todos los pedidos
 * del sistema. Mantiene la separación de responsabilidades al delegar
 * las operaciones de base de datos al repositorio correspondiente.
 */
export default class GetOrder {
  /**
   * CONSTRUCTOR
   * ===========
   * 
   * Inicializa el caso de uso con la dependencia del repositorio
   * de pedidos mediante inyección de dependencias.
   * 
   * @param {Object} orderRepository - Repositorio para operaciones CRUD de pedidos
   *                                 Debe implementar el método findAll()
   */
  constructor(orderRepository) {
    this.orderRepository = orderRepository;
  }

  /**
   * EXECUTE - MÉTODO PRINCIPAL DE EJECUCIÓN
   * =======================================
   * 
   * Ejecuta la recuperación de todos los pedidos almacenados en el sistema.
   * 
   * Proceso:
   * 1. Delega la consulta al repositorio de pedidos
   * 2. Retorna todos los pedidos encontrados
   * 
   * ESTRUCTURA TÍPICA DE RESPUESTA:
   * Cada pedido incluye campos como:
   * - _id: ID único del pedido
   * - userId: ID del usuario que realizó el pedido
   * - total: Monto total del pedido
   * - status: Estado del pedido (true/false)
   * - createdAt: Fecha de creación
   * - updatedAt: Fecha de última actualización
   * 
   * RELACIONES:
   * - Los pedidos están relacionados con usuarios (userId)
   * - Los detalles del pedido se obtienen por separado vía OrderDetails
   * - El estado (status) determina si el stock fue descontado o no
   * 
   * @returns {Promise<Array>} Array con todos los pedidos del sistema
   *                          Cada elemento es un objeto pedido completo
   * 
   * @throws {Error} Si hay errores de conexión a la base de datos
   *                o problemas en la consulta
   * 
   * @example
   * // Uso típico del caso de uso
   * const getOrder = new GetOrder(orderRepository);
   * const allOrders = await getOrder.execute();
   * 
   * // Resultado esperado:
   * // [
   * //   {
   * //     _id: "64a1b2c3d4e5f6789abcdef0",
   * //     userId: "64a1b2c3d4e5f6789abcdef1",
   * //     total: 150.50,
   * //     status: true,
   * //     createdAt: "2024-01-15T10:30:00Z"
   * //   },
   * //   ...más pedidos
   * // ]
   */
  async execute() {
    return await this.orderRepository.findAll();
  }
}