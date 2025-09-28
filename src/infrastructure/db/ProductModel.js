/**
 * PRODUCTMODEL.JS - MODELO DE BASE DE DATOS (MONGOOSE)
 * ====================================================
 * 
 * Define el esquema y modelo de Mongoose para la colección
 * "Product". Representa los productos disponibles dentro del
 * sistema de e-commerce.
 * 
 * CAMPOS PRINCIPALES:
 * - name: Nombre del producto (obligatorio, longitud mínima 2 y máxima 60)
 * - description: Descripción opcional del producto (máximo 50 caracteres)
 * - price: Precio del producto (obligatorio, ≥ 0)
 * - stock: Cantidad disponible en inventario (obligatorio, ≥ 0)
 * - category: Categoría a la que pertenece el producto (obligatorio)
 * - timestamps: Agrega automáticamente los campos createdAt y updatedAt
 * 
 * 🚨 VALIDACIONES:
 * - `name`: no puede estar vacío, mínimo 2 caracteres, máximo 60
 * - `description`: opcional, máximo 50 caracteres
 * - `price`: requerido, debe ser ≥ 0
 * - `stock`: requerido, debe ser ≥ 0
 * - `category`: requerido, mínimo 1 carácter
 * 
 * CASOS DE USO:
 * - Registrar nuevos productos en el catálogo
 * - Consultar productos disponibles
 * - Actualizar inventario al realizar pedidos o devoluciones
 * - Eliminar productos del catálogo
 * 
 * PATRONES Y PRINCIPIOS:
 * - Infraestructura: modelo que define cómo se persisten los productos
 *   en la base de datos
 * - Clean Architecture: implementa una traducción directa de la
 *   entidad de dominio "Product" al almacenamiento en MongoDB
 */

import mongoose from "mongoose";

const ProductSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 60
  },

  description: {
    type: String,
    required: false,
    maxlength: 50
  },

  price: {
    type: Number,
    required: true,
    min: 0
  },

  stock: {
    type: Number,
    required: true,
    min: 0
  },

  category: {
    type: String,
    required: true,
    minlength: 1
  },
}, {
  timestamps: true // añade createdAt y updatedAt automáticamente
});

// Exporta el modelo de Mongoose para interactuar con la colección "Product"
export const ProductModel = mongoose.model("Product", ProductSchema);
