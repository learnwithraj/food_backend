const mongoose = require("mongoose");

const orderItemSchema = mongoose.Schema({
  foodId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Food",
  },
  title: {
    type: String,
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
    min: 1,
    default: 1,
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
    default: 100,
  },
  grandTotal: {
    type: Number,
    required: true,
  },
  deliveryAddress: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Address",
  },
  paymentMethod: {
    enum: ["Esewa", "Khalti", "Cash On Delivery"],
    type: String,
    default: "Cash On Delivery",
  },
  paymentStatus: {
    type: String,
    enum: ["Completed", "Pending", "Cancelled"],
    default: "Pending",
  },
  orderStatus: {
    type: String,
    default: "Placed",
    enum: [
      "Placed",
      "Delivered",
      "Preparing",
      "Out for Delivery",
      "Cancelled",
      "Completed",
    ],
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
