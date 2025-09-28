/**
 * ORDER.JS - ENTIDAD DE DOMINIO "ORDER"
 * =====================================
 * 
 * Representa la entidad "Pedido" dentro de la capa de dominio.
 * Define la estructura y reglas básicas para crear un pedido
 * en el sistema.
 * 
 * CAMPOS PRINCIPALES:
 * - id: Identificador único del pedido
 * - userId: Usuario al que pertenece el pedido (obligatorio)
 * - total: Monto total del pedido
 * - status: Estado del pedido (true = confirmado / false = cancelado)
 * - createdAt: Fecha de creación del pedido
 * 
 * 🚨 VALIDACIONES:
 * - Se valida que `userId` siempre esté presente, de lo contrario
 *   lanza un error indicando ID inválido.
 * 
 * CASOS DE USO TÍPICOS:
 * - Representar un pedido en la lógica de negocio
 * - Crear pedidos nuevos en la base de datos
 * - Recuperar pedidos existentes para el usuario
 * 
 * 🔄 RELACIÓN CON OTRAS ENTIDADES:
 * - `userId` → Relación con la entidad User (un pedido pertenece a un usuario)
 * - Los detalles de pedido (OrderDetails) se relacionan con esta entidad
 *   a través del `orderId` en otra tabla/colección
 */

class Order {
  /**
   * Constructor de la entidad Order
   * @param {Object} params - Parámetros para construir un pedido
   * @param {string} params.id - Identificador único del pedido
   * @param {string} params.userId - ID del usuario al que pertenece el pedido
   * @param {number} params.total - Total monetario del pedido
   * @param {boolean} params.status - Estado del pedido (true = confirmado, false = cancelado)
   * @param {Date} params.createdAt - Fecha de creación del pedido
   * @throws {Error} - Si no se proporciona un userId válido
   */
  constructor({ id, userId, total, status, createdAt }) {
    if(!userId) throw new Error("❌ ID del usuario inválido ❌");

    this.id = id;
    this.userId = userId;
    this.total = total;
    this.status = status;
    this.createdAt = createdAt;
  }
}

export default Order;
