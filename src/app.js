/**
 * APP.JS - PUNTO DE ENTRADA PRINCIPAL DE LA API
 * =============================================
 * 
 * Este archivo es el punto de entrada principal de la aplicación API RESTful.
 * Configura y inicializa todos los componentes necesarios para el funcionamiento
 * del sistema de e-commerce.
 * 
 * Funcionalidades principales:
 * - Carga de variables de entorno
 * - Conexión a la base de datos MongoDB
 * - Inicialización del servidor Express
 * 
 * Tecnologías utilizadas:
 * - Node.js
 * - Express.js
 * - MongoDB
 * - dotenv para manejo de variables de entorno
 */

// Importación de variables de entorno desde archivo .env
import "dotenv/config.js";

// Importación de la función de conexión a la base de datos MongoDB
import connectBD from "./config/database.js";

// Importación de la configuración del servidor Express
import app from "./presentation/server.js";

/**
 * CONFIGURACIÓN DEL PUERTO
 * ========================
 * El servidor utilizará el puerto definido en las variables de entorno,
 * o por defecto el puerto 4312 si no se especifica uno.
 */
const PORT = process.env.PORT || 4312;

/**
 * INICIALIZACIÓN DE LA APLICACIÓN
 * ===============================
 * 
 * Proceso de arranque:
 * 1. Se establece conexión con la base de datos MongoDB
 * 2. Una vez conectada exitosamente, se inicia el servidor Express
 * 3. El servidor queda escuchando en el puerto especificado
 * 
 * Esta secuencia asegura que la aplicación no acepte peticiones
 * hasta que la base de datos esté completamente disponible.
 */
connectBD().then(() => {
  app.listen(PORT, () => console.log(`🔹 Servidor corriendo en el puerto ${PORT}`));
});