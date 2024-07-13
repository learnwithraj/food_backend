const mongoose = require("mongoose");

const ratingSchema = mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  ratingType: {
    type: String,
    required: true,
    enum: ["Food"],
    default: "Food",
  },
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Food",
    required: true,
  },
  rating: {
    type: Number,
    min: 1,
    max: 5,
  },
});

const Rating = mongoose.model("Rating", ratingSchema);
module.exports = Rating;
