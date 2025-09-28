/**
 * SERVER.JS - CONFIGURACIÓN DEL SERVIDOR EXPRESS
 * ==============================================
 * 
 * Este archivo configura y define toda la estructura del servidor Express,
 * incluyendo middlewares globales y el enrutamiento principal de la API.
 * 
 * Funcionalidades:
 * - Configuración de Express con middleware JSON
 * - Definición de rutas principales de la API
 * - Organización modular de endpoints por funcionalidad
 * 
 * Estructura de la API:
 * - /api/users         -> Gestión de usuarios (CRUD)
 * - /api/products      -> Gestión de productos (CRUD + Stock)
 * - /api/order         -> Gestión de pedidos (CRUD + Estado)
 * - /api/orderDetails  -> Gestión de detalles de pedidos (CRUD)
 * - /api/auth/login    -> Autenticación y generación de tokens JWT
 */

import express from "express";

// ============================================================
// IMPORTACIÓN DE RUTAS MODULARES
// ============================================================

// Rutas para gestión de usuarios (registro, consulta, actualización, eliminación)
import userRoutes from "./routes/userRoutes.js";

// Rutas para gestión de productos con control automático de stock
import productRoutes from "./routes/productRoutes.js";

// Rutas para gestión de pedidos con manejo de estados (true/false)
import orderRoutes from "./routes/orderRoutes.js";

// Rutas para gestión de detalles de pedidos (relación productos-pedidos)
import orderDetailsRoutes from "./routes/orderDetailsRoutes.js";

// Rutas para autenticación de usuarios (login y generación de JWT)
import loginRoutes from "./routes/loginRoutes.js";

/**
 * INICIALIZACIÓN DE LA APLICACIÓN EXPRESS
 * =======================================
 */
const app = express();

/**
 * MIDDLEWARES GLOBALES
 * ===================
 * 
 * express.json(): Middleware para parsear automáticamente el body 
 * de las peticiones HTTP como JSON. Esencial para recibir datos 
 * en formato JSON desde el cliente.
 */
app.use(express.json());

/**
 * CONFIGURACIÓN DE RUTAS PRINCIPALES
 * =================================
 * 
 * Cada ruta base dirige a un módulo específico que maneja
 * todas las operaciones CRUD correspondientes:
 */

// Rutas de usuarios: GET, POST, PUT, DELETE para gestión de usuarios
app.use("/api/users", userRoutes);

// Rutas de productos: CRUD completo + gestión automática de stock
app.use("/api/products", productRoutes);

// Rutas de pedidos: CRUD + lógica de estado que afecta el inventario
app.use("/api/order", orderRoutes);

// Rutas de detalles de pedidos: Relación many-to-many entre pedidos y productos
app.use("/api/orderDetails", orderDetailsRoutes);

// Rutas de autenticación: Login con validación de credenciales y JWT
app.use("/api/auth/login", loginRoutes);

/**
 * EXPORTACIÓN DEL SERVIDOR
 * ========================
 * La aplicación configurada se exporta para ser utilizada
 * en el punto de entrada principal (app.js)
 */
export default app;