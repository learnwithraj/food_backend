const Food = require("../models/Food");
const Offer = require("../models/Offer");

// Create a new offer
const handleCreateOffer = async (req, res) => {
  const {
    offerTitle,
    offerPercentage,
    offerStartDate,
    offerEndDate,
    applicableFoods,
  } = req.body;

  try {
    const newOffer = new Offer({
      offerTitle,
      offerPercentage,
      offerStartDate,
      offerEndDate,
      applicableFoods,
    });

    await newOffer.save();

    // Update the food items to include this offer
    await Food.updateMany(
      { _id: { $in: applicableFoods } },
      { $set: { offerPercentage } }
    );

    res
      .status(201)
      .json({
        status: true,
        message: "Offer created successfully",
        offer: newOffer,
      });
  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
};

// Get all offers
const handleGetOffers = async (req, res) => {
  try {
    const offers = await Offer.find().populate(
      "applicableFoods",
      "title price imageUrl"
    );
    res.status(200).json({ status: true, offers });
  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
};

// Get a single offer by ID
const handleGetOfferById = async (req, res) => {
  const id = req.params.id;

  try {
    const offer = await Offer.findById(id).populate(
      "applicableFoods",
      "title price imageUrl"
    );
    if (!offer) {
      return res
        .status(404)
        .json({ status: false, message: "Offer not found" });
    }
    res.status(200).json({ status: true, offer });
  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
};

// Update an offer
const handleUpdateOffer = async (req, res) => {
  const id = req.params.id;
  const {
    offerTitle,
    offerPercentage,
    offerStartDate,
    offerEndDate,
    applicableFoods,
  } = req.body;

  try {
    const offer = await Offer.findById(id);
    if (!offer) {
      return res
        .status(404)
        .json({ status: false, message: "Offer not found" });
    }

    offer.offerTitle = offerTitle || offer.offerTitle;
    offer.offerPercentage =
      offerPercentage !== undefined ? offerPercentage : offer.offerPercentage;
    offer.offerStartDate = offerStartDate || offer.offerStartDate;
    offer.offerEndDate = offerEndDate || offer.offerEndDate;
    offer.applicableFoods = applicableFoods || offer.applicableFoods;

    await offer.save();

    // Update the food items to include the updated offer percentage
    await Food.updateMany(
      { _id: { $in: applicableFoods } },
      { $set: { offerPercentage } }
    );

    res
      .status(200)
      .json({ status: true, message: "Offer updated successfully", offer });
  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
};

// Delete an offer
const handleDeleteOffer = async (req, res) => {
  const id = req.params.id;

  try {
    const offer = await Offer.findById(id);
    if (!offer) {
      return res
        .status(404)
        .json({ status: false, message: "Offer not found" });
    }

    // Remove the offer from the food items
    await Food.updateMany(
      { _id: { $in: offer.applicableFoods } },
      { $unset: { offerPercentage: "" } }
    );

    await offer.remove();
    res
      .status(200)
      .json({ status: true, message: "Offer deleted successfully" });
  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
};

// Get all foods with active offers
const handleGetFoodsWithOffers = async (req, res) => {
  try {
    const now = new Date();
    const offers = await Offer.find({
      offerStartDate: { $lte: now },
      offerEndDate: { $gte: now },
    }).populate("applicableFoods", "title price imageUrl offerPercentage");

    const foodsWithOffers = offers.map((offer) => offer.applicableFoods).flat();

    res.status(200).json({ status: true, foods: foodsWithOffers });
  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
};

module.exports = {
  handleCreateOffer,
  handleGetOffers,
  handleGetOfferById,
  handleUpdateOffer,
  handleDeleteOffer,
  handleGetFoodsWithOffers,
};
