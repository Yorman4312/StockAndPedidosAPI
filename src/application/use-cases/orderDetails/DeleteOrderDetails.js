export default class DeleteOrderDetails {
  constructor(orderDetailsRepository) {
    this.orderDetailsRepository = orderDetailsRepository;
  }

  async execute(id) {
    return await this.orderDetailsRepository.delete(id);
  }
}