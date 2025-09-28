/**
 * GETORDERBYID.JS - CASO DE USO PARA OBTENER UN PEDIDO ESPECÍFICO
 * ===============================================================
 * 
 * Este caso de uso maneja la recuperación de un pedido específico
 * mediante su ID único. Implementa el patrón Clean Architecture
 * para mantener la separación entre lógica de negocio y persistencia.
 * 
 * Funcionalidades:
 * - Obtención de un pedido específico por ID
 * - Abstracción de la capa de persistencia
 * - Implementación del patrón Use Case
 * 
 * Casos de uso típicos:
 * - Ver detalles completos de un pedido específico
 * - Seguimiento de pedidos por parte del cliente
 * - Validación de existencia antes de operaciones (actualizar/eliminar)
 * - Auditoría de transacciones individuales
 * - Integración con sistemas de facturación
 * 
 * CONSIDERACIONES DE SEGURIDAD:
 * - Validar que el usuario tenga permisos para ver el pedido
 * - En sistemas multi-tenant, verificar ownership del pedido
 * - Sanitizar el ID de entrada para prevenir inyecciones
 * 
 * CONSIDERACIONES DE RENDIMIENTO:
 * - Implementar caché para pedidos consultados frecuentemente
 * - Considerar incluir datos relacionados (populate) si es necesario
 * 
 * Patrón de diseño: Clean Architecture / Use Case Pattern
 * Principio SOLID: Single Responsibility Principle
 */

/**
 * CLASE GETORDERBYID - CASO DE USO
 * ================================
 * 
 * Caso de uso especializado en la recuperación de un pedido específico
 * mediante su identificador único. Encapsula la lógica de consulta
 * individual manteniendo la separación de responsabilidades.
 */
export default class GetOrderById {
  /**
   * CONSTRUCTOR
   * ===========
   * 
   * Inicializa el caso de uso con la dependencia del repositorio
   * de pedidos mediante inyección de dependencias.
   * 
   * @param {Object} orderRepository - Repositorio para operaciones CRUD de pedidos
   *                                 Debe implementar el método findById(id)
   */
  constructor(orderRepository) {
    this.orderRepository = orderRepository;
  }

  /**
   * EXECUTE - MÉTODO PRINCIPAL DE EJECUCIÓN
   * =======================================
   * 
   * Ejecuta la búsqueda de un pedido específico por su ID único.
   * 
   * Proceso:
   * 1. Recibe el ID del pedido a buscar
   * 2. Delega la consulta al repositorio correspondiente
   * 3. Retorna el pedido encontrado o null si no existe
   * 
   * ESTRUCTURA DEL PEDIDO RETORNADO:
   * {
   *   _id: "64a1b2c3d4e5f6789abcdef0",
   *   userId: "64a1b2c3d4e5f6789abcdef1",
   *   total: 150.50,
   *   status: true, // true = pedido confirmado (stock descontado)
   *                 // false = pedido cancelado (stock restaurado)
   *   createdAt: "2024-01-15T10:30:00Z",
   *   updatedAt: "2024-01-15T10:35:00Z"
   * }
   * 
   * RELACIONES DISPONIBLES:
   * - Para obtener detalles del pedido: usar OrderDetailsRepository
   * - Para obtener info del usuario: usar UserRepository con userId
   * - Para obtener info de productos: consultar via orderDetails
   * 
   * CASOS DE RETORNO:
   * - Pedido encontrado: Retorna objeto completo del pedido
   * - Pedido no encontrado: Retorna null
   * - Error de BD: Lanza excepción
   * 
   * @param {string} id - ID único del pedido (MongoDB ObjectId)
   *                     Formato: "64a1b2c3d4e5f6789abcdef0"
   * 
   * @returns {Promise<Object|null>} Objeto del pedido encontrado o null si no existe
   * 
   * @throws {Error} Si el ID tiene formato inválido o hay errores de base de datos
   * 
   * @example
   * // Uso típico del caso de uso
   * const getOrderById = new GetOrderById(orderRepository);
   * const order = await getOrderById.execute("64a1b2c3d4e5f6789abcdef0");
   * 
   * if (order) {
   *   console.log(`Pedido encontrado: Total $${order.total}`);
   *   console.log(`Estado: ${order.status ? 'Confirmado' : 'Cancelado'}`);
   * } else {
   *   console.log('Pedido no encontrado');
   * }
   */
  async execute(id) {
    return await this.orderRepository.findById(id);
  }
}