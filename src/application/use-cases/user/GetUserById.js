/**
 * GETUSERBYID.JS - CASO DE USO PARA OBTENER UN USUARIO POR ID
 * ============================================================
 * 
 * Este caso de uso se encarga de recuperar un único usuario del sistema
 * utilizando su identificador único (MongoDB ObjectId). Es fundamental
 * para la administración, gestión de perfiles y consultas específicas.
 * 
 * Funcionalidades:
 * - Búsqueda de un usuario específico por su ID
 * - Abstracción de la capa de persistencia
 * - Implementación del patrón Use Case
 * 
 * CASOS DE USO TÍPICOS:
 * - Visualización de perfil de usuario en panel administrativo
 * - Consulta de un usuario para edición/actualización
 * - Verificación de datos de usuario en procesos de negocio
 * - Auditoría y seguimiento de actividad de un usuario en particular
 * 
 * INFORMACIÓN DISPONIBLE POR USUARIO:
 * - Identificación única (_id)
 * - Datos personales (name, email)
 * - Información de sistema (rol, status)
 * - Metadatos (createdAt, updatedAt)
 * - ⚠️ NUNCA incluye contraseñas por seguridad
 * 
 * 🔐 CONSIDERACIONES CRÍTICAS DE SEGURIDAD:
 * 
 * CONTROL DE ACCESO:
 * - Solo usuarios autenticados deberían poder consultar su propio perfil
 * - Acceso a perfiles de terceros debe estar limitado a roles administrativos
 * - Debe auditarse quién accede a la información de un usuario
 * 
 * PROTECCIÓN DE DATOS PERSONALES:
 * - Las contraseñas y tokens de seguridad NUNCA deben incluirse
 * - Filtrar campos sensibles antes de retornar la información
 * - Cumplir con normativas de privacidad (GDPR, CCPA)
 * 
 * PREVENCIÓN DE EXPOSICIÓN DE DATOS:
 * - Validar permisos antes de ejecutar la consulta
 * - No exponer información personal innecesaria
 * - Restringir datos visibles según el rol del solicitante
 * 
 * CONSIDERACIONES DE RENDIMIENTO:
 * - La consulta por ID es eficiente gracias a índices en MongoDB
 * - Ideal para sistemas grandes donde se requiera acceso puntual
 * 
 * NIVELES DE INFORMACIÓN SEGÚN ROL:
 * - Super Admin: Acceso completo (excepto passwords y tokens)
 * - Admin: Acceso básico para gestión
 * - Customer: Acceso únicamente a su propio perfil
 * 
 * Patrón de diseño: Clean Architecture / Use Case Pattern
 * Principio SOLID: Single Responsibility Principle
 */

/**
 * CLASE GETUSERBYID - CASO DE USO
 * ================================
 * 
 * Caso de uso especializado en la recuperación de un usuario según su ID.
 * ⚠️ CRÍTICO: Debe implementar validaciones de seguridad y control de acceso
 * antes del despliegue en producción.
 */
export default class GetUserById {
  /**
   * CONSTRUCTOR
   * ===========
   * 
   * Inicializa el caso de uso con la dependencia del repositorio
   * de usuarios mediante inyección de dependencias.
   * 
   * @param {Object} userRepository - Repositorio para operaciones CRUD de usuarios
   *                                Debe implementar el método findById(id)
   *                                DEBE excluir automáticamente passwords
   */
  constructor(userRepository) {
    this.userRepository = userRepository;
  }

  /**
   * EXECUTE - MÉTODO PRINCIPAL DE EJECUCIÓN
   * =======================================
   * 
   * Ejecuta la búsqueda de un usuario en el sistema según su ID.
   * 
   * ⚠️ ADVERTENCIA DE SEGURIDAD: Esta implementación NO incluye
   * validaciones de permisos ni control de acceso. Para producción
   * es OBLIGATORIO implementar validaciones de seguridad.
   * 
   * Proceso actual (BÁSICO):
   * 1. Delega la búsqueda al repositorio de usuarios
   * 2. Retorna el usuario encontrado (o null si no existe)
   * 
   * PROCESO RECOMENDADO PARA PRODUCCIÓN:
   * 1. Validar autenticación del solicitante
   * 2. Verificar permisos administrativos o propiedad del perfil
   * 3. Determinar nivel de información según rol
   * 4. Excluir campos sensibles antes de retornar
   * 5. Registrar acceso en logs de auditoría
   * 6. Retornar la información del usuario
   * 
   * @param {string} id - Identificador único del usuario (MongoDB ObjectId)
   * 
   * @returns {Promise<Object|null>} Objeto con la información del usuario encontrado
   *                                o null si no existe
   * 
   * @throws {Error} Si hay errores de base de datos o permisos insuficientes
   * 
   * @example
   * // ⚠️ USO ACTUAL (requiere validación de permisos externa)
   * const getUserById = new GetUserById(userRepository);
   * const user = await getUserById.execute("64a1b2c3d4e5f6789abcdef0");
   * 
   * console.log('Usuario encontrado:', user);
   * 
   * @example
   * // 🔐 IMPLEMENTACIÓN RECOMENDADA CON SEGURIDAD (pseudocódigo)
   * async execute(id, requestingUser) {
   *   if (!requestingUser) {
   *     throw new Error('Usuario no autenticado');
   *   }
   * 
   *   if (requestingUser.rol !== 'admin' && requestingUser._id !== id) {
   *     throw new Error('Permisos insuficientes para consultar este usuario');
   *   }
   * 
   *   const user = await this.userRepository.findById(id, { exclude: ['password', 'resetToken'] });
   * 
   *   if (!user) {
   *     throw new Error('Usuario no encontrado');
   *   }
   * 
   *   return user;
   * }
   */
  async execute(id) {
    return await this.userRepository.findById(id);
  }
}
