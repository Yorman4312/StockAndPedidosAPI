/**
 * USER.JS - ENTIDAD DE DOMINIO "USER"
 * ====================================
 * 
 * Representa la entidad "Usuario" dentro de la capa de dominio.
 * Define atributos y validaciones esenciales para los usuarios
 * que interactúan en el sistema de e-commerce (clientes, admins, etc).
 * 
 * CAMPOS PRINCIPALES:
 * - id: Identificador único del usuario
 * - name: Nombre completo del usuario (obligatorio, mínimo 2 caracteres)
 * - email: Correo electrónico válido (obligatorio, mínimo 8 caracteres y debe incluir "@")
 * - password: Contraseña de acceso (obligatoria, mínimo 4 caracteres)
 * - rol: Rol dentro del sistema (ej: "admin", "customer", "seller") (obligatorio)
 * - createdAt: Fecha de registro del usuario
 * 
 * 🚨 VALIDACIONES:
 * - `name`: requerido, mínimo 2 caracteres
 * - `email`: requerido, mínimo 8 caracteres, debe contener "@"
 * - `password`: requerido, mínimo 4 caracteres
 * - `rol`: requerido, mínimo 2 caracteres
 * 
 * CASOS DE USO TÍPICOS:
 * - Registrar un nuevo usuario (cliente, administrador, vendedor)
 * - Autenticación de usuario en el sistema
 * - Asignación de roles y permisos según tipo de usuario
 * - Consultar y actualizar datos de perfil
 * 
 * 🔄 RELACIÓN CON OTRAS ENTIDADES:
 * - Relación con Order → un usuario puede tener múltiples órdenes asociadas
 * 
 * 🔐 CONSIDERACIONES:
 * - La contraseña debería almacenarse de forma encriptada (no en texto plano)
 * - Los roles determinan los permisos de acceso (principio de autorización)
 * - Los correos deben ser únicos en la base de datos
 * 
 * PATRONES Y PRINCIPIOS:
 * - Clean Architecture → Entidad de dominio pura, sin dependencias externas
 * - SRP (Single Responsibility Principle) → Solo modela un usuario y sus reglas básicas
 */

class User {
  /**
   * Constructor de la entidad User
   * @param {Object} params - Parámetros para construir el usuario
   * @param {string} params.id - Identificador único del usuario
   * @param {string} params.name - Nombre del usuario (mínimo 2 caracteres)
   * @param {string} params.email - Correo electrónico válido
   * @param {string} params.password - Contraseña (mínimo 4 caracteres)
   * @param {string} params.rol - Rol asignado al usuario (ej: "admin", "customer")
   * @param {Date} params.createdAt - Fecha de creación del usuario
   * @throws {Error} - Si name, email, password o rol no cumplen validaciones
   */
  constructor({ id, name, email, password, rol, createdAt }) {
    if(!name || name.length < 2) throw new Error("❌ Nombre inválido ❌");

    if(!email || email.length < 8 || !email.includes("@")) throw new Error("❌ Email inválido ❌");

    if(!password || password.length < 4) throw new Error("❌ Contrasena inválida ❌");

    if(!rol || rol.length < 2) throw new Error("❌ Rol inválido ❌");

    this.id = id;
    this.name = name;
    this.email = email;
    this.password = password;
    this.rol = rol;
    this.createdAt = createdAt;
  }
}

export default User;
