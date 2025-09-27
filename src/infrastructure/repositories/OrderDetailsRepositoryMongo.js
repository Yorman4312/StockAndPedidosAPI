import { OrderDetailsModel } from "../db/OrderDetailsModel.js";

class OrderDetailsRepositoryMongo {
  async create(orderDetailsData) {
    const orderDetails = new OrderDetailsModel(orderDetailsData);
    return await orderDetails.save();
  }

  async findAll() {
    return await OrderDetailsModel.find();
  }

  async findById(id) {
    return await OrderDetailsModel.findById(id);
  }

  async update(id, orderDetailsData) {
    return await OrderDetailsModel.findByIdAndUpdate(id, orderDetailsData, { new: true });
  }

  async delete(id) {
    return await OrderDetailsModel.findByIdAndDelete(id);
  }
}

export default OrderDetailsRepositoryMongo;