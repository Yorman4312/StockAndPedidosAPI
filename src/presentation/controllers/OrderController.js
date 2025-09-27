import CreateOrder from "../../application/use-cases/order/CreateOrder.js";
import GetOrder from "../../application/use-cases/order/GetOrder.js";
import GetOrderById from "../../application/use-cases/order/GetOrderById.js";
import UpdateOrder from "../../application/use-cases/order/UpdateOrder.js";
import DeleteOrder from "../../application/use-cases/order/DeleteOrder.js";

import OrderRepositoryMongo from "../../infrastructure/repositories/OrderRepositoryMongo.js";

const orderRepository = new OrderRepositoryMongo();

export const createOrder = async (req, res) => {
  try {
    const createOrder = new CreateOrder(orderRepository);
    const order = await createOrder.execute(req.body);
    res.status(201).json(order);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getOrder = async (req, res) => {
  try {
    const getOrder = GetOrder(orderRepository);
    const order = await getOrder.execute();
    res.json(order);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getOrderById = async (req, res) => {
  try {
    const getOrderById = new GetOrderById(orderRepository);
    const order = await getOrderById.execute(req.params.id);
    if(!order) return res.status(404).json({ message: "Pedido no encontrado" });
    res.json(order);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const updateOrder = async (req, res) => {
  try {
    const updateOrder = new UpdateOrder(orderRepository);
    const order = await updateOrder.execute(req.params.id, req.body);
    if(!order) return res.status(404).json({ message: "Pedido no encontrado" });
    res.json(order);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const deleteOrder = async (req, res) => {
  try {
    const deleteOrder = new DeleteOrder(orderRepository);
    const result = await deleteOrder.execute(req.params.id);
    if(!result) return res.status(404).json({ message: "Pedido no encontrado" });
    res.json({ message: "✅ Pedido eliminado correctamente ✅" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};