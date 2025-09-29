/**
 * SERVER.JS - CONFIGURACIÓN DEL SERVIDOR EXPRESS
 * ==============================================
 * 
 * Este archivo configura y define toda la estructura del servidor Express,
 * incluyendo middlewares globales y el enrutamiento principal de la API.
 * Es el núcleo de configuración que conecta todas las piezas de la aplicación.
 * 
 * Funcionalidades principales:
 * - Configuración de Express con middlewares esenciales
 * - Configuración de CORS para acceso cross-origin
 * - Definición de rutas principales de la API
 * - Organización modular de endpoints por funcionalidad
 * - Manejo de preflight requests (OPTIONS)
 * 
 * Estructura de la API RESTful:
 * ┌─────────────────────────────────────────────────────────────┐
 * │ /api/users         -> Gestión de usuarios (CRUD)            │
 * │ /api/products      -> Gestión de productos (CRUD + Stock)   │
 * │ /api/order         -> Gestión de pedidos (CRUD + Estado)    │
 * │ /api/orderDetails  -> Gestión de detalles (CRUD)            │
 * │ /api/auth/login    -> Autenticación y JWT                   │
 * └─────────────────────────────────────────────────────────────┘
 * 
 * Arquitectura:
 * - Patrón MVC adaptado con Clean Architecture
 * - Separación de responsabilidades (routes, controllers, use cases)
 * - Inyección de dependencias para testabilidad
 * - Middlewares reutilizables
 * 
 * Tecnologías utilizadas:
 * - Express.js: Framework web minimalista
 * - CORS: Control de acceso cross-origin
 * - JSON: Formato de intercambio de datos
 */

import express from "express";

// Importación de middleware CORS configurado para desarrollo/producción
import corsMiddleware from "./middlewares/corsMiddleware.js";

// ============================================================
// IMPORTACIÓN DE RUTAS MODULARES
// ============================================================
// Cada módulo de rutas encapsula los endpoints relacionados
// con una entidad específica del sistema, siguiendo el principio
// de responsabilidad única y facilitando el mantenimiento.

/**
 * RUTAS DE USUARIOS (userRoutes)
 * ==============================
 * Gestión completa del ciclo de vida de usuarios:
 * - POST /api/users: Registro de nuevos usuarios con contraseña encriptada
 * - GET /api/users: Obtener lista de todos los usuarios (admin)
 * - GET /api/users/:id: Obtener usuario específico por ID
 * - PUT /api/users/:id: Actualizar datos de usuario
 * - DELETE /api/users/:id: Eliminar usuario (consideraciones de integridad)
 */
import userRoutes from "./routes/userRoutes.js";

/**
 * RUTAS DE PRODUCTOS (productRoutes)
 * ==================================
 * Gestión de catálogo de productos con control automático de stock:
 * - POST /api/products: Crear nuevo producto con stock inicial
 * - GET /api/products: Obtener todos los productos del catálogo
 * - GET /api/products/:id: Obtener producto específico por ID
 * - PUT /api/products/:id: Actualizar producto (precio, stock, etc.)
 * - DELETE /api/products/:id: Eliminar producto (validar referencias)
 * 
 * Nota: El stock se gestiona automáticamente según estado de pedidos
 */
import productRoutes from "./routes/productRoutes.js";

/**
 * RUTAS DE PEDIDOS (orderRoutes)
 * ==============================
 * Gestión de pedidos con lógica de negocio de inventario:
 * - POST /api/order: Crear pedido (descuenta stock automáticamente)
 * - GET /api/order: Obtener todos los pedidos del sistema
 * - GET /api/order/:id: Obtener pedido específico con detalles
 * - PUT /api/order/:id: Actualizar pedido (maneja cambios de estado)
 * - DELETE /api/order/:id: Eliminar pedido
 * 
 * Lógica de Stock:
 * - status: true → Stock descontado (pedido confirmado)
 * - status: false → Stock restaurado (pedido cancelado)
 */
import orderRoutes from "./routes/orderRoutes.js";

