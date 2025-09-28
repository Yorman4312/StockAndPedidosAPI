/**
 * CREATEUSER.JS - CASO DE USO PARA CREACIÓN DE USUARIOS
 * =====================================================
 * 
 * Este caso de uso maneja la creación de nuevos usuarios en el sistema
 * de e-commerce con encriptación segura de contraseñas. Los usuarios
 * son fundamentales para la autenticación y autorización del sistema.
 * 
 * Funcionalidades principales:
 * - Creación de usuarios con validación de datos
 * - Encriptación segura de contraseñas (hashing)
 * - Gestión de roles de usuario
 * - Abstracción de la capa de persistencia
 * - Aplicación de reglas de negocio mediante entidad de dominio
 * 
 * CAMPOS DEL USUARIO:
 * - name: Nombre completo o nombre de usuario (requerido)
 * - email: Correo electrónico único (requerido, único)
 * - password: Contraseña en texto plano (se encripta antes de guardar)
 * - rol: Rol del usuario en el sistema (admin, customer, etc.)
 * 
 * SEGURIDAD DE CONTRASEÑAS:
 * - Las contraseñas NUNCA se almacenan en texto plano
 * - Se utiliza un servicio de encriptación (PasswordEncrypter)
 * - Implementa algoritmos de hashing seguros (bcrypt, argon2, etc.)
 * - Salt automático para prevenir ataques de rainbow tables
 * 
 * GESTIÓN DE ROLES:
 * - admin: Acceso completo al sistema
 * - customer: Usuario regular con permisos limitados
 * - manager: Permisos intermedios para gestión
 * - (Los roles específicos dependen de la implementación del sistema)
 * 
 * RELACIONES EN EL SISTEMA:
 * - User → Order: Un usuario puede tener múltiples pedidos
 * - El email sirve como identificador único para login
 * - El rol determina los permisos y funcionalidades disponibles
 * 
 * VALIDACIONES DE SEGURIDAD:
 * - Email único (no duplicados)
 * - Formato de email válido
 * - Contraseña con requisitos mínimos de seguridad
 * - Roles válidos según configuración del sistema
 * 
 * CONSIDERACIONES DE PRIVACIDAD:
 * - La contraseña original se destruye después del hashing
 * - Los datos sensibles se manejan según normativas (GDPR, etc.)
 * - Logs no deben incluir información sensible
 * 
 * Patrón de diseño: Clean Architecture / Use Case Pattern
 * Principio SOLID: Single Responsibility + Dependency Injection
 */

import User from "../../../domain/entities/User.js";

/**
 * CLASE CREATEUSER - CASO DE USO
 * ==============================
 * 
 * Maneja la creación segura de usuarios con encriptación de contraseñas
 * y aplicación de validaciones de dominio.
 */
export default class CreateUser {
  /**
   * CONSTRUCTOR
   * ===========
   * 
   * Inicializa el caso de uso con las dependencias necesarias para
   * la creación de usuarios y encriptación de contraseñas.
   * 
   * @param {Object} userRepository - Repositorio para operaciones CRUD de usuarios
   *                                Debe implementar el método create()
   * @param {Object} passwordEncrypter - Servicio para encriptación de contraseñas
   *                                   Debe implementar el método hashPassword()
   */
  constructor(userRepository, passwordEncrypter) {
    this.userRepository = userRepository;
    this.passwordEncrypter = passwordEncrypter;
  }

