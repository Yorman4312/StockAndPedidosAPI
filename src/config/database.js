/**
 * DATABASE.JS - CONFIGURACIÓN DE CONEXIÓN A MONGODB
 * ==================================================
 * 
 * Este módulo establece la conexión a la base de datos MongoDB
 * utilizando la librería Mongoose.
 * 
 * FUNCIONALIDADES:
 * - Conexión asíncrona a la base de datos MongoDB
 * - Uso de variables de entorno para proteger credenciales
 * - Manejo de errores en caso de fallo de conexión
 * - Finalización del proceso si no se puede establecer conexión
 * 
 * 🔧 CONFIGURACIÓN NECESARIA:
 * - Definir la variable de entorno `MONGO_URI` con la cadena de conexión a MongoDB
 *   Ejemplo (en .env):
 *   MONGO_URI=mongodb://localhost:27017/mi_basedatos
 * 
 * CASOS DE USO TÍPICOS:
 * - Inicializar la base de datos al arrancar la API
 * - Proporcionar conexión para repositorios y modelos
 * 
 * 🔐 CONSIDERACIONES DE SEGURIDAD:
 * - Nunca exponer la URI de conexión en el código fuente
 * - Usar variables de entorno para credenciales y cluster
 * - Configurar usuarios y roles en la base de datos para mayor seguridad
 */

import mongoose from "mongoose";

/**
 * Función asíncrona para conectar con MongoDB
 * Utiliza `process.env.MONGO_URI` para obtener la cadena de conexión
 */
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log("✅ Conectado a MongoDB ✅");
  } catch (err) {
    console.error("❌ Error de la conexión ❌");
    process.exit(1); // Finaliza el proceso si la conexión falla
  }
};

export default connectDB;
