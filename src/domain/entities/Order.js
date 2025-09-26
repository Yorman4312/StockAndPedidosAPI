class Order {
  constructor({ id, userId, total, status, createdAt = new Date() }) {
    if(!userId) throw new Error("❌ ID del usuario inválido ❌");

    if(!status) throw new Error("❌ Estado inválido ❌");

    this.id = id;
    this.userId = userId;
    this.total = total;
    this.status = status;
    this.createdAt = createdAt;
  }
}

export default Order;