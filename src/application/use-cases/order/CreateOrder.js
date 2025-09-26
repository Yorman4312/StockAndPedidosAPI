import Order from "../../../domain/entities/Order.js";

export default class CreateOrder {
  constructor(orderRepository) {
    this.orderRepository = orderRepository;
  }

  async execute(orderData) {
    const order = new Order(orderData);
    const { userId, total, status, createdAt } = order;

    const orderToSave = {
      userId,
      total,
      status,
      createdAt
    };

    return await this.orderRepository.create(orderToSave);
  }
}