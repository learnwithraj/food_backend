const express = require("express");

const router = express.Router();
const {
  handleGetUser,
  handleUpdateUser,
  handleDeleteUser,
  handleUpdateUserPassword,
} = require("./../controllers/userController");
const { verifyAndAuthorize } = require("./../middleware/jwt");

router.delete("/", verifyAndAuthorize, handleDeleteUser);
router.put("/", verifyAndAuthorize, handleUpdateUser);
router.get("/", verifyAndAuthorize, handleGetUser);
router.post("/change-password", verifyAndAuthorize, handleUpdateUserPassword);

module.exports = router;
