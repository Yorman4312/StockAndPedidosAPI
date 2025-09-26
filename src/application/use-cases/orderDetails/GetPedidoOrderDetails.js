export default class GetOrderDetailsById {
  constructor(orderDetailsRepository) {
    this.orderDetailsRepository = orderDetailsRepository;
  }

  async execute(id) {
    return await this.orderDetailsRepository.findById(id);
  }
}