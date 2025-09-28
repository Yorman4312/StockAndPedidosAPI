/**
 * ORDERDETAILSMODEL.JS - MODELO DE BASE DE DATOS (MONGOOSE)
 * =========================================================
 * 
 * Define el esquema y modelo de Mongoose para la colección
 * "OrderDetails". Representa los detalles de cada producto 
 * dentro de una orden de compra en el sistema.
 * 
 * CAMPOS PRINCIPALES:
 * - orderId: Referencia al pedido al que pertenecen los detalles
 * - productId: Referencia al producto asociado en la orden
 * - amount: Cantidad de productos seleccionados (mínimo 1)
 * - unitPrice: Precio unitario del producto (mínimo 0)
 * - subtotal: Total parcial de cada producto en la orden
 * 
 * 🔄 RELACIONES:
 * - `orderId` → Relación con el modelo **Order**
 * - `productId` → Relación con el modelo **Product**
 * 
 * 🚨 VALIDACIONES:
 * - `amount`: requerido, debe ser ≥ 1
 * - `unitPrice`: requerido, debe ser ≥ 0
 * - `subtotal`: si no se especifica, inicia en 0
 * 
 * CASOS DE USO:
 * - Registrar productos y cantidades asociados a un pedido
 * - Consultar los productos de una orden (con cantidades y subtotales)
 * - Persistencia en MongoDB de los detalles de compra
 * 
 * PATRONES Y PRINCIPIOS:
 * - Infraestructura: este modelo pertenece a la capa de persistencia
 * - Clean Architecture: traduce entidades de dominio a una estructura de base de datos
 */

import mongoose from "mongoose";

const OrderDetailsSchema = new mongoose.Schema({
  orderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Order"
  },

  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product"
  },

  amount: {
    type: Number,
    required: true,
    min: 1
  },

  unitPrice: {
    type: Number,
    required: true,
    min: 0
  },

  subtotal: {
    type: Number,
    default: 0
  }
});

// Exporta el modelo de Mongoose para su uso en repositorios o servicios
export const OrderDetailsModel = mongoose.model("OrderDetails", OrderDetailsSchema);
