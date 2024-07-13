const { verifyAdmin } = require("../middleware/jwt");
const {
  handleCreateCategory,
  handleDeleteCategory,
  handleGetAllCategory,
  handleUpdateCategory,
  handleUpdateCategoryImage,
  handleGetRandomCategory,
} = require("./../controllers/categoryController");
const express = require("express");
const router = express.Router();

router.post("/", verifyAdmin, handleCreateCategory);
router.delete("/:id", verifyAdmin, handleDeleteCategory);
router.get("/", handleGetAllCategory);
router.put("/:id", verifyAdmin, handleUpdateCategory);
router.patch("/image/:id", verifyAdmin, handleUpdateCategoryImage);
router.get("/random", handleGetRandomCategory);

module.exports = router;
