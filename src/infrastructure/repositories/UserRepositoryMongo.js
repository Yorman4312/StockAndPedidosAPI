import { UserModel } from "../db/UserModel.js";

class userRepositoryMongo {
  async create(userData) {
    const user = new UserModel(userData);
    return await user.save();
  }

  async findAll() {
    return await UserModel.find();
  }

  async findById(id) {
    return await UserModel.findById(id);
  }

  async update(id, userData) {
    return await UserModel.findByIdAndUpdate(id, userData, { new: true });
  }

  async delete(id) {
    return await UserModel.findByIdAndDelete(id);
  }

  async findByUserEmail(email) {
    return await UserModel.findOne({ email: email });
  }
}

export default userRepositoryMongo;