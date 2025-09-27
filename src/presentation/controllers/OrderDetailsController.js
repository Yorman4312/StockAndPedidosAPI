import CreateOrderDetails from "../../application/use-cases/orderDetails/CreateOrderDetails.js";
import GetOrderDetails from "../../application/use-cases/orderDetails/GetOrderDetails.js";
import GetOrderDetailsById from "../../application/use-cases/orderDetails/GetOrderDetailsById.js";
import UpdateOrderDetails from "../../application/use-cases/orderDetails/UpdateOrderDetails.js";
import DeleteOrderDetails from "../../application/use-cases/orderDetails/DeleteOrderDetails.js";

import OrderDetailsRepositoryMongo from "../../infrastructure/repositories/OrderDetailsRepositoryMongo.js";

const orderDetailsRepository = new OrderDetailsRepositoryMongo();

export const createOrderDetails = async (req, res) => {
  try {
    const createOrderDetails = new CreateOrderDetails(orderDetailsRepository);
    const orderDetails = await createOrderDetails.execute(req.body);
    res.status(201).json(orderDetails);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getOrderDetails = async (req, res) => {
  try {
    const getOrderDetails = GetOrderDetails(orderDetailsRepository);
    const orderDetails = await getOrderDetails.execute();
    res.json(orderDetails);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getOrderDetailsById = async (req, res) => {
  try {
    const getOrderDetailsById = new GetOrderDetailsById(orderDetailsRepository);
    const orderDetails = await getOrderDetailsById.execute(req.params.id);
    if(!orderDetails) return res.status(404).json({ message: "Pedido no encontrado" });
    res.json(orderDetails);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const updateOrderDetails = async (req, res) => {
  try {
    const updateOrderDetails = new UpdateOrderDetails(orderDetailsRepository);
    const orderDetails = await updateOrderDetails.execute(req.params.id, req.body);
    if(!orderDetails) return res.status(404).json({ message: "Pedido no encontrado" });
    res.json(orderDetails);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const deleteOrderDetails = async (req, res) => {
  try {
    const deleteOrderDetails = new DeleteOrderDetails(orderDetailsRepository);
    const result = await deleteOrderDetails.execute(req.params.id);
    if(!result) return res.status(404).json({ message: "Pedido no encontrado" });
    res.json({ message: "✅ Pedido eliminado correctamente ✅" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};