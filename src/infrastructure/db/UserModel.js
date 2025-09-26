import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 3,
    maxlength: 25
  },

  email: {
    type: String,
    required: true,
    unique: true,
    minlength: 8,
    maxlength: 50,
    match: /.+\@.+\..+/
  },

  password: {
    type: String,
    required: true,
    minlength: 4
  },

  rol: {
    type: String,
    required: true,
    minlength: 2
  },

  createdAt: {
    type: Date,
    required: true
  }
});

export const UserModel = mongoose.model("User", UserSchema);