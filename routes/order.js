const { verifyAndAuthorize, verifyAdmin } = require("../middleware/jwt");

const express = require("express");
const router = express.Router();
const {
  handlePlaceOrder,
  handleGetUserOrders,
  handleGetOrderDetails,
  handleRateOrders,
  handleUpdateOrderStatus,
} = require("./../controllers/orderController");

router.post("/", verifyAndAuthorize, handlePlaceOrder);
router.get("/:id", verifyAndAuthorize, handleGetOrderDetails);
router.get("/", verifyAndAuthorize, handleGetUserOrders);
router.post("/rate/:id", verifyAndAuthorize, handleRateOrders);
router.post("/status/:id", verifyAdmin, handleUpdateOrderStatus);

module.exports = router;