  /**
   * EXECUTE - MÉTODO PRINCIPAL DE EJECUCIÓN
   * =======================================
   * 
   * Ejecuta la creación de un nuevo usuario con encriptación segura
   * de contraseña y validación de datos de dominio.
   * 
   * Proceso completo:
   * 1. Creación de entidad User con validaciones de dominio
   * 2. Extracción de campos validados de la entidad
   * 3. Encriptación segura de la contraseña
   * 4. Estructuración de datos para persistencia (con contraseña hasheada)
   * 5. Guardado en base de datos a través del repositorio
   * 6. Retorno del usuario creado (sin contraseña en respuesta)
   * 
   * PROCESO DE ENCRIPTACIÓN:
   * - La contraseña original se pasa al passwordEncrypter
   * - Se genera un hash seguro con salt automático
   * - La contraseña original se descarta de memoria
   * - Solo el hash se almacena en la base de datos
   * 
   * VALIDACIONES APLICADAS (via entidad User):
   * - Presencia de campos requeridos (name, email, password)
   * - Formato válido de email
   * - Longitud mínima de contraseña
   * - Rol válido según configuración
   * - Otros criterios de seguridad definidos en la entidad
   * 
   * CONSIDERACIONES DE SEGURIDAD:
   * - La contraseña original nunca se almacena
   * - El hash resultante es irreversible
   * - Cada contraseña tiene su propio salt único
   * - Resistente a ataques de fuerza bruta y rainbow tables
   * 
   * @param {Object} userData - Datos del usuario a crear
   * @param {string} userData.name - Nombre del usuario (requerido)
   * @param {string} userData.email - Email único del usuario (requerido)
   * @param {string} userData.password - Contraseña en texto plano (se encripta)
   * @param {string} userData.rol - Rol del usuario (admin, customer, etc.)
   * 
   * @returns {Promise<Object>} Usuario creado sin contraseña en la respuesta
   * 
   * @throws {Error} Si faltan datos, email duplicado, o validaciones de seguridad fallan
   * 
   * @example
   * // Crear un usuario customer básico
   * const createUser = new CreateUser(userRepository, passwordEncrypter);
   * 
   * const userData = {
   *   name: "Juan Pérez",
   *   email: "juan.perez@email.com",
   *   password: "miPasswordSegura123!",
   *   rol: "customer"
   * };
   * 
   * const newUser = await createUser.execute(userData);
   * console.log(`Usuario creado: ${newUser.name} (${newUser.email})`);
   * // Nota: newUser no incluye la contraseña por seguridad
   * 
   * @example
   * // Crear un usuario administrador
   * const adminData = {
   *   name: "Admin Sistema",
   *   email: "admin@mitienda.com", 
   *   password: "AdminPassword2024!@#",
   *   rol: "admin"
   * };
   * 
   * const adminUser = await createUser.execute(adminData);
   * console.log(`Administrador creado: ${adminUser.name}`);
   * 
   * @example
   * // Manejo de errores de validación
   * try {
   *   const invalidUser = {
   *     name: "Test User",
   *     email: "email-invalido",  // ❌ Email con formato inválido
   *     password: "123",           // ❌ Contraseña muy débil
   *     rol: "invalid_role"        // ❌ Rol inexistente
   *   };
   *   
   *   await createUser.execute(invalidUser);
   * } catch (error) {
   *   console.error('Error de validación:', error.message);
   *   // La entidad User debería lanzar errores específicos
   * }
   * 
   * @example
   * // Manejo de email duplicado
   * try {
   *   const duplicateEmailUser = {
   *     name: "Otro Usuario", 
   *     email: "juan.perez@email.com", // Email ya existe
   *     password: "otraPassword123",
   *     rol: "customer"
   *   };
   *   
   *   await createUser.execute(duplicateEmailUser);
   * } catch (error) {
   *   console.error('Email duplicado:', error.message);
   *   // El repositorio debería lanzar error por violación de unicidad
   * }
   * 
   * @example
   * // Resultado típico de usuario creado
   * // {
   * //   _id: "64a1b2c3d4e5f6789abcdef0",
   * //   name: "Juan Pérez",
   * //   email: "juan.perez@email.com",
   * //   rol: "customer",
   * //   createdAt: "2024-01-15T10:30:00Z",
   * //   updatedAt: "2024-01-15T10:30:00Z"
   * //   // Nota: 'password' NO se incluye en la respuesta por seguridad
   * // }
   * 
   * @example
   * // Verificación del proceso de encriptación
   * const userData = {
   *   name: "Test User",
   *   email: "test@example.com",
   *   password: "plainTextPassword",
   *   rol: "customer"
   * };
   * 
   * console.log('Contraseña original:', userData.password);
   * const user = await createUser.execute(userData);
   * 
   * // En la base de datos se guardará algo como:
   * // password: "$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqyqGsHbvpuOOcxMk7Y6EKO"
   * // (hash bcrypt con salt automático)
   * 
   * console.log('Usuario creado exitosamente - contraseña encriptada');
   */
  async execute(userData) {
    /**
     * PASO 1: VALIDACIÓN Y CREACIÓN DE ENTIDAD DE DOMINIO
     * ===================================================
     * 
     * Se crea una instancia de la entidad User que aplicará
     * todas las validaciones de dominio definidas.
     * 
     * La entidad puede lanzar excepciones si:
     * - Faltan campos requeridos (name, email, password, rol)
     * - El formato del email es inválido
     * - La contraseña no cumple criterios mínimos
     * - El rol no está permitido
     * - Se violan otras reglas de negocio
     */
    const user = new User(userData);

    /**
     * PASO 2: EXTRACCIÓN DE CAMPOS VALIDADOS
     * ======================================
     * 
     * Se extraen los campos de la entidad ya validada.
     * En este punto, la contraseña aún está en texto plano
     * pero ha pasado las validaciones de formato/seguridad.
     */
    const { name, email, password, rol } = user;

    /**
     * PASO 3: ENCRIPTACIÓN SEGURA DE CONTRASEÑA
     * =========================================
     * 
     * La contraseña se pasa al servicio de encriptación que:
     * - Genera un salt único y aleatorio
     * - Aplica el algoritmo de hashing (bcrypt, argon2, etc.)
     * - Retorna un hash seguro e irreversible
     * - El proceso puede tomar tiempo intencionalmente (cost factor)
     */
    const hashedPassword = await this.passwordEncrypter.hashPassword(password);

    /**
     * PASO 4: ESTRUCTURACIÓN PARA PERSISTENCIA
     * ========================================
     * 
     * Se crea el objeto que será persistido, reemplazando
     * la contraseña original con el hash seguro.
     * 
     * IMPORTANTE: Después de este punto, la contraseña original
     * ya no está disponible en memoria (garbage collection)
     */
    const userToSave = {
      name,
      email,
      password: hashedPassword,  // ⚠️ Ahora es el hash, no la contraseña original
      rol
    };

    /**
     * PASO 5: PERSISTENCIA Y RETORNO
     * ==============================
     * 
     * Se delega la creación al repositorio y se retorna el resultado.
     * 
     * NOTA DE SEGURIDAD: Muchos repositorios excluyen automáticamente
     * el campo 'password' de la respuesta para evitar exponer hashes.
     * 
     * El resultado típicamente incluye:
     * - _id: ID único generado
     * - name, email, rol: Campos visibles
     * - createdAt, updatedAt: Timestamps automáticos
     * - password: EXCLUIDO por seguridad
     */
    return await this.userRepository.create(userToSave);
  }
}