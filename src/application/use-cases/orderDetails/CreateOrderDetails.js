/**
 * CREATEORDERDETAILS.JS - CASO DE USO PARA CREACIÓN DE DETALLES DE PEDIDO
 * =======================================================================
 * 
 * Este caso de uso maneja la creación individual de detalles de pedido,
 * que representan la relación many-to-many entre pedidos y productos.
 * Incluye cálculos automáticos de subtotales y validación de datos.
 * 
 * Funcionalidades principales:
 * - Creación de detalles de pedido individuales
 * - Cálculo automático de subtotales (unitPrice * amount)
 * - Validación y estructuración de datos
 * - Abstracción de la capa de persistencia
 * 
 * RELACIÓN EN EL MODELO DE DATOS:
 * - OrderDetails pertenece a un Order (orderId)
 * - OrderDetails pertenece a un Product (productId)
 * - Almacena cantidad, precio unitario y subtotal del momento de la compra
 * - Permite historiales de precios independientes del precio actual del producto
 * 
 * DIFERENCIA CON CREATEORDER:
 * - CreateOrder: Crea el pedido completo con múltiples detalles en lote
 * - CreateOrderDetails: Crea un detalle individual (usado para agregar productos después)
 * 
 * Patrón de diseño: Clean Architecture / Use Case Pattern
 * Principio SOLID: Single Responsibility Principle
 */

import OrderDetails from "../../../domain/entities/OrderDetails.js";

/**
 * CLASE CREATEORDERDETAILS - CASO DE USO
 * ======================================
 * 
 * Maneja la creación de detalles de pedido individuales con
 * cálculos automáticos y validación de estructura de datos.
 */
export default class CreateOrderDetails {
  /**
   * CONSTRUCTOR
   * ===========
   * 
   * Inicializa el caso de uso con la dependencia del repositorio
   * de detalles de pedido mediante inyección de dependencias.
   * 
   * @param {Object} orderDetailsRepository - Repositorio para operaciones CRUD de detalles
   *                                        Debe implementar el método create()
   */
  constructor(orderDetailsRepository) {
    this.orderDetailsRepository = orderDetailsRepository;
  }

  /**
   * EXECUTE - MÉTODO PRINCIPAL DE EJECUCIÓN
   * =======================================
   * 
   * Ejecuta la creación de un detalle de pedido con cálculos automáticos
   * y validación de estructura de datos.
   * 
   * Proceso completo:
   * 1. Extracción de datos principales del detalle
   * 2. Cálculo automático del subtotal
   * 3. Estructuración de datos completos
   * 4. Creación de entidad OrderDetails
   * 5. Preparación de datos para persistencia
   * 6. Guardado en base de datos
   * 
   * CÁLCULOS AUTOMÁTICOS:
   * - Subtotal = unitPrice * amount
   * - Este cálculo asegura consistencia en los datos
   * - Evita errores de cálculo desde el cliente
   * 
   * INTEGRIDAD DE DATOS:
   * - Se almacena el precio unitario del momento de la compra
   * - Esto permite mantener historiales de precios
   * - Los cambios futuros en el precio del producto no afectan pedidos anteriores
   * 
   * @param {Object} orderDetailsData - Datos del detalle de pedido
   * @param {string} orderDetailsData.orderId - ID del pedido al que pertenece
   * @param {string} orderDetailsData.productId - ID del producto
   * @param {number} orderDetailsData.amount - Cantidad del producto
   * @param {number} orderDetailsData.unitPrice - Precio unitario en el momento de la compra
   * 
   * @returns {Promise<Object>} Detalle de pedido creado con todos sus campos
   * 
   * @throws {Error} Si faltan datos requeridos o hay errores de base de datos
   * 
   * @example
   * // Crear un detalle de pedido
   * const createOrderDetails = new CreateOrderDetails(orderDetailsRepository);
   * 
   * const detailData = {
   *   orderId: "64a1b2c3d4e5f6789abcdef0",
   *   productId: "64a1b2c3d4e5f6789abcdef1", 
   *   amount: 2,
   *   unitPrice: 25.99
   * };
   * 
   * const result = await createOrderDetails.execute(detailData);
   * // Resultado incluirá subtotal: 51.98 (25.99 * 2)
   * 
   * @example
   * // Caso de uso típico: Agregar producto a pedido existente
   * const newDetail = await createOrderDetails.execute({
   *   orderId: existingOrderId,
   *   productId: selectedProductId,
   *   amount: quantity,
   *   unitPrice: currentProductPrice
   * });
   */
  async execute(orderDetailsData) {
    /**
     * PASO 1: EXTRACCIÓN DE DATOS PRINCIPALES
     * =======================================
     * 
     * Se extraen los campos esenciales del detalle de pedido
     * usando destructuring para mayor claridad
     */
    const { orderId, productId, amount, unitPrice } = orderDetailsData;

    /**
     * PASO 2: CÁLCULO AUTOMÁTICO DEL SUBTOTAL
     * =======================================
     * 
     * El subtotal se calcula automáticamente para:
     * - Asegurar consistencia matemática
     * - Evitar manipulaciones desde el cliente
     * - Mantener la integridad de los cálculos financieros
     */
    const calculatedSubtotal = unitPrice * amount;

    /**
     * PASO 3: ESTRUCTURACIÓN DE DATOS COMPLETOS
     * =========================================
     * 
     * Se crea el objeto completo con todos los campos
     * incluyendo el subtotal calculado automáticamente
     */
    const finalOrderDetailsData = {
      orderId,
      productId,
      amount,
      unitPrice,
      subtotal : calculatedSubtotal
    };

    /**
     * PASO 4: CREACIÓN DE ENTIDAD DE DOMINIO
     * ======================================
     * 
     * Se instancia la entidad OrderDetails para validar
     * la estructura y aplicar reglas de negocio si las hubiera
     */
    const orderDetails = new OrderDetails(finalOrderDetailsData);

    /**
     * PASO 5: PREPARACIÓN PARA PERSISTENCIA
     * ====================================
     * 
     * Se extraen los datos de la entidad para crear el objeto
     * que será persistido en la base de datos
     */
    const orderDetailsToSave = {
      orderId : orderDetails.orderId,
      productId : orderDetails.productId,
      amount : orderDetails.amount,
      unitPrice : orderDetails.unitPrice,
      subtotal : orderDetails.subtotal
    }

    /**
     * PASO 6: PERSISTENCIA EN BASE DE DATOS
     * ====================================
     * 
     * Se delega la creación al repositorio correspondiente
     * y se retorna el resultado de la operación
     */
    return await this.orderDetailsRepository.create(orderDetailsToSave);
  }
}