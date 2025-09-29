/**
 * CORSMIDDLEWARE.JS - MIDDLEWARE DE CONFIGURACIÓN CORS
 * ===================================================
 * 
 * Este middleware configura el Cross-Origin Resource Sharing (CORS)
 * para permitir que aplicaciones cliente desde dominios específicos
 * puedan realizar peticiones a la API RESTful.
 * 
 * CORS (Cross-Origin Resource Sharing):
 * - Mecanismo de seguridad del navegador
 * - Controla qué dominios pueden acceder a recursos de la API
 * - Previene ataques de tipo CSRF (Cross-Site Request Forgery)
 * - Define qué métodos HTTP y headers están permitidos
 * 
 * CONFIGURACIÓN ACTUAL:
 * - Origen permitido: http://localhost:5173 (típicamente Vite dev server)
 * - Métodos HTTP permitidos: GET, POST, PUT, DELETE
 * - Headers permitidos: Content-Type, Authorization
 * 
 * CASOS DE USO TÍPICOS:
 * - Desarrollo con frontend separado (React, Vue, Angular)
 * - Aplicaciones SPA (Single Page Applications)
 * - Aplicaciones móviles que consumen la API
 * - Integraciones de terceros autorizados
 * 
 * SEGURIDAD Y CONSIDERACIONES:
 * 
 * PARA DESARROLLO:
 * - La configuración actual es apropiada
 * - Permite acceso desde el servidor de desarrollo local
 * - Facilita pruebas y desarrollo rápido
 * 
 * PARA PRODUCCIÓN:
 * - DEBE cambiar el origen a dominios de producción
 * - Considerar múltiples orígenes si hay varios clientes
 * - Nunca usar "*" (wildcard) para orígenes en producción
 * - Implementar lista blanca de dominios permitidos
 * - Considerar variables de entorno para configuración dinámica
 * 
 * MÉTODOS HTTP PERMITIDOS:
 * - GET: Lectura de recursos
 * - POST: Creación de recursos
 * - PUT: Actualización completa de recursos
 * - DELETE: Eliminación de recursos
 * - Nota: No incluye PATCH (actualización parcial) ni OPTIONS
 * 
 * HEADERS PERMITIDOS:
 * - Content-Type: Especifica el tipo de contenido (application/json)
 * - Authorization: Para enviar tokens JWT de autenticación
 * 
 * CONFIGURACIONES ADICIONALES RECOMENDADAS:
 * - credentials: true (para cookies y autenticación)
 * - maxAge: Tiempo de cache de preflight requests
 * - exposedHeaders: Headers que el cliente puede leer
 * - preflightContinue: Pasar al siguiente middleware
 * 
 * Patrón de diseño: Middleware Pattern
 * Librería utilizada: cors (npm package)
 */

// middlewares/corsMiddleware.js
import cors from "cors";

/**
 * MIDDLEWARE CORS - CONFIGURACIÓN DE ACCESO CROSS-ORIGIN
 * ======================================================
 * 
 * Configura las políticas de acceso cross-origin para la API.
 * Este middleware se aplica globalmente a todas las rutas de la aplicación.
 * 
 * CONFIGURACIÓN DETALLADA:
 * 
 * 1. ORIGIN (Origen permitido):
 *    - http://localhost:5173
 *    - Puerto típico de Vite development server
 *    - Permite peticiones desde aplicaciones frontend en desarrollo
 *    - ⚠️ PRODUCCIÓN: Cambiar a dominio(s) de producción
 * 
 * 2. METHODS (Métodos HTTP permitidos):
 *    - GET: Obtener recursos (usuarios, productos, pedidos)
 *    - POST: Crear recursos (registro, login, crear productos)
 *    - PUT: Actualizar recursos (modificar pedidos, productos)
 *    - DELETE: Eliminar recursos (borrar productos, pedidos)
 * 
 * 3. ALLOWEDHEADERS (Headers permitidos en peticiones):
 *    - Content-Type: Define el formato de datos (application/json)
 *    - Authorization: Token JWT para autenticación de usuarios
 * 
 * FLUJO DE PETICIÓN CORS:
 * 
 * PETICIÓN SIMPLE:
 * 1. Cliente envía petición desde http://localhost:5173
 * 2. Navegador incluye header "Origin: http://localhost:5173"
 * 3. Middleware CORS valida el origen contra lista permitida
 * 4. Si es válido, agrega headers CORS a la respuesta
 * 5. Navegador permite que el cliente acceda a la respuesta
 * 
 * PETICIÓN PREFLIGHT (para POST, PUT, DELETE):
 * 1. Navegador envía OPTIONS request automáticamente
 * 2. Servidor responde con políticas CORS configuradas
 * 3. Si es exitoso, navegador envía la petición real
 * 4. Servidor procesa y responde con headers CORS
 * 
 * EJEMPLO DE HEADERS CORS EN RESPUESTA:
 * Access-Control-Allow-Origin: http://localhost:5173
 * Access-Control-Allow-Methods: GET, POST, PUT, DELETE
 * Access-Control-Allow-Headers: Content-Type, Authorization
 * 
 * CONFIGURACIÓN RECOMENDADA PARA PRODUCCIÓN:
 * 
 * const corsMiddleware = cors({
 *   origin: process.env.ALLOWED_ORIGINS?.split(',') || ["https://mitienda.com"],
 *   methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
 *   allowedHeaders: ["Content-Type", "Authorization"],
 *   credentials: true,  // Para cookies/sesiones
 *   maxAge: 86400      // Cache preflight por 24 horas
 * });
 * 
 * EJEMPLO DE VARIABLES DE ENTORNO (.env):
 * ALLOWED_ORIGINS=https://mitienda.com,https://admin.mitienda.com,https://app.mitienda.com
 * 
 * PROBLEMAS COMUNES Y SOLUCIONES:
 * 
 * ❌ Error: "CORS policy: No 'Access-Control-Allow-Origin' header"
 * ✅ Solución: Verificar que el origen del cliente esté en la lista
 * 
 * ❌ Error: "Method not allowed by CORS"
 * ✅ Solución: Agregar el método HTTP a la lista de methods
 * 
 * ❌ Error: "Request header not allowed by CORS"
 * ✅ Solución: Agregar el header necesario a allowedHeaders
 * 
 * ❌ Error: Cookies no se envían
 * ✅ Solución: Agregar credentials: true y configurar en el cliente
 * 
 * SEGURIDAD:
 * - NUNCA usar origin: "*" en producción
 * - Mantener lista blanca de orígenes específicos
 * - Limitar métodos y headers solo a los necesarios
 * - Usar HTTPS en producción para todos los orígenes
 * - Validar tokens JWT independientemente de CORS
 * 
 * @type {Function} Middleware configurado de cors
 * @returns {Function} Función middleware que procesa peticiones CORS
 */
const corsMiddleware = cors({
  origin: ["http://localhost:5173"], 
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"]
});

/**
 * EXPORTACIÓN DEL MIDDLEWARE
 * ==========================
 * 
 * El middleware se exporta para ser utilizado en la configuración
 * del servidor Express (server.js).
 * 
 * USO TÍPICO EN SERVER.JS:
 * import corsMiddleware from './middlewares/corsMiddleware.js';
 * app.use(corsMiddleware);
 * 
 * ORDEN DE MIDDLEWARES IMPORTANTE:
 * 1. CORS middleware (primero, antes de rutas)
 * 2. express.json() (parser de body)
 * 3. Rutas de la aplicación
 * 4. Error handlers (último)
 */
export default corsMiddleware;