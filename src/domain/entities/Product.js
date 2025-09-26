class Product {
  constructor({ id, name, description, price, stock, category, createdAt = new Date() }) {
    if(!name || name.length < 2) throw new Error("❌ Nombre del producto inválido ❌");

    if(!price || price < 0) throw new Error("❌ Precio inválido ❌");

    if(!stock) throw new Error("❌ Stock inválido ❌");

    if(!category) throw new Error("❌ Categoria inválida ❌");

    this.id = id;
    this.name = name;
    this.description = description;
    this.price = price;
    this.stock = stock;
    this.category = category;
    this.createdAt = createdAt;
  }
}

export default Product;