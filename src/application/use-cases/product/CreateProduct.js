import Product from "../../../domain/entities/Product.js";

export default class CreateProduct {
  constructor(productRepository) {
    this.productRepository = productRepository;
  }

  async execute(productData) {
    const product = new Product(productData);
    const { name, description, price, stock, category, createdAt } = product;

    const productToSave = {
      name,
      description,
      price,
      stock,
      category,
      createdAt
    };

    return await this.productRepository.create(productToSave);
  }
}