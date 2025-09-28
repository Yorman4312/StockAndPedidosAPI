/**
 * GETPRODUCT.JS - CASO DE USO PARA OBTENER TODOS LOS PRODUCTOS
 * ============================================================
 * 
 * Este caso de uso maneja la recuperación de todos los productos
 * del sistema. Es fundamental para mostrar el catálogo completo
 * y generar reportes de inventario.
 * 
 * Funcionalidades:
 * - Obtención de todos los productos del sistema
 * - Abstracción de la capa de persistencia
 * - Implementación del patrón Use Case
 * 
 * CASOS DE USO TÍPICOS:
 * - Catálogo completo de productos para clientes
 * - Dashboard administrativo de inventario
 * - Reportes de productos y stock disponible
 * - Análisis de catálogo y categorías
 * - Exportación de datos para sistemas externos
 * - Sincronización con plataformas de e-commerce
 * - Generación de feeds para marketing
 * 
 * INFORMACIÓN DISPONIBLE POR PRODUCTO:
 * - Identificación única (_id)
 * - Información básica (name, description)
 * - Datos comerciales (price, category)
 * - Control de inventario (stock actual)
 * - Metadatos (createdAt, updatedAt)
 * 
 * ANÁLISIS POSIBLES CON TODOS LOS PRODUCTOS:
 * - Inventario total por categoría
 * - Productos con stock bajo o agotado
 * - Rango de precios por categoría
 * - Productos más antiguos vs más recientes
 * - Análisis de diversidad de catálogo
 * - Identificación de productos sin movimiento
 * 
 * CONSIDERACIONES DE RENDIMIENTO:
 * 
 * PARA CATÁLOGOS PEQUEÑOS (< 1000 productos):
 * - La implementación actual es óptima
 * - Respuesta rápida y manejo simple
 * - No requiere optimizaciones adicionales
 * 
 * PARA CATÁLOGOS MEDIANOS (1000 - 10000 productos):
 * - Considerar implementar paginación
 * - Agregar filtros por categoría, estado, stock
 * - Implementar caché para consultas frecuentes
 * 
 * PARA CATÁLOGOS GRANDES (> 10000 productos):
 * - Paginación obligatoria
 * - Búsqueda y filtrado avanzado
 * - Proyección de campos (solo campos necesarios)
 * - Índices en base de datos optimizados
 * - Estrategias de caché distribuido
 * - Considerar búsqueda externa (Elasticsearch)
 * 
 * OPTIMIZACIONES RECOMENDADAS:
 * - Paginación: findAll(page, limit)
 * - Filtros: findAll({ category, minPrice, maxPrice, inStock })
 * - Sorting: findAll({ sort: { name: 1, price: -1 } })
 * - Proyección: findAll({ fields: ['name', 'price', 'stock'] })
 * - Caché con TTL para consultas frecuentes
 * 
 * CONSIDERACIONES DE UI/UX:
 * - Para frontend: Implementar lazy loading
 * - Mostrar productos con stock > 0 primero
 * - Categorización y filtros visuales
 * - Búsqueda en tiempo real
 * - Indicadores de stock bajo
 * 
 * Patrón de diseño: Clean Architecture / Use Case Pattern
 * Principio SOLID: Single Responsibility Principle
 */

/**
 * CLASE GETPRODUCT - CASO DE USO
 * ==============================
 * 
 * Caso de uso especializado en la recuperación global de todos
 * los productos. Fundamental para el catálogo del e-commerce
 * y operaciones administrativas.
 */
export default class GetProduct {
  /**
   * CONSTRUCTOR
   * ===========
   * 
   * Inicializa el caso de uso con la dependencia del repositorio
   * de productos mediante inyección de dependencias.
   * 
   * @param {Object} productRepository - Repositorio para operaciones CRUD de productos
   *                                   Debe implementar el método findAll()
   */
  constructor(productRepository) {
    this.productRepository = productRepository;
  }

