const Slider = require("../models/PromoSlider");

const handleAddSlider = async (req, res) => {
  const data = req.body;
  try {
    const newSlider = new Slider(data);
    await newSlider.save();
    res
      .status(201)
      .json({ status: true, message: "Slider added successfully" });
  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
};

const handleUpdateSliderImage = async (req, res) => {
  const id = req.params.id;
  try {
    const existingSlider = await Slider.findById(id);
    if (!existingSlider) {
     return res.status(404).json({ message: "Slider not Found" });
    }
    await Slider.findByIdAndUpdate(
      id,
      {
        title: existingSlider.title,
        imageUrl: req.body.imageUrl,
      },
      {
        new: true,
        runValidators: true,
      }
    );
    res
      .status(200)
      .json({ status: true, message: "Slider image updated succesfully" });
  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
};

const handleDeleteSlider = async (req, res) => {
  const id = req.params.id;
  try {
    const slider = await Slider.findById(id);
    if (!slider) {
     return res.status(404).json({ message: "Slider not Found" });
    }
    await Slider.findByIdAndDelete(id);
    res
      .status(200)
      .json({ status: true, message: "Slider Deleted successfully" });
  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
};

const handleGetAllSlider = async (req, res) => {
  try {
    const allSlider = await Slider.find({}, { __v: 0 });
    res.status(200).json(allSlider);
  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
};

module.exports = {
  handleAddSlider,
  handleUpdateSliderImage,
  handleDeleteSlider,
  handleGetAllSlider,
};
