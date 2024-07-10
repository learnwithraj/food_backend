const express = require("express");
const {
  handleAddRating,
  handleCheckUserRating,
} = require("../controllers/ratingController");

const router = express.Router();

router.post("/", verifyAndAuthorize, handleAddRating);

router.get("/", verifyAndAuthorize, handleCheckUserRating);

module.exports = router;
