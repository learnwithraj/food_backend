const { handleCreateOffer, handleDeleteOffer, handleUpdateOffer, handleGetFoodsWithOffers, handleGetOfferById, handleGetOffers } = require("../controllers/offerController");
const { verifyAdmin } = require("../middleware/jwt");

const express = require("express");
const router = express.Router();

router.post("/", verifyAdmin, handleCreateOffer);
router.delete("/:id", verifyAdmin, handleDeleteOffer);
router.put("/:id", verifyAdmin, handleUpdateOffer);
router.get("/food", handleGetFoodsWithOffers);
router.get("/:id", handleGetOfferById);
router.get("/", handleGetOffers);

module.exports = router;
