/**
 * ORDERCONTROLLER.JS - CONTROLADOR DE PEDIDOS (ORDERS)
 * ====================================================
 *
 * Este controlador expone los endpoints REST relacionados con los pedidos
 * y orquesta la ejecución de los casos de uso correspondientes. Se apoya
 * en los repositorios para interactuar con la base de datos MongoDB.
 *
 * CASOS DE USO INYECTADOS:
 * ------------------------
 * - CreateOrder: Crea un nuevo pedido, genera detalles y actualiza stock de productos.
 * - GetOrder: Obtiene todos los pedidos registrados.
 * - GetOrderById: Busca un pedido específico por su ID.
 * - UpdateOrder: Modifica un pedido existente y ajusta el stock según status.
 * - DeleteOrder: Elimina un pedido.
 *
 * REPOSITORIOS UTILIZADOS:
 * ------------------------
 * - OrderRepositoryMongo: Acceso a pedidos (Orders).
 * - OrderDetailsRepositoryMongo: Acceso a detalles de pedidos (OrderDetails).
 * - ProductRepositoryMongo: Acceso a productos (Products) y stock.
 *
 * ENDPOINTS Y RESPUESTAS:
 * -----------------------
 * - POST   /orders        → Crear un nuevo pedido
 *   - 201 Created → Pedido creado exitosamente
 *   - 500 Internal Server Error → Error al procesar
 *
 * - GET    /orders        → Obtener todos los pedidos
 *   - 200 OK → Lista de pedidos
 *   - 500 Internal Server Error → Error al procesar
 *
 * - GET    /orders/:id    → Obtener pedido por ID
 *   - 200 OK → Pedido encontrado
 *   - 404 Not Found → Pedido no encontrado
 *
 * - PUT    /orders/:id    → Actualizar pedido por ID
 *   - 200 OK → Pedido actualizado
 *   - 404 Not Found → Pedido no encontrado
 *
 * - DELETE /orders/:id    → Eliminar pedido por ID
 *   - 200 OK → Pedido eliminado
 *   - 404 Not Found → Pedido no encontrado
 *
 * CASOS DE USO TÍPICOS:
 * ---------------------
 * - Crear un pedido asociado a un usuario.
 * - Recuperar todos los pedidos o uno específico.
 * - Modificar el estado de un pedido (ej. activar/desactivar).
 * - Eliminar pedidos antiguos o cancelados.
 * - Ajustar stock de productos según status de pedido.
 */

import CreateOrder from "../../application/use-cases/order/CreateOrder.js";
import GetOrder from "../../application/use-cases/order/GetOrder.js";
import GetOrderById from "../../application/use-cases/order/GetOrderById.js";
import UpdateOrder from "../../application/use-cases/order/UpdateOrder.js";
import DeleteOrder from "../../application/use-cases/order/DeleteOrder.js";

import OrderRepositoryMongo from "../../infrastructure/repositories/OrderRepositoryMongo.js";
import OrderDetailsRepositoryMongo from "../../infrastructure/repositories/OrderDetailsRepositoryMongo.js";
import ProductRepositoryMongo from "../../infrastructure/repositories/ProductRepositoryMongo.js";

// Instancias de repositorios (inyección de dependencias)
const orderRepository = new OrderRepositoryMongo();
const orderDetailsRepository = new OrderDetailsRepositoryMongo();
const productRepository = new ProductRepositoryMongo();

/**
 * CREA UN PEDIDO
 * Endpoint: POST /orders
 */
export const createOrder = async (req, res) => {
  try {
    const userId = req.user.id; // Usuario autenticado
    const orderData = {
      ...req.body,
      userId: userId
    };

    const createOrder = new CreateOrder(
      orderRepository,
      orderDetailsRepository,
      productRepository
    );
    const order = await createOrder.execute(orderData);

    res.status(201).json(order);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/**
 * OBTIENE TODOS LOS PEDIDOS
 * Endpoint: GET /orders
 */
export const getOrder = async (req, res) => {
  try {
    const getOrder = new GetOrder(orderRepository);
    const order = await getOrder.execute();
    res.json(order);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/**
 * OBTIENE UN PEDIDO POR ID
 * Endpoint: GET /orders/:id
 */
export const getOrderById = async (req, res) => {
  try {
    const getOrderById = new GetOrderById(orderRepository);
    const order = await getOrderById.execute(req.params.id);

    if (!order) return res.status(404).json({ message: "Pedido no encontrado" });

    res.json(order);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/**
 * ACTUALIZA UN PEDIDO POR ID
 * Endpoint: PUT /orders/:id
 */
export const updateOrder = async (req, res) => {
  try {
    const updateOrder = new UpdateOrder(
      orderRepository,
      orderDetailsRepository,
      productRepository
    );

    const order = await updateOrder.execute(req.params.id, req.body);

    if (!order) return res.status(404).json({ message: "Pedido no encontrado" });

    res.json(order);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/**
 * ELIMINA UN PEDIDO POR ID
 * Endpoint: DELETE /orders/:id
 */
export const deleteOrder = async (req, res) => {
  try {
    const deleteOrder = new DeleteOrder(orderRepository);
    const result = await deleteOrder.execute(req.params.id);

    if (!result) return res.status(404).json({ message: "Pedido no encontrado" });

    res.json({ message: "✅ Pedido eliminado correctamente ✅" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
