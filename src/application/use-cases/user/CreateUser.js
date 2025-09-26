import User from "../../../domain/entities/User.js";

export default class CreateUser {
  constructor(userRepository, passwordEncrypter) {
    this.userRepository = userRepository;
    this.passwordEncrypter = passwordEncrypter;
  }

  async execute(userData) {
    const user = new User(userData);
    const { name, email, password, rol, createdAt } = user;

    const hashedPassword = await this.passwordEncrypter.hashPassword(password);

    const userToSave = {
      name,
      email,
      password: hashedPassword,
      rol,
      createdAt
    };

    return await this.userRepository.create(userToSave);
  }
}