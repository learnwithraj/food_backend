const Cart = require("../models/Cart");

const handleAddProductToCart = async (req, res) => {
  const userId = req.user.id;
  const { productId, totalPrice, quantity } = req.body;
  let count;
  try {
    const existingProduct = await Cart.findOne({ userId, productId });
    count = await Cart.countDocuments({ userId });
    if (existingProduct) {
      existingProduct.quantity += 1;
      existingProduct.totalPrice += totalPrice;
      await existingProduct.save();
      res.status(200).json({ status: true, count: count });
    } else {
      const newCart = new Cart({
        userId: userId,
        productId: productId,
        instructions: req.body.instructions,
        quantity: quantity,
        totalPrice: totalPrice,
      });
      await newCart.save();
      count = await Cart.countDocuments({ userId });
      res.status(200).json({ status: true, count: count });
    }
  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
};
const handleRemoveProductFromCart = async (req, res) => {
  const itemId = req.params.id;
  const userId = req.user.id;
  try {
    const cartItem = await Cart.findById(itemId);
    if (!cartItem) {
      res.status(404).json({ message: "Cart item not found" });
    }
    await Cart.findByIdAndDelete(itemId);
    count = await Cart.countDocuments({ userId });
    res.status(200).json({ status: true, cartCount: count });
  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
};
const handleFetchUserCart = async (req, res) => {
  const userId = req.user.id;
  try {
    const userCart = await Cart.find({ userId: userId }).populate({
      path: "productId",
      select: "rating ratingCount",
    });
    res.status(200).json({ status: true, cart: userCart });
  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
};
const handleClearUserCart = async (req, res) => {
  const userId = req.user.id;
  let count;
  try {
    await Cart.deleteMany({ userId: userId });
    count = await Cart.countDocuments({ userId });
    res.status(200).json({
      status: true,
      count: count,
      message: "Cart cleared successfully",
    });
  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
};
const handleGetCartCount = async (req, res) => {
  const userId = req.user.id;
  try {
    const count = await Cart.countDocuments({ userId });

    res.status(200).json({ status: true, cartCount: count });
  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
};
const handleDecrementProductQuantity = async (req, res) => {
  const userId = req.user.id;
  const productId = req.body.productId;
  let count;
  try {
    const cartItem = await Cart.find({ userId, productId });
    if (!cartItem) {
      res.status(404).json({ message: "Cart item not found" });
    }
    const productPrice = cartItem.totalPrice / cartItem.quantity;
    if (cartItem.quantity > 1) {
      cartItem.quantity -= 1;
      cartItem.totalPrice -= productPrice;
      await cartItem.save();
      res
        .status(200)
        .json({ status: true, message: "Product quantity decreased" });
    } else if (cartItem.quantity == 1) {
      await Cart.findByIdAndDelete({ userId: userId, productId: productId });
      count = await Cart.countDocuments({ userId });
      return res.status(200).json({ status: true, cartCount: count });
    }
  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
};

module.exports = {
  handleAddProductToCart,
  handleClearUserCart,
  handleDecrementProductQuantity,
  handleFetchUserCart,
  handleGetCartCount,
  handleRemoveProductFromCart,
};
