const Food = require("../models/Food");

const Category = require("../models/Category");


const handleAddFood = async (req, res) => {
  const data = req.body;
  try {
    const newFood = new Food(data);
    await newFood.save();
    res
      .status(201)
      .json({ status: true, message: "Food item created successfully" });
  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
};

const handleUpdateFood = async (req, res) => {
  const id = req.params.id;
  const data = req.body;
  try {
    const food = await Food.findById(id);
    if (!food) {
      return res.status(404).json({ message: "Food item not found" });
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
      return res
        .status(200)
        .json({ status: false, message: "Food item not updated " });
    }
    res
      .status(200)
      .json({ status: true, message: "Food item updated successfully" });
  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
};

const handleDeleteFood = async (req, res) => {
  const id = req.params.id;
  try {
    const food = await Food.findById(id);
    if (!food) {
      return res.status(404).json({ message: "Food item not found" });
    }
    await Food.findByIdAndDelete(id);
    res
      .status(200)
      .json({ status: true, message: "Food item deleted successfully" });
  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
};

const handleAddFoodTag = async (req, res) => {
  const { foodTag } = req.body;
  const id = req.params.id;
  try {
    const food = await Food.findById(id);
    if (!food) {
      return res.status(404).json({ message: "Food item not found" });
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
    res.status(500).json({ status: false, message: error.message });
  }
};

const handleAddFoodType = async (req, res) => {
  const { foodType } = req.body;
  const id = req.params.id;
  try {
    const food = await Food.findById(id);
    if (!food) {
      return res.status(404).json({ message: "Food item not found" });
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

const handleFoodAvailability = async (req, res) => {
  const id = req.params.id;
  try {
    const food = await Food.findById(id);
    if (!food) {
      return res.status(404).json({ message: "Food item not found" });
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

const handleAllFoodAvailability = async (req, res) => {
  try {
    const foods = await Food.find();

    if (!foods || foods.length === 0) {
      return res.status(404).json({ message: "No food items found" });
    }

    // Toggle the availability for each food item
    const updatedFoods = await Promise.all(
      foods.map(async (food) => {
        food.isAvailable = !food.isAvailable;
        return await food.save();
      })
    );

    res.status(200).json({
      status: true,
      message: "All food availability toggled",
      foods: updatedFoods,
    });
  } catch (error) {
    res.status(500).json({
      status: false,
      message: error.message,
    });
  }
};

const handleGetNewestFood = async (req, res) => {
  try {
 
    const allFood = await Food.find({ isAvailable: true }, { __v: 0 })
      .sort({ createdAt: -1 })
      .limit(15);
    res.status(200).json(allFood);
  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
};

const handleGetFoodById = async (req, res) => {
  const id = req.params.id;

  try {
    const food = await Food.findById(id, { __v: 0 });
    if (!food) {
      return res.status(404).json({ message: "Food item not found" });
    }
    res.status(200).json(food);
  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
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
            path: ["title", "description"], 
            fuzzy: {
              maxEdits: 1, 
              prefixLength: 2, 
            },
          },
        },
      },
      // {
      //   $limit: 10, 
      // },
    ]);

    res.status(200).json(results);
  } catch (error) {
    res.status(500).json({
      status: false,
      message: error.message,
    });
  }
};

//recommended foods
const handleGetRandomFood = async (req, res) => {
  const { code } = req.params;

  try {
    let foods = await Food.aggregate([
      { $match: { code: code, isAvailable: true } },
      { $sample: { size: 10 } },
    ]);
    if (!foods || foods.length === 0) {
      foods = await Food.aggregate([{ $sample: { size: 10 } }]);
    }
    res.status(200).json(foods);
  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
};

//best rated foods
const handleGetBestRatedFoods = async (req, res) => {
  try {
    const foods = await Food.find({ isAvailable: true })
      .sort({ rating: -1 })
      .limit(10)
      .select({ __v: 0 });

    res.status(200).json(foods);
  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
};

const handleGetAllFoodsByCategory = async (req, res) => {
  const { categoryId } = req.params;

  try {
    // Check if the category exists
    const category = await Category.findById(categoryId);
    if (!category) {
      return res
        .status(404)
        .json({ status: false, message: "Category not found" });
    }

    // Fetch all foods associated with the category
    const foods = await Food.find({
      category: categoryId,
      isAvailable: true,
    });
    // .populate("category", "title value");

    if (!foods.length) {
      // foods = await Food.find({ isAvailable: true });
      return res.status(404).json({
        status: false,
        message: "No Food Items Found for this Category",
      });
    }

    res.status(200).json(foods);
  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
};

const handleGetAllFoods = async (req, res) => {
  try {
    const foods = await Food.find({ isAvailable: true });
    // .populate(
    //   "category",
    //   "title value"
    // );
    if (!foods.length) {
      return res
        .status(404)
        .json({ status: false, message: "No Food Items Found" });
    }
    res.status(200).json(foods);
  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
};

const handleGetVegFoodsByCategory = async (req, res) => {
  const { categoryId } = req.params;

  try {
    // Check if the category exists
    const category = await Category.findById(categoryId);
    if (!category) {
      return res
        .status(404)
        .json({ status: false, message: "Category not found" });
    }

  
    const foods = await Food.find({
      category: categoryId,
      type: "Veg",
      isAvailable: true,
    });
    // .populate("category", "title value");

    if (!foods.length) {
      return res.status(404).json({
        status: false,
        message: "No Veg Food Items Found for this Category",
      });
    }

    res.status(200).json(foods);
  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
};

const handleGetNonVegFoodsByCategory = async (req, res) => {
  const { categoryId } = req.params;

  try {
    // Check if the category exists
    const category = await Category.findById(categoryId);
    if (!category) {
      return res
        .status(404)
        .json({ status: false, message: "Category not found" });
    }

   
    const foods = await Food.find({
      category: categoryId,
      type: "Non-veg",
      isAvailable: true,
    });
    // .populate("category", "title value");

    if (!foods.length) {
      return res.status(404).json({
        status: false,
        message: "No Non-Veg Food Items Found for this Category",
      });
    }

    res.status(200).json(foods);
  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
};

module.exports = {
  handleAddFood,
  handleAddFoodTag,
  handleAddFoodType,
  handleDeleteFood,
  handleUpdateFood,
  handleFoodAvailability,
  handleGetFoodById,
  handleGetAllFoodsByCategory,
  handleSearchFood,
  handleGetAllFoods,
  handleGetVegFoodsByCategory,
  handleGetNonVegFoodsByCategory,
  handleGetNewestFood,
  handleGetRandomFood,
  handleAllFoodAvailability,
  handleGetBestRatedFoods,
 
};
