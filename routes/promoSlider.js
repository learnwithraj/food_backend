const {
  handleUpdateSliderImage,
  handleGetAllSlider,
  handleDeleteSlider,
  handleAddSlider,
} = require("../controllers/promoSliderController");
const { verifyAdmin } = require("../middleware/jwt");

const express = require("express");
const router = express.Router();

router.post("/", verifyAdmin, handleAddSlider);
router.delete("/:id", verifyAdmin, handleDeleteSlider);
router.patch("/image/:id", verifyAdmin, handleUpdateSliderImage);
router.get("/", handleGetAllSlider);


module.exports = router;
