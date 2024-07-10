const Food = require("../models/Food");
const Rating = require("../models/Rating");

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
      const foods = await Rating.aggregrate([
        {
          $match: {
            ratingType: req.body.ratingType,
            product: req.body.product,
          },
        },
        { $group: { _id: "$product" }, averageRating: { $avg: "$rating" } },
      ]);
      if (foods.length > 0) {
        const averageRating = foods[0].averageRating;
        await Food.findByIdAndUpdate(
          req.body.product,
          { rating: averageRating },
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
