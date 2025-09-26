export default class GetOrder {
  constructor(orderRepository) {
    this.orderRepository = orderRepository;
  }

  async execute() {
    return await this.orderRepository.findAll();
  }
}