  /**
   * EXECUTE - MÉTODO PRINCIPAL DE EJECUCIÓN
   * =======================================
   * 
   * Ejecuta la recuperación de todos los productos almacenados en el sistema.
   * 
   * Proceso:
   * 1. Delega la consulta global al repositorio de productos
   * 2. Retorna todos los productos encontrados
   * 
   * ESTRUCTURA TÍPICA DE CADA PRODUCTO:
   * {
   *   _id: "64a1b2c3d4e5f6789abcdef0",
   *   name: "iPhone 15 Pro",
   *   description: "Smartphone Apple con cámara profesional",
   *   price: 999.99,
   *   stock: 25,                                    // Stock actual disponible
   *   category: "Smartphones",
   *   createdAt: "2024-01-15T10:30:00Z",
   *   updatedAt: "2024-01-20T14:22:00Z"
   * }
   * 
   * ESTADOS POSIBLES DEL STOCK:
   * - stock > 0: Producto disponible para venta
   * - stock = 0: Producto agotado, no se puede vender
   * - stock < 0: Inconsistencia (no debería ocurrir)
   * 
   * INTERPRETACIÓN DE STOCK EN EL SISTEMA:
   * - El stock se actualiza automáticamente con los pedidos
   * - Pedido status: true → descuenta stock
   * - Pedido status: false → restaura stock
   * - Es el inventario en tiempo real
   * 
   * ANÁLISIS ÚTILES CON TODOS LOS PRODUCTOS:
   * 
   * 1. INVENTARIO POR CATEGORÍA:
   *    - Agrupar por category, sumar stock
   *    - Identificar categorías con más/menos inventario
   * 
   * 2. PRODUCTOS CON STOCK CRÍTICO:
   *    - Filtrar productos con stock < umbral_mínimo
   *    - Generar alertas de reabastecimiento
   * 
   * 3. ANÁLISIS DE PRECIOS:
   *    - Precio promedio por categoría
   *    - Rango de precios del catálogo
   *    - Productos más/menos costosos
   * 
   * 4. ANÁLISIS TEMPORAL:
   *    - Productos más recientes (createdAt)
   *    - Productos sin actualizar (updatedAt)
   * 
   * @returns {Promise<Array>} Array con todos los productos del sistema
   *                          Cada elemento es un objeto producto completo
   * 
   * @throws {Error} Si hay errores de conexión a la base de datos
   * 
   * @example
   * // Uso básico para catálogo
   * const getProduct = new GetProduct(productRepository);
   * const allProducts = await getProduct.execute();
   * 
   * console.log(`Total de productos: ${allProducts.length}`);
   * 
   * // Filtrar productos disponibles para mostrar en tienda
   * const availableProducts = allProducts.filter(product => product.stock > 0);
   * console.log(`Productos disponibles: ${availableProducts.length}`);
   * 
   * @example
   * // Análisis de inventario
   * const allProducts = await getProduct.execute();
   * 
   * // Productos con stock bajo (< 10 unidades)
   * const lowStockProducts = allProducts.filter(product => {
   *   return product.stock > 0 && product.stock < 10;
   * });
   * 
   * console.log('Productos con stock bajo:', lowStockProducts.map(p => ({
   *   name: p.name,
   *   stock: p.stock
   * })));
   * 
   * @example
   * // Análisis por categorías
   * const allProducts = await getProduct.execute();
   * 
   * const categoryStats = {};
   * allProducts.forEach(product => {
   *   if (!categoryStats[product.category]) {
   *     categoryStats[product.category] = {
   *       count: 0,
   *       totalStock: 0,
   *       avgPrice: 0,
   *       totalValue: 0
   *     };
   *   }
   *   
   *   const cat = categoryStats[product.category];
   *   cat.count++;
   *   cat.totalStock += product.stock;
   *   cat.totalValue += product.price;
   * });
   * 
   * // Calcular promedios
   * Object.keys(categoryStats).forEach(category => {
   *   categoryStats[category].avgPrice = 
   *     categoryStats[category].totalValue / categoryStats[category].count;
   * });
   * 
   * console.log('Estadísticas por categoría:', categoryStats);
   * 
   * @example
   * // Implementación mejorada para sistemas grandes (pseudocódigo)
   * // class GetProduct {
   * //   async execute(options = {}) {
   * //     const {
   * //       page = 1,
   * //       limit = 50,
   * //       category,
   * //       inStock = null,
   * //       sortBy = 'name',
   * //       sortOrder = 'asc'
   * //     } = options;
   * //     
   * //     return await this.productRepository.findAll({
   * //       page,
   * //       limit,
   * //       filters: { category, inStock },
   * //       sort: { [sortBy]: sortOrder === 'asc' ? 1 : -1 }
   * //     });
   * //   }
   * // }
   * 
   * @example
   * // Uso con consideraciones de rendimiento
   * try {
   *   const allProducts = await getProduct.execute();
   *   
   *   if (allProducts.length > 5000) {
   *     console.warn('Catálogo muy grande, considerar implementar paginación');
   *     // Procesar en chunks para evitar problemas de memoria
   *     const chunkSize = 1000;
   *     for (let i = 0; i < allProducts.length; i += chunkSize) {
   *       const chunk = allProducts.slice(i, i + chunkSize);
   *       // Procesar chunk
   *     }
   *   }
   *   
   *   return allProducts;
   * } catch (error) {
   *   console.error('Error al obtener productos:', error.message);
   *   throw error;
   * }
   */
  async execute() {
    return await this.productRepository.findAll();
  }
}