/**
 * RUTAS DE DETALLES DE PEDIDOS (orderDetailsRoutes)
 * =================================================
 * Gestión de la relación many-to-many entre pedidos y productos:
 * - POST /api/orderDetails: Crear detalle individual (agregar producto)
 * - GET /api/orderDetails: Obtener todos los detalles del sistema
 * - GET /api/orderDetails/:id: Obtener detalle específico por ID
 * - PUT /api/orderDetails/:id: Actualizar cantidad (ajusta stock y totales)
 * - DELETE /api/orderDetails/:id: Eliminar detalle (considerar recalcular total)
 * 
 * Cada detalle almacena:
 * - Relación con pedido y producto
 * - Cantidad, precio unitario histórico y subtotal
 */
import orderDetailsRoutes from "./routes/orderDetailsRoutes.js";

/**
 * RUTAS DE AUTENTICACIÓN (loginRoutes)
 * ====================================
 * Gestión de autenticación y generación de tokens:
 * - POST /api/auth/login: Autenticar usuario y generar JWT
 * 
 * Proceso de login:
 * 1. Recibe email y contraseña
 * 2. Valida credenciales (compara hash de contraseña)
 * 3. Genera token JWT con información del usuario
 * 4. Retorna token para uso en peticiones autenticadas
 * 
 * El token JWT debe incluirse en el header Authorization de peticiones protegidas
 */
import loginRoutes from "./routes/loginRoutes.js";

/**
 * INICIALIZACIÓN DE LA APLICACIÓN EXPRESS
 * =======================================
 * 
 * Se crea la instancia principal de Express que servirá
 * como aplicación web y API RESTful.
 */
const app = express();

/**
 * CONFIGURACIÓN DE MIDDLEWARES GLOBALES
 * =====================================
 * 
 * Los middlewares se aplican en orden y procesan todas las peticiones
 * que llegan al servidor antes de alcanzar las rutas específicas.
 * 
 * ORDEN CRÍTICO DE MIDDLEWARES:
 * 1. CORS middleware (primero para preflight)
 * 2. OPTIONS handler (manejo explícito de preflight)
 * 3. JSON parser (antes de rutas que reciben datos)
 * 4. Rutas de la aplicación
 */

/**
 * MIDDLEWARE CORS - CONTROL DE ACCESO CROSS-ORIGIN
 * ================================================
 * 
 * Aplica políticas CORS a todas las rutas de la aplicación.
 * Permite que aplicaciones cliente desde dominios específicos
 * puedan realizar peticiones a la API.
 * 
 * Configuración actual (ver corsMiddleware.js):
 * - Origen: http://localhost:5173 (Vite dev server)
 * - Métodos: GET, POST, PUT, DELETE
 * - Headers: Content-Type, Authorization
 * 
 * ⚠️ IMPORTANTE: En producción, cambiar a dominios reales
 */
app.use(corsMiddleware);

/**
 * HANDLER EXPLÍCITO DE PREFLIGHT REQUESTS
 * =======================================
 * 
 * Maneja peticiones OPTIONS para todas las rutas (*).
 * Las peticiones OPTIONS son enviadas automáticamente por
 * navegadores antes de peticiones "complejas" (preflight).
 * 
 * ¿Cuándo se envía OPTIONS?
 * - Peticiones POST, PUT, DELETE con JSON
 * - Peticiones con headers personalizados (Authorization)
 * - Peticiones cross-origin no simples
 * 
 * Este handler asegura que el middleware CORS responda
 * correctamente a todas las peticiones preflight.
 */
app.options(/^\/api\/.*$/, corsMiddleware);

/**
 * MIDDLEWARE JSON PARSER
 * ======================
 * 
 * Parsea automáticamente el body de peticiones HTTP como JSON.
 * 
 * Funcionalidad:
 * - Detecta Content-Type: application/json
 * - Parsea el string JSON del body
 * - Convierte a objeto JavaScript accesible en req.body
 * - Esencial para recibir datos de formularios y APIs
 * 
 * Sin este middleware, req.body sería undefined.
 * 
 * Ejemplo de uso:
 * POST /api/users con body: {"name": "Juan", "email": "juan@email.com"}
 * En el controlador: req.body.name será "Juan"
 */
