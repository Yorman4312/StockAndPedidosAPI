/**
 * ORDERMODEL.JS - MODELO DE BASE DE DATOS (MONGOOSE)
 * ==================================================
 * 
 * Define el esquema y modelo de Mongoose para la colección
 * "Order". Representa los pedidos generados por los usuarios
 * dentro del sistema.
 * 
 * CAMPOS PRINCIPALES:
 * - userId: ID del usuario que realizó el pedido (relación con User)
 * - total: Monto total del pedido (≥ 0)
 * - status: Estado del pedido (true = confirmado, false = cancelado)
 * - timestamps: Genera automáticamente los campos createdAt y updatedAt
 * 
 * 🔄 RELACIONES:
 * - `userId` → Relación con el modelo **User**
 * - Se asocia con `OrderDetails` para especificar los productos
 *   y cantidades de cada pedido.
 * 
 * 🚨 VALIDACIONES:
 * - `total`: debe ser un número mayor o igual a 0
 * - `status`: campo requerido, tipo booleano
 * 
 * CASOS DE USO:
 * - Registrar pedidos realizados por usuarios
 * - Consultar el historial de pedidos de un usuario
 * - Actualizar el estado de un pedido (ej. confirmado o cancelado)
 * 
 * PATRONES Y PRINCIPIOS:
 * - Infraestructura: modelo de persistencia en MongoDB
 * - Clean Architecture: traduce la entidad de dominio "Order"
 *   a una estructura que pueda ser almacenada en base de datos
 */

import mongoose from "mongoose";

const OrderSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },

  total: {
    type: Number,
    min: 0
  },

  status: {
    type: Boolean,
    required: true
  },
}, {
  timestamps: true // Añade createdAt y updatedAt automáticamente
});

// Exporta el modelo de Mongoose para interactuar con la colección "Order"
export const OrderModel = mongoose.model("Order", OrderSchema);
