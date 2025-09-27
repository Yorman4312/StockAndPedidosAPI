import CreateUser from "../../application/use-cases/user/CreateUser.js";
import GetUser from "../../application/use-cases/user/GetUser.js";
import GetUserById from "../../application/use-cases/user/GetUserById.js";
import UpdateUser from "../../application/use-cases/user/UpdateUser.js";
import DeleteUser from "../../application/use-cases/user/DeleteUser.js";

import PasswordEncrypter from "../../presentation/security/password_encrypter.js";
import UserRepositoryMongo from "../../infrastructure/repositories/UserRepositoryMongo.js";

const userRepository = new UserRepositoryMongo();
const passwordEncrypter = new PasswordEncrypter();

export const createUser = async (req, res) => {
  try {
    const createUser = new CreateUser(userRepository, passwordEncrypter);
    const user = await createUser.execute(req.body);
    res.status(201).json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getUser = async (req, res) => {
  try {
    const getUser = new GetUser(userRepository);
    const user = await getUser.execute();
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getUserById = async (req, res) => {
  try {
    const getUserById = new GetUserById(userRepository);
    const user = await getUserById.execute(req.params.id);
    if (!user) return res.status(404).json({ message: "Usuario no encontrado" });
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const updateUser = async (req, res) => {
  try {
    const updateUser = new UpdateUser(userRepository);
    const user = await updateUser.execute(req.params.id, req.body);
    if(!user) return res.status(404).json({ message: "Usuario no encontrado" });
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const deleteUser = async (req, res) => {
  try {
    const deleteUser = new DeleteUser(userRepository);
    const result = await deleteUser.execute(req.params.id);
    if(!result) return res.status(404).json({ message: "Usuario no encontrado" });
    res.json({ message: "✅ Usuario eliminado correctamente ✅" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};