const Category = require("../models/Category");

const handleCreateCategory = async (req, res) => {
  const data = req.body;
  try {
    const newCategory = new Category(data);
    await newCategory.save();
    res
      .status(201)
      .json({ status: true, message: "Category created successfully" });
  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
};

const handleDeleteCategory = async (req, res) => {
  const id = req.params.id;
  try {
    const category = await Category.findById(id);
    if (!category) {
      res.status(404).json({ message: "Category not Found" });
    }
    await Category.findByIdAndDelete(id);
    res
      .status(200)
      .json({ status: true, message: "Category Deleted successfully" });
  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
};

const handleUpdateCategory = async (req, res) => {
  const id = req.params.id;
  const { title, value, imageUrl } = req.body;
  try {
    const category = await Category.findById(id);
    if (!category) {
      res.status(404).json({ message: "Category not Found" });
    }
    await Category.findByIdAndUpdate(id, {
      title: title,
      value: value,
      imageUrl: imageUrl,
    });
    res
      .status(200)
      .json({ status: true, message: "Category updated successfully" });
  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
};

const handleGetAllCategory = async (req, res) => {
  try {
    const allCategory = await Category.find({}, { __v: 0 });
    res.status(200).json(allCategory);
  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
};

const handleUpdateCategoryImage = async (req, res) => {
  const id = req.params.id;
  try {
    const existingCategory = await Category.findById(id);
    if (!existingCategory) {
      res.status(404).json({ message: "Category not Found" });
    }
    await Category.findByIdAndUpdate(id, {
      title: existingCategory.title,
      value: existingCategory.value,
      imageUrl: req.body.imageUrl,
    },{
      new:true,
      runValidators:true
  });
    res
      .status(200)
      .json({ status: true, message: "Category Image updated succesfully" });
  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
};

module.exports = {
  handleCreateCategory,
  handleDeleteCategory,
  handleGetAllCategory,
  handleUpdateCategory,
  handleUpdateCategoryImage,
};
