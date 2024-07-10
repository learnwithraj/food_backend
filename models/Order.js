const mongoose = require("mongoose");

const orderItemSchema = mongoose.Schema({
  foodId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Food",
  },
  quantity: {
    type: Number,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  instructions: {
    type: String,
    default: "",
  },
});

const orderSchema = mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  orderItems: {
    type: [orderItemSchema],
  },
  orderTotal: {
    type: Number,
    required: true,
  },
  deliveryFee: {
    type: Number,
    required: true,
  },
  grandTotal: {
    type: Number,
    required: true,
  },
  deliveryAddress: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Address",
  },
  orderStatus: {
    type: String,
    default: "Placed",
    enum: ["Placed", "Delivered", "Preparing", "Out for Delivery", "Cancelled"],
  },
  orderDate: {
    type: Date,
    default: Date.now,
  },

  rating: {
    type: Number,
    min: 1,
    max: 5,
  },
  feedback: {
    type: String,
  },
  discountAmount: {
    type: Number,
  },
});

const Order = mongoose.model("Order", orderSchema);
module.exports = Order;
