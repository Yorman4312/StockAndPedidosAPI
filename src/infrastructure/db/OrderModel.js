import mongoose from "mongoose";

const OrderSchema = new mongoose.Schema({
  userId: {
    type: Number,
    required: true
  },

  total: {
    type: Number,
    required: true,
    minlength: 0
  },

  status: {
    type: Boolean,
    required: true
  },

  createdAt: {
    type: Date,
    required: true
  }
});

export const OrderModel = mongoose.model("Order", OrderSchema);