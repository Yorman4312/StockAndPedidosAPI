/**
 * CREATEPRODUCT.JS - CASO DE USO PARA CREACIÓN DE PRODUCTOS
 * =========================================================
 * 
 * Este caso de uso maneja la creación de nuevos productos en el sistema
 * de e-commerce. Los productos son entidades fundamentales que se relacionan
 * con pedidos a través de OrderDetails y mantienen control de inventario.
 * 
 * Funcionalidades principales:
 * - Creación de productos con validación de estructura
 * - Inicialización de stock de inventario
 * - Abstracción de la capa de persistencia
 * - Aplicación de reglas de negocio mediante entidad de dominio
 * 
 * CAMPOS DEL PRODUCTO:
 * - name: Nombre del producto (único, requerido)
 * - description: Descripción detallada del producto
 * - price: Precio de venta (número decimal, positivo)
 * - stock: Cantidad disponible en inventario (número entero, no negativo)
 * - category: Categoría del producto para clasificación
 * 
 * RELACIONES EN EL SISTEMA:
 * - Product → OrderDetails: Un producto puede estar en múltiples detalles
 * - El stock se gestiona automáticamente según el estado de los pedidos
 * - Los precios se preservan históricamente en OrderDetails
 * 
 * IMPLICACIONES DE NEGOCIO:
 * - El stock inicial define la disponibilidad del producto
 * - El precio puede cambiar sin afectar pedidos existentes
 * - La categoría permite organización y filtrado de productos
 * 
 * CONSIDERACIONES DE VALIDACIÓN:
 * - El precio debe ser mayor que 0
 * - El stock no puede ser negativo
 * - El nombre debe ser único (validación en repositorio/BD)
 * - Todos los campos requeridos deben estar presentes
 * 
 * Patrón de diseño: Clean Architecture / Use Case Pattern
 * Principio SOLID: Single Responsibility Principle
 */

import Product from "../../../domain/entities/Product.js";

/**
 * CLASE CREATEPRODUCT - CASO DE USO
 * =================================
 * 
 * Maneja la creación de productos aplicando validaciones de dominio
 * y coordinando la persistencia a través del repositorio correspondiente.
 */
export default class CreateProduct {
  /**
   * CONSTRUCTOR
   * ===========
   * 
   * Inicializa el caso de uso con la dependencia del repositorio
   * de productos mediante inyección de dependencias.
   * 
   * @param {Object} productRepository - Repositorio para operaciones CRUD de productos
   *                                   Debe implementar el método create()
   */
  constructor(productRepository) {
    this.productRepository = productRepository;
  }

  /**
   * EXECUTE - MÉTODO PRINCIPAL DE EJECUCIÓN
   * =======================================
   * 
   * Ejecuta la creación de un nuevo producto con validación de dominio
   * y estructuración adecuada para persistencia.
   * 
   * Proceso completo:
   * 1. Creación de entidad Product con validaciones de dominio
   * 2. Extracción de campos validados de la entidad
   * 3. Estructuración de datos para persistencia
   * 4. Guardado en base de datos a través del repositorio
   * 5. Retorno del producto creado con ID generado
   * 
   * VALIDACIONES APLICADAS (via entidad Product):
   * - Presencia de campos requeridos
   * - Tipos de datos correctos
   * - Rangos válidos (precio > 0, stock >= 0)
   * - Formato adecuado de strings
   * 
   * INICIALIZACIÓN DE INVENTARIO:
   * - El stock inicial se establece al crear el producto
   * - Este stock será gestionado automáticamente por los pedidos
   * - Status true: descuenta stock
   * - Status false: restaura stock
   * 
   * @param {Object} productData - Datos del producto a crear
   * @param {string} productData.name - Nombre del producto (único, requerido)
   * @param {string} productData.description - Descripción del producto
   * @param {number} productData.price - Precio de venta (mayor que 0)
   * @param {number} productData.stock - Stock inicial (mayor o igual a 0)
   * @param {string} productData.category - Categoría del producto
   * 
   * @returns {Promise<Object>} Producto creado con ID generado y todos sus campos
   * 
   * @throws {Error} Si faltan datos requeridos, tipos incorrectos o violación de reglas
   * 
   * @example
   * // Crear un producto básico
   * const createProduct = new CreateProduct(productRepository);
   * 
   * const productData = {
   *   name: "iPhone 15 Pro",
   *   description: "Smartphone Apple con cámara profesional de 48MP",
   *   price: 999.99,
   *   stock: 50,
   *   category: "Smartphones"
   * };
   * 
   * const newProduct = await createProduct.execute(productData);
   * console.log(`Producto creado con ID: ${newProduct._id}`);
   * 
   * @example
   * // Crear producto con stock inicial cero (pre-venta)
   * const preOrderProduct = {
   *   name: "Samsung Galaxy S25",
   *   description: "Próximo flagship de Samsung (pre-venta)",
   *   price: 1199.99,
   *   stock: 0, // Sin stock inicial para pre-venta
   *   category: "Smartphones"
   * };
   * 
   * const result = await createProduct.execute(preOrderProduct);
   * // El producto se crea pero no está disponible hasta que se agregue stock
   * 
   * @example
   * // Manejo de errores de validación
   * try {
   *   const invalidProduct = {
   *     name: "Producto Test",
   *     description: "Descripción",
   *     price: -10, // ❌ Precio negativo inválido
   *     stock: 100,
   *     category: "Test"
   *   };
   *   
   *   await createProduct.execute(invalidProduct);
   * } catch (error) {
   *   console.error('Error de validación:', error.message);
   *   // La entidad Product debería lanzar error por precio negativo
   * }
   * 
   * @example
   * // Resultado típico de producto creado
   * // {
   * //   _id: "64a1b2c3d4e5f6789abcdef0",
   * //   name: "iPhone 15 Pro",
   * //   description: "Smartphone Apple...",
   * //   price: 999.99,
   * //   stock: 50,
   * //   category: "Smartphones",
   * //   createdAt: "2024-01-15T10:30:00Z",
   * //   updatedAt: "2024-01-15T10:30:00Z"
   * // }
   */
  async execute(productData) {
    /**
     * PASO 1: VALIDACIÓN Y CREACIÓN DE ENTIDAD DE DOMINIO
     * ===================================================
     * 
     * Se crea una instancia de la entidad Product que aplicará
     * todas las validaciones de dominio definidas en la entidad.
     * 
     * La entidad puede lanzar excepciones si:
     * - Faltan campos requeridos
     * - Los tipos de datos son incorrectos
     * - Los valores están fuera de rangos válidos
     * - Se violan reglas de negocio
     */
    const product = new Product(productData);

    /**
     * PASO 2: EXTRACCIÓN DE CAMPOS VALIDADOS
     * ======================================
     * 
     * Se extraen los campos de la entidad ya validada
     * usando destructuring para mayor claridad y seguridad
     */
    const { name, description, price, stock, category } = product;

    /**
     * PASO 3: ESTRUCTURACIÓN PARA PERSISTENCIA
     * ========================================
     * 
     * Se crea el objeto que será persistido en la base de datos,
     * incluyendo solo los campos necesarios y validados
     */
    const productToSave = {
      name,
      description,
      price,
      stock,
      category
    };

    /**
     * PASO 4: PERSISTENCIA Y RETORNO
     * ==============================
     * 
     * Se delega la creación al repositorio y se retorna el resultado.
     * El repositorio agregará campos automáticos como:
     * - _id: ID único generado
     * - createdAt: Timestamp de creación
     * - updatedAt: Timestamp de última actualización
     */
    return await this.productRepository.create(productToSave);
  }
}