export default class DeleteOrder {
  constructor(orderRepository) {
    this.orderRepository = orderRepository;
  }

  async execute(id) {
    return await this.orderRepository.delete(id);
  }
}