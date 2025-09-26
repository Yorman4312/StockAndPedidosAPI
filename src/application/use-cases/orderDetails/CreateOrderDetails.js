import OrderDetails from "../../../domain/entities/OrderDetails.js";

export default class CreateOrderDetails {
  constructor(orderDetailsRepository) {
    this.orderDetailsRepository = orderDetailsRepository;
  }

  async execute(orderDetailsData) {
    const orderDetails = new OrderDetails(orderDetailsData);
    const { orderId, productId, amount, unitPrice, subtotal } = orderDetails;

    const orderDetailsToSave = {
      orderId,
      productId,
      amount,
      unitPrice,
      subtotal
    };

    return await this.orderDetailsRepository.create(orderDetailsToSave);
  }
}