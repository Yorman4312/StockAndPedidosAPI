/**
 * Controlador para manejar operaciones sobre los detalles de pedidos (OrderDetails).
 * 
 * Se conecta con los casos de uso de la capa de aplicación y utiliza los repositorios
 * de MongoDB para gestionar los detalles de pedidos, productos y órdenes.
 */

import CreateOrderDetails from "../../application/use-cases/orderDetails/CreateOrderDetails.js";
import GetOrderDetails from "../../application/use-cases/orderDetails/GetOrderDetails.js";
import GetOrderDetailsById from "../../application/use-cases/orderDetails/GetOrderDetailsById.js";
import UpdateOrderDetails from "../../application/use-cases/orderDetails/UpdateOrderDetails.js";
import DeleteOrderDetails from "../../application/use-cases/orderDetails/DeleteOrderDetails.js";

import OrderDetailsRepositoryMongo from "../../infrastructure/repositories/OrderDetailsRepositoryMongo.js";
import OrderRepositoryMongo from "../../infrastructure/repositories/OrderRepositoryMongo.js";
import ProductRepositoryMongo from "../../infrastructure/repositories/ProductRepositoryMongo.js";

// Instancias de repositorios
const orderDetailsRepository = new OrderDetailsRepositoryMongo();
const orderRepository = new OrderRepositoryMongo();
const productRepository = new ProductRepositoryMongo();

/**
 * Crea un nuevo detalle de pedido.
 * 
 * @route POST /order-details
 * @param {Object} req - Objeto de solicitud con los datos del detalle de pedido.
 * @param {Object} res - Objeto de respuesta con el resultado de la operación.
 */
export const createOrderDetails = async (req, res) => {
  try {
    const createOrderDetails = new CreateOrderDetails(orderDetailsRepository);
    const orderDetails = await createOrderDetails.execute(req.body);
    res.status(201).json(orderDetails);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/**
 * Obtiene todos los detalles de pedidos.
 * 
 * @route GET /order-details
 * @param {Object} req - Objeto de solicitud.
 * @param {Object} res - Objeto de respuesta con la lista de detalles de pedidos.
 */
export const getOrderDetails = async (req, res) => {
  try {
    const getOrderDetails = new GetOrderDetails(orderDetailsRepository);
    const orderDetails = await getOrderDetails.execute();
    res.json(orderDetails);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/**
 * Obtiene un detalle de pedido por su ID.
 * 
 * @route GET /order-details/:id
 * @param {Object} req - Objeto de solicitud con el ID en los parámetros.
 * @param {Object} res - Objeto de respuesta con el detalle encontrado o error 404.
 */
export const getOrderDetailsById = async (req, res) => {
  try {
    const getOrderDetailsById = new GetOrderDetailsById(orderDetailsRepository);
    const orderDetails = await getOrderDetailsById.execute(req.params.id);
    if (!orderDetails) return res.status(404).json({ message: "Pedido no encontrado" });
    res.json(orderDetails);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/**
 * Actualiza un detalle de pedido por su ID.
 * 
 * @route PUT /order-details/:id
 * @param {Object} req - Objeto de solicitud con el ID en los parámetros y datos en el body.
 * @param {Object} res - Objeto de respuesta con el detalle actualizado o error 404.
 */
export const updateOrderDetails = async (req, res) => {
  try {
    const updateOrderDetails = new UpdateOrderDetails(
      orderDetailsRepository,
      orderRepository,
      productRepository
    );
    
    const orderDetails = await updateOrderDetails.execute(req.params.id, req.body);
    if (!orderDetails) return res.status(404).json({ message: "Pedido no encontrado" });
    res.json(orderDetails);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/**
 * Elimina un detalle de pedido por su ID.
 * 
 * @route DELETE /order-details/:id
 * @param {Object} req - Objeto de solicitud con el ID en los parámetros.
 * @param {Object} res - Objeto de respuesta con mensaje de confirmación o error 404.
 */
export const deleteOrderDetails = async (req, res) => {
  try {
    const deleteOrderDetails = new DeleteOrderDetails(orderDetailsRepository);
    const result = await deleteOrderDetails.execute(req.params.id);
    if (!result) return res.status(404).json({ message: "Pedido no encontrado" });
    res.json({ message: "✅ Pedido eliminado correctamente ✅" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
