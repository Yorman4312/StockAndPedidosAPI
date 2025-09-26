import OrderDetails from "../../../domain/entities/OrderDetails.js";

export default class UpdateOrderDetails {
  constructor(orderDetailsRepository) {
    this.orderDetailsRepository = orderDetailsRepository;
  }

  async execute(id, orderDetailsData) {
    const orderDetails = new OrderDetails(orderDetailsData);
    return await this.orderDetailsRepository.update(id, orderDetails);
  }
}