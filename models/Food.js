const mongoose = require("mongoose");

const foodSchema = mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  foodTags: {
    type: Array,
    required: true,
  },
  foodTypes: {
    type: Array,
    required: true,
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "Category",
  },
  code: {
    type: String,
  },
 
  isAvailable: {
    type: Boolean,
    required: true,
    default: true,
  },
  rating: {
    type: Number,
    min: 1,
    max: 5,
    default: 5,
  },
  ratingCount: {
    type: String,
  },
  description: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },

  imageUrl: {
    type: Array,
    required: true,
  },
  time: {
    type: String,
  },
});

const Food = mongoose.model("Food", foodSchema);
module.exports = Food;
