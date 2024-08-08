const mongoose = require("mongoose");

const SliderSchema = mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  imageUrl: {
    type: String,
    required: true,
  },
});

const Slider = mongoose.model("Slider", SliderSchema);
module.exports = Slider;