app.use(express.json());

/**
 * CONFIGURACIÓN DE RUTAS PRINCIPALES
 * =================================
 * 
 * Cada ruta base (path prefix) se dirige a un módulo de rutas
 * específico que maneja todas las operaciones CRUD correspondientes.
 * 
 * Beneficios de esta organización:
 * - Separación clara de responsabilidades
 * - Facilita el mantenimiento y testing
 * - Escalabilidad mediante módulos independientes
 * - Versionado de API más sencillo
 */

/**
 * MONTAJE DE RUTAS DE USUARIOS
 * ============================
 * Todas las rutas que comienzan con /api/users se manejarán
 * en el módulo userRoutes.
 * 
 * Operaciones disponibles:
 * - Registro de usuarios con encriptación de contraseñas
 * - Consulta de usuarios (con control de permisos)
 * - Actualización de perfiles
 * - Eliminación de cuentas (con consideraciones legales)
 */
app.use("/api/users", userRoutes);

/**
 * MONTAJE DE RUTAS DE PRODUCTOS
 * =============================
 * Todas las rutas que comienzan con /api/products se manejarán
 * en el módulo productRoutes.
 * 
 * Características especiales:
 * - CRUD completo de productos
 * - Gestión automática de stock según pedidos
 * - Control de inventario en tiempo real
 * - Validaciones de disponibilidad
 */
app.use("/api/products", productRoutes);

/**
 * MONTAJE DE RUTAS DE PEDIDOS
 * ===========================
 * Todas las rutas que comienzan con /api/order se manejarán
 * en el módulo orderRoutes.
 * 
 * Lógica de negocio crítica:
 * - Creación de pedidos descuenta stock automáticamente
 * - Cambio de estado (true/false) ajusta inventario
 * - Relación con usuarios y detalles de pedidos
 * - Validaciones de stock antes de confirmar
 */
app.use("/api/order", orderRoutes);

/**
 * MONTAJE DE RUTAS DE DETALLES DE PEDIDOS
 * =======================================
 * Todas las rutas que comienzan con /api/orderDetails se manejarán
 * en el módulo orderDetailsRoutes.
 * 
 * Función en el sistema:
 * - Implementa relación many-to-many pedidos-productos
 * - Almacena precios históricos (independientes del precio actual)
 * - Permite análisis detallado de ventas por producto
 * - Facilita reportes y auditorías
 */
app.use("/api/orderDetails", orderDetailsRoutes);

/**
 * MONTAJE DE RUTAS DE AUTENTICACIÓN
 * =================================
 * Todas las rutas que comienzan con /api/auth/login se manejarán
 * en el módulo loginRoutes.
 * 
 * Seguridad implementada:
 * - Validación de credenciales con contraseñas encriptadas
 * - Generación de tokens JWT seguros
 * - Tokens incluyen información de usuario y permisos
 * - Expiración configurable de tokens
 * 
 * Uso del token:
 * - Incluir en header: Authorization: Bearer <token>
 * - Validar en rutas protegidas con middleware de autenticación
 */
app.use("/api/auth/login", loginRoutes);

/**
 * EXPORTACIÓN DEL SERVIDOR CONFIGURADO
 * ====================================
 * 
 * La aplicación Express completamente configurada se exporta
 * para ser utilizada en el punto de entrada principal (app.js).
 * 
 * El archivo app.js se encargará de:
 * 1. Conectar a la base de datos MongoDB
 * 2. Iniciar el servidor en el puerto especificado
 * 3. Manejar el ciclo de vida de la aplicación
 * 
 * Esta separación permite:
 * - Testing más sencillo de la configuración
 * - Reutilización en diferentes contextos (dev, test, prod)
 * - Mejor organización del código
 */
export default app;