const mongoose = require("mongoose");

const addressSchema = mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "User",
  },
  addressLine1: {
    type: String,
    required: true,
  },
  city: {
    type: String,
    required: true,
  },
  province: {
    type: String,
    required: true,
  },
  district: {
    type: String,
    required: true,
  },
  postalCode: {
    type: String,
    required: true,
  },
  country: {
    type: String,
    required: true,
  },
  deliveryInstructions: {
    type: String,
  },
  default: {
    type: Boolean,
    default: true,
  },
});

const Address = mongoose.model("Address", addressSchema);
module.exports = Address;
