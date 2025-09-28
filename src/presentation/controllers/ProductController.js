/**
 * Controlador para manejar operaciones sobre productos.
 *
 * Conecta la capa de presentación con los casos de uso de aplicación,
 * gestionando la lógica de creación, consulta, actualización y eliminación de productos.
 */

import CreateProduct from "../../application/use-cases/product/CreateProduct.js";
import GetProduct from "../../application/use-cases/product/GetProduct.js";
import GetProductById from "../../application/use-cases/product/GetProductById.js";
import UpdateProduct from "../../application/use-cases/product/UpdateProduct.js";
import DeleteProduct from "../../application/use-cases/product/DeleteProduct.js";

import ProductRepositoryMongo from "../../infrastructure/repositories/ProductRepositoryMongo.js";

// Instancia del repositorio de productos
const productRepository = new ProductRepositoryMongo();

/**
 * Crea un nuevo producto.
 *
 * @route POST /products
 * @param {Object} req - Objeto de solicitud con los datos del producto en el body.
 * @param {Object} res - Objeto de respuesta con el producto creado.
 */
export const createProduct = async (req, res) => {
  try {
    const createProduct = new CreateProduct(productRepository);
    const product = await createProduct.execute(req.body);
    res.status(201).json(product);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/**
 * Obtiene todos los productos registrados.
 *
 * @route GET /products
 * @param {Object} req - Objeto de solicitud.
 * @param {Object} res - Objeto de respuesta con la lista de productos.
 */
export const getProduct = async (req, res) => {
  try {
    const getProduct = new GetProduct(productRepository);
    const product = await getProduct.execute();
    res.json(product);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/**
 * Obtiene un producto por su ID.
 *
 * @route GET /products/:id
 * @param {Object} req - Objeto de solicitud con el ID en los parámetros.
 * @param {Object} res - Objeto de respuesta con el producto encontrado o error 404.
 */
export const getProductById = async (req, res) => {
  try {
    const getProductById = new GetProductById(productRepository);
    const product = await getProductById.execute(req.params.id);
    if (!product) return res.status(404).json({ message: "Producto no encontrado" });
    res.json(product);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/**
 * Actualiza un producto por su ID.
 *
 * @route PUT /products/:id
 * @param {Object} req - Objeto de solicitud con el ID en los parámetros y datos en el body.
 * @param {Object} res - Objeto de respuesta con el producto actualizado o error 404.
 */
export const updateProduct = async (req, res) => {
  try {
    const updateProduct = new UpdateProduct(productRepository);
    const product = await updateProduct.execute(req.params.id, req.body);
    if (!product) return res.status(404).json({ message: "Producto no encontrado" });
    res.json(product);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/**
 * Elimina un producto por su ID.
 *
 * @route DELETE /products/:id
 * @param {Object} req - Objeto de solicitud con el ID en los parámetros.
 * @param {Object} res - Objeto de respuesta con mensaje de confirmación o error 404.
 */
export const deleteProduct = async (req, res) => {
  try {
    const deleteProduct = new DeleteProduct(productRepository);
    const result = await deleteProduct.execute(req.params.id);
    if (!result) return res.status(404).json({ message: "Producto no encontrado" });
    res.json({ message: "✅ Producto eliminado correctamente ✅" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
