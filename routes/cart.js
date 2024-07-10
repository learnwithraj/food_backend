const express = require("express");
const {
  handleAddProductToCart,
  handleClearUserCart,
  handleDecrementProductQuantity,
  handleFetchUserCart,
  handleGetCartCount,
  handleRemoveProductFromCart,
} = require("../controllers/cartController");
const router = express.Router();
const { verifyAndAuthorize } = require("../middleware/jwt");

router.post("/", verifyAndAuthorize, handleAddProductToCart);
router.post("/decrement", verifyAndAuthorize, handleDecrementProductQuantity);
router.get("/", verifyAndAuthorize, handleFetchUserCart);
router.get("/count", verifyAndAuthorize, handleGetCartCount);
router.delete("/clear", verifyAndAuthorize, handleClearUserCart);
router.delete("/delete/:id", verifyAndAuthorize, handleRemoveProductFromCart);

module.exports=router;
