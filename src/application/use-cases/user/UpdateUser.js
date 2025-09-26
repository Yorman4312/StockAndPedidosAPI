import User from "../../../domain/entities/User.js";

export default class UpdateUser {
  constructor(userRepository) {
    this.userRepository = userRepository;
  }
  async execute(id, userData) {
    const user = new User(userData);
    return await this.userRepository.update(id, user);
  }
}