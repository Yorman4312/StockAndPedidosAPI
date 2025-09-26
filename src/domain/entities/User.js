class User {
  constructor({ id, name, email, password, rol, createdAt = new Date() }) {
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