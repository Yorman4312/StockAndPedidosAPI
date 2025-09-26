export default class GetOrderById {
  constructor(orderRepository) {
    this.orderRepository = orderRepository;
  }

  async execute(id) {
    return await this.orderRepository.findById(id);
  }
}