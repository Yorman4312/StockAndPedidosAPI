import Product from "../../../domain/entities/Product.js";

export default class UpdateProduct {
  constructor(productRepository) {
    this.productRepository = productRepository;
  }

  async execute(id, productData) {
    const product = new Product(productData)
    return await this.productRepository.update(id, product);
  }
}