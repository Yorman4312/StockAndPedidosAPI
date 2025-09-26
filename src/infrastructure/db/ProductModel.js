import mongoose from "mongoose";

const ProductSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 60
  },

  description: {
    type: String,
    required: false,
    maxlength: 50
  },

  price: {
    type: Number,
    required: true,
    minlength: 0
  },

  stock: {
    type: Number,
    required: true,
    minlength: 0
  },

  category: {
    type: String,
    required: true,
    minlength: 1
  },

  createdAt: {
    type: Date,
    required: true
  }
});

export const ProductModel = mongoose.model("Product", ProductSchema);