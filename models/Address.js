const mongoose = require("mongoose");

const addressSchema = mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "User",
  },

  addressTitle: {
    type: String,
    required: true,
  },
  location: {
    type: String,
    required: true,
  },
  customerName: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    required: true,
  },
  latitude: {
    type: Number,
    required: true,
  },
  longitude: {
    type: Number,
    required: true,
  },
  deliveryInstructions: {
    type: String,
  },
  default: {
    type: String,
    default: true,
  },
});

const Address = mongoose.model("Address", addressSchema);
module.exports = Address;
