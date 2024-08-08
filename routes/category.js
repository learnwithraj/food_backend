const { verifyAdmin } = require("../middleware/jwt");
const {
  handleCreateCategory,
  handleDeleteCategory,
  handleGetAllCategory,
  handleUpdateCategory,
  handleUpdateCategoryImage,
  handleGetBestCategory,
} = require("./../controllers/categoryController");
const express = require("express");
const router = express.Router();

router.post("/", verifyAdmin, handleCreateCategory);
router.delete("/:id", verifyAdmin, handleDeleteCategory);
router.put("/:id", verifyAdmin, handleUpdateCategory);
router.patch("/image/:id", verifyAdmin, handleUpdateCategoryImage);
router.get("/", handleGetAllCategory);
router.get("/best", handleGetBestCategory);

module.exports = router;
