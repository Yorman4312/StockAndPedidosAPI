/**
 * USERMODEL.JS - MODELO DE BASE DE DATOS (MONGOOSE)
 * ==================================================
 * 
 * Define el esquema y modelo de Mongoose para la colección
 * "User". Representa a los usuarios registrados en el sistema.
 * 
 * CAMPOS PRINCIPALES:
 * - name: Nombre del usuario (obligatorio, longitud entre 3 y 25)
 * - email: Correo electrónico único y obligatorio 
 *          (mínimo 8 caracteres, máximo 50, validado con regex)
 * - password: Contraseña encriptada del usuario (obligatoria, mínimo 4 caracteres)
 * - rol: Rol del usuario (ej. "admin", "cliente") (obligatorio, mínimo 2 caracteres)
 * - timestamps: Agrega automáticamente los campos createdAt y updatedAt
 * 
 * 🚨 VALIDACIONES:
 * - `name`: requerido, entre 3 y 25 caracteres
 * - `email`: requerido, único, formato válido de correo
 * - `password`: requerido, mínimo 4 caracteres
 * - `rol`: requerido, mínimo 2 caracteres
 * 
 * CASOS DE USO:
 * - Registrar usuarios en el sistema
 * - Consultar información de usuarios
 * - Autenticación y autorización (junto con contraseña encriptada y JWT)
 * - Asignación de permisos según el rol
 * 
 * PATRONES Y PRINCIPIOS:
 * - Infraestructura: define la persistencia de usuarios en MongoDB
 * - Clean Architecture: corresponde a la implementación de almacenamiento
 *   de la entidad de dominio "User"
 */

import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 3,
    maxlength: 25
  },

  email: {
    type: String,
    required: true,
    unique: true,
    minlength: 8,
    maxlength: 50,
    match: /.+\@.+\..+/
  },

  password: {
    type: String,
    required: true,
    minlength: 4
  },

  rol: {
    type: String,
    required: true,
    minlength: 2
  },
}, {
  timestamps: true // añade createdAt y updatedAt automáticamente
});

// Exporta el modelo de Mongoose para interactuar con la colección "User"
export const UserModel = mongoose.model("User", UserSchema);
