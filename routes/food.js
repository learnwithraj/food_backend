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
  handleSearchFood,
  handleGetRandomFood,
  handleGetRandomFoodByCategoryAndCode,

} = require("../controllers/foodController");
const { verifyAdmin } = require("../middleware/jwt");
const router = express.Router();

router.post("/", verifyAdmin, handleAddFood);
router.post("/tag/:id", verifyAdmin, handleAddFoodTag);
router.post("/type/:id", verifyAdmin, handleAddFoodType);
router.delete("/:id", verifyAdmin, handleDeleteFood);
router.patch("/:id", verifyAdmin, handleFoodAvailability);
router.put("/:id", verifyAdmin, handleUpdateFood);
router.get("/", handleGetAllFood);
router.get("/recommendation/:code", handleGetRandomFood);
router.get("/:id", handleGetFoodById);
router.get("/category/:category", handleGetRandomFoodByCategory);
router.get("/search/:search", handleSearchFood);
router.get("/:category/:code", handleGetRandomFoodByCategoryAndCode);


module.exports = router;
