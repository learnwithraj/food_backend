const express = require("express");
const {
  handleAddFood,
  handleAddFoodTag,
  handleAddFoodType,
  handleDeleteFood,
  handleFoodAvailability,
  handleGetAllFood,
  handleGetFoodById,
  handleGetRandomFoodByCategory,
  handleUpdateFood,
  // handleGetRandomFoodByCategoryAndCode,
  
  handleSearchFood,
  handleGetRandomFood,
  handleGetRandomFoodByCategoryAndCode,
  // handleGetRandomFoodByCode,
} = require("../controllers/foodController");
const { verifyVendor } = require("../middleware/jwt");
const router = express.Router();

router.post("/", verifyVendor, handleAddFood);
router.post("/tag/:id", verifyVendor, handleAddFoodTag);
router.post("/type/:id", verifyVendor, handleAddFoodType);
router.delete("/:id", verifyVendor, handleDeleteFood);
router.patch("/:id", verifyVendor, handleFoodAvailability);
router.get("/", handleGetAllFood);
router.get("/recommendation", handleGetRandomFood);
router.get("/:id", handleGetFoodById);
router.get("/:category/:code", handleGetRandomFoodByCategory);
router.get("/category/:category", handleGetRandomFoodByCategoryAndCode);
router.put("/:id", verifyVendor, handleUpdateFood);

router.get("/search/:search", handleSearchFood);
// router.get("/:code", handleGetRandomFoodByCode);
// router.get("/:category/:code", handleGetRandomFoodByCategoryAndCode);

module.exports = router;
