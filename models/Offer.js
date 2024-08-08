const mongoose = require("mongoose");

// Offer Schema
const offerSchema = mongoose.Schema({
  offerTitle: {
    type: String,
    required: true,
  },
  offerPercentage: {
    type: Number,
    required: true,
  },
  offerStartDate: {
    type: Date,
    required: true,
  },
  offerEndDate: {
    type: Date,
    required: true,
  },
  applicableFoods: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "Food",
  }],
});

const Offer = mongoose.model("Offer", offerSchema);
module.exports = Offer;