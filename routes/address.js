const express = require("express");

const router = express.Router();
const { verifyAndAuthorize } = require("../middleware/jwt");
const {
  handleCreateAddress,
  handleDeleteAddress,
  handleGetDefaultAddress,
  handleGetUserAddresses,
  handleSetDefaultAddress,
  handleUpdateAddress,
} = require("../controllers/addressController");

router.post("/", verifyAndAuthorize, handleCreateAddress);
router.delete("/:id", verifyAndAuthorize, handleDeleteAddress);
router.get("/default", verifyAndAuthorize, handleGetDefaultAddress);
router.get("/", verifyAndAuthorize, handleGetUserAddresses);
router.post("/default/:id", verifyAndAuthorize, handleSetDefaultAddress);
router.put("/:id", verifyAndAuthorize, handleUpdateAddress);

module.exports = router;
