class OrderDetails {
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