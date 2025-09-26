export default class GetUserById {
  constructor(userRepository) {
    this.userRepository = userRepository;
  }
  async execute(id) {
    return await this.userRepository.findById(id);
  }
}