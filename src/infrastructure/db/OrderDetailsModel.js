import mongoose from "mongoose";

const OrderDetailsSchema = new mongoose.Schema({
  orderId: {
    type: Number,
    required: true
  },

  productId: {
    type: Number,
    required: true
  },

  amount: {
    type: Number,
    required: true,
    minlength: 1
  },

  unitPrice: {
    type: Number,
    required: true,
    minlength: 0
  },

  subtotal: {
    type: Number,
    required: true
  }
});

export const OrderDetailsModel = mongoose.model("OrderDetails", OrderDetailsModel);