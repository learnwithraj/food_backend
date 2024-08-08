const express = require("express");
const {
  handleAddFood,
  handleAddFoodTag,
  handleAddFoodType,
  handleDeleteFood,
  handleUpdateFood,
  handleFoodAvailability,
  handleAllFoodAvailability,
  handleGetFoodById,
  handleGetRandomFood,
  handleSearchFood,
  handleGetAllFoods,
  handleGetVegFoodsByCategory,
  handleGetNonVegFoodsByCategory,
  handleGetNewestFood,
  handleGetAllFoodsByCategory,
  handleGetBestRatedFoods,
  // handleGetFoodsBySubcategory,
} = require("../controllers/foodController");
const { verifyAdmin } = require("../middleware/jwt");
const router = express.Router();

router.post("/", verifyAdmin, handleAddFood);
router.post("/tag/:id", verifyAdmin, handleAddFoodTag);
router.post("/type/:id", verifyAdmin, handleAddFoodType);
router.delete("/:id", verifyAdmin, handleDeleteFood);
router.patch("/available/:id", verifyAdmin, handleFoodAvailability);
router.patch("/all/available/", verifyAdmin, handleAllFoodAvailability);
router.put("/:id", verifyAdmin, handleUpdateFood);

router.get("/", handleGetAllFoods);

router.get("/category/:categoryId/veg", handleGetVegFoodsByCategory);
router.get("/category/:categoryId/non-veg", handleGetNonVegFoodsByCategory);
router.get("/category/:categoryId/all", handleGetAllFoodsByCategory);

router.get("/newest/", handleGetNewestFood);
router.get("/recommendation/:code", handleGetRandomFood);
router.get("/:id", handleGetFoodById);
router.get("/rating/best-rated/", handleGetBestRatedFoods);
router.get("/search/:search", handleSearchFood);

module.exports = router;

// router.get("/subcategory/:subcategory", handleGetFoodsBySubcategory);