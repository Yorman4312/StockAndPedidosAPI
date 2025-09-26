export default class GetUser {
  contructor(userRepository) {
    this.userRepository = userRepository;
  }
  async execute() {
    return await this.userRepository.findAll();
  }
}