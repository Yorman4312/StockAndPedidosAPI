import { OrderModel } from "../db/OrderModel.js";

class OrderRepositoryMongo {
  async create(orderData) {
    const order = new OrderModel(orderData);
    return await order.save();
  }

  async findAll() {
    return await OrderModel.find();
  }

  async findById(id) {
    return await OrderModel.findById(id);
  }

  async update(id, orderData) {
    return await OrderModel.findByIdAndUpdate(id, orderData, { new: true });
  }

  async delete(id) {
    return await OrderModel.findByIdAndDelete(id);
  }
}

export default OrderRepositoryMongo;