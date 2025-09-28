/**
 * ORDERDETAILS.JS - ENTIDAD DE DOMINIO "ORDERDETAILS"
 * ===================================================
 * 
 * Representa la entidad "Detalle del Pedido" dentro de la capa de dominio.
 * Define la estructura y reglas básicas de un ítem dentro de un pedido,
 * vinculando productos con pedidos.
 * 
 * CAMPOS PRINCIPALES:
 * - id: Identificador único del detalle
 * - orderId: Pedido al que pertenece el detalle (obligatorio)
 * - productId: Producto seleccionado en el detalle (obligatorio)
 * - amount: Cantidad de unidades solicitadas (obligatorio y > 0)
 * - unitPrice: Precio unitario del producto en el momento de la compra (obligatorio y > 0)
 * - subtotal: Total parcial (amount * unitPrice)
 * 
 * 🚨 VALIDACIONES:
 * - `orderId` es requerido, de lo contrario lanza error
 * - `productId` es requerido, de lo contrario lanza error
 * - `amount` debe ser mayor que 0, caso contrario lanza error
 * - `unitPrice` debe ser mayor que 0, caso contrario lanza error
 * 
 * CASOS DE USO TÍPICOS:
 * - Representar un producto dentro de un pedido
 * - Calcular subtotales y luego el total de un pedido
 * - Validar la existencia de stock antes de confirmar el pedido
 * 
 * 🔄 RELACIÓN CON OTRAS ENTIDADES:
 * - `orderId` → Relación con Order (un pedido puede tener múltiples detalles)
 * - `productId` → Relación con Product (un detalle corresponde a un producto)
 * 
 * 🔐 CONSIDERACIONES:
 * - El subtotal debe calcularse de manera consistente (ej. en el servicio o repositorio)
 * - Evitar inconsistencias si el precio del producto cambia después de crear el pedido
 */

class OrderDetails {
  /**
   * Constructor de la entidad OrderDetails
   * @param {Object} params - Parámetros para construir el detalle de pedido
   * @param {string} params.id - Identificador único del detalle
   * @param {string} params.orderId - ID del pedido al que pertenece este detalle
   * @param {string} params.productId - ID del producto incluido en el detalle
   * @param {number} params.amount - Cantidad de unidades solicitadas (debe ser > 0)
   * @param {number} params.unitPrice - Precio unitario del producto (debe ser > 0)
   * @param {number} params.subtotal - Subtotal del detalle (amount * unitPrice)
   * @throws {Error} - Si orderId, productId, amount o unitPrice no son válidos
   */
  constructor({ id, orderId, productId, amount, unitPrice, subtotal }) {
    if(!orderId) throw new Error("❌ ID de orden inválido ❌");

    if(!productId) throw new Error("❌ ID del producto inválido ❌");

    if(!amount || amount < 0) throw new Error("❌ Cantidad inválida ❌");

    if(!unitPrice || unitPrice < 0) throw new Error("❌ Precio unitario inválido ❌");

    this.id = id;
    this.orderId = orderId;
    this.productId = productId;
    this.amount = amount;
    this.unitPrice = unitPrice;
    this.subtotal = subtotal;
  }
}

export default OrderDetails;
