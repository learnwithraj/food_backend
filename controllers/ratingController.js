const Food = require("../models/Food");
const Rating = require("../models/Rating");
const mongoose = require("mongoose");

const handleAddRating = async (req, res) => {
  const newRating = Rating({
    userId: req.user.id,
    ratingType: req.body.ratingType,
    product: req.body.product,
    rating: req.body.rating,
  });
  try {
    await newRating.save();
    if (req.body.ratingType === "Food") {
      const foods = await Rating.aggregate([
        {
          $match: {
            ratingType: req.body.ratingType,
            product: new mongoose.Types.ObjectId(req.body.product),
          },
        },
        {
          $group: {
            _id: "$product",
            averageRating: { $avg: "$rating" },
            ratingCount: { $sum: 1 },
          },
        },
      ]);
      if (foods.length > 0) {
        const averageRating = foods[0].averageRating;
        const ratingCount = foods[0].ratingCount;

        // Update Food document with new average rating and increment ratingCount
        await Food.findByIdAndUpdate(
          req.body.product,
          { rating: averageRating, ratingCount: ratingCount },
          { new: true }
        );
      }
    }

    res
      .status(200)
      .json({ status: true, message: "Rating updated Successfully" });
  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
};
const handleCheckUserRating = async (req, res) => {
  const ratingType = req.query.ratingType;
  const product = req.query.product;

  try {
    const existingRating = await Rating.findOne({
      userId: req.user.id,
      product: product,
      ratingType: ratingType,
    });

    if (existingRating) {
      res.status(200).json({
        status: true,
        message: "You have already rated this Food",
      });
    } else {
      res
        .status(200)
        .json({ status: false, message: "You have not rated this Food" });
    }
  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
};

module.exports = {
  handleAddRating,
  handleCheckUserRating,
};
