import Order from "../../../domain/entities/Order.js";

export default class UpdateOrder {
  constructor(orderRepository) {
    this.orderRepository = orderRepository;
  }

  async execute(id, orderData) {
    const order = new Order(orderData);
    return await this.orderRepository.update(id, order);
  }
}