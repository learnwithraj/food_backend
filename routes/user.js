const express = require("express");

const router = express.Router();
const {
  handleGetUser,
  handleUpdateUser,
  handleDeleteUser,
} = require("./../controllers/userController");
const { verifyAndAuthorize } = require("./../middleware/jwt");

router.get("/", verifyAndAuthorize, handleGetUser);
router.delete("/", verifyAndAuthorize, handleDeleteUser);
router.put("/", verifyAndAuthorize, handleUpdateUser);

module.exports = router;
