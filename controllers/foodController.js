const Food = require("../models/Food");

const handleAddFood = async (req, res) => {
  const data = req.body;
  try {
    const newFood = new Food(data);
    await newFood.save();
    res
      .status(201)
      .json({ status: true, message: "Food item created successfully" });
  } catch (error) {
    res.status(500).json({ status: false, messag: error.message });
  }
};
const handleGetAllFood = async (req, res) => {
  try {
    const allFood = await Food.find({}, { __v: 0 });
    res.status(200).json(allFood);
  } catch (error) {
    res.status(500).json({ status: false, messag: error.message });
  }
};
const handleUpdateFood = async (req, res) => {
  const id = req.params.id;
  const data = req.body;
  try {
    const food = await Food.findById(id);
    if (!food) {
      res.status(404).json({ message: "Food item not found" });
    }
    const updatedFood = await Food.findByIdAndUpdate(
      id,
      {
        $set: data,
      },
      {
        new: true,
        runValidators: true,
      }
    );
    if (!updatedFood) {
      res
        .status(200)
        .json({ status: false, message: "Food item not updated " });
    }
    res
      .status(200)
      .json({ status: true, message: "Food item updated successfully" });
  } catch (error) {
    res.status(500).json({ status: false, messag: error.message });
  }
};
const handleDeleteFood = async (req, res) => {
  const id = req.params.id;
  try {
    const food = await Food.findById(id);
    if (!food) {
      res.status(404).json({ message: "Food item not found" });
    }
    await Food.findByIdAndDelete(id);
    res
      .status(200)
      .json({ status: true, message: "Food item deleted successfully" });
  } catch (error) {
    res.status(500).json({ status: false, messag: error.message });
  }
};
const handleGetFoodById = async (req, res) => {
  const id = req.params.id;

  try {
    const food = await Food.findById(id, { __v: 0 });
    if (!food) {
      res.status(404).json({ message: "Food item not found" });
    }
    res.status(200).json(food);
  } catch (error) {
    res.status(500).json({ status: false, messag: error.message });
  }
};
const handleAddFoodTag = async (req, res) => {
  const { foodTag } = req.body;
  const id = req.params.id;
  try {
    const food = await Food.findById(id);
    if (!food) {
      res.status(404).json({ message: "Food item not found" });
    }
    if (food.foodTags.includes(foodTag)) {
      return res.status(404).json({ message: "Food tag already exist" });
    }
    food.foodTags.push(foodTag);
    await food.save();
    res
      .status(200)
      .json({ status: true, message: "Food tag added successfully" });
  } catch (error) {
    res.status(500).json({ status: false, messag: error.message });
  }
};
const handleAddFoodType = async (req, res) => {
  const { foodType } = req.body;
  const id = req.params.id;
  try {
    const food = await Food.findById(id);
    if (!food) {
      res.status(404).json({ message: "Food item not found" });
    }
    if (food.foodTypes.includes(foodType)) {
      return res.status(404).json({ message: "Food type already exist" });
    }
    food.foodTypes.push(foodType);
    await food.save();
    res
      .status(200)
      .json({ status: true, message: "Food type added successfully" });
  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
};
const handleGetRandomFoodByCategory = async (req, res) => {
  // const category = req.params.category;

  // try {
  //   let foods = await Food.aggregate([
  //     { $match: { category: category } },
  //     { $sample: { size: 5 } },
  //   ]);
  //   if (!foods || foods.length === 0) {
  //     foods = await Food.aggregate([{ $sample: { size: 5 } }]);
  //   }
  //   res.status(200).json(foods);
  // } catch (error) {
  //   res.status(500).json({ status: false, messag: error.message });
  // }
  try {
    let foods = [];
    if (req.params.category) {
      foods = await Food.aggregate([
        { $match: { category: req.params.category } },
        { $sample: { size: 5 } },
        { $project: { __v: 0 } },
      ]);
    }
    if (!foods.length) {
      foods = await Food.aggregate([
        { $sample: { size: 5 } },
        { $project: { __v: 0 } },
      ]);
    }
    if (foods.length) {
      res.status(200).json(foods);
    }
  } catch (error) {
    res.status(500).json({ status: false, messag: error.message });
  }
};

const handleFoodAvailability = async (req, res) => {
  const id = req.params.id;
  try {
    const food = await Food.findById(id);
    if (!food) {
      res.status(404).json({ message: "Food item not found" });
    }
    food.isAvailable = !food.isAvailable;
    await food.save();
    res.status(200).json({
      status: true,
      message: "Food availability toggled",
      isAvailable: food.isAvailable,
    });
  } catch (error) {
    res.status(500).json({
      status: false,
      message: error.message,
    });
  }
};
const handleSearchFood = async (req, res) => {
  const search = req.params.search;
  try {
    const results = await Food.aggregate([
      {
        $search: {
          index: "foods",
          text: {
            query: search,
            path: {
              wildcard: "*",
            },
          },
        },
      },
    ]);
    res.status(200).json(results);
  } catch (error) {
    res.status(500).json({
      status: false,
      message: error.message,
    });
  }
};
const handleGetRandomFood = async (req, res) => {
  try {
    let randomFoodList = [];
    if (req.params.code) {
      randomFoodList = await Food.aggregate([
        { $match: { code: req.params.code } },
        { $sample: { size: 5 } },
        { $project: { __v: 0 } },
      ]);
    }

    if (!randomFoodList.length) {
      randomFoodList = await Food.aggregate([
        { $sample: { size: 5 } },
        { $project: { __v: 0 } },
      ]);
    }
    if (randomFoodList.length) {
      res.status(200).json(randomFoodList);
    } else {
      res.status(404).json({ status: false, message: "No Food Found" });
    }
  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
};

const handleGetRandomFoodByCategoryAndCode = async (req, res) => {
  const { category, code } = req.params;

  try {
    let foods = await Food.aggregate([
      { $match: { category: category, code: code } },
      { $sample: { size: 5 } },
    ]);
    if (!foods || foods.length === 0) {
      foods = await Food.aggregate([
        { $match: { code: code } },
        { $sample: { size: 5 } },
      ]);
    } else {
      foods = await Food.aggregate([{ $sample: { size: 5 } }]);
    }
    res.status(200).json(foods);
  } catch (error) {
    res.status(500).json({ status: false, messag: error.message });
  }
};

module.exports = {
  handleAddFood,
  handleAddFoodTag,
  handleAddFoodType,
  handleDeleteFood,
  handleFoodAvailability,
  handleGetAllFood,
  handleGetFoodById,
  handleGetRandomFoodByCategory,
  handleUpdateFood,
 
  handleSearchFood,
  handleGetRandomFood,
  handleGetRandomFoodByCategoryAndCode,
};
