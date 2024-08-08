const Cart = require("../models/Cart");



const handleAddProductToCart = async (req, res) => {
  const userId = req.user.id;
  const { productId, totalPrice, quantity = 1 } = req.body;

  try {
    // Check if the product is already in the cart
    const existingProduct = await Cart.findOne({ userId, productId });

    // Count the total number of products in the cart
    const count = await Cart.countDocuments({ userId });

    if (existingProduct) {
     
      return res
        .status(400)
        .json({ status: false, message: "Product already in cart" });
    
    } else {
    
      const newCart = new Cart({
        userId: userId,
        productId: productId,
        instructions: req.body.instructions,
        quantity: quantity,
        totalPrice: totalPrice,
      });
      await newCart.save();
      const newCount = await Cart.countDocuments({ userId });
      res.status(201).json({ status: true, cartCount: newCount });
    }
  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
};

const handleRemoveProductFromCart = async (req, res) => {
  const cartItemId = req.params.id;
  const userId = req.user.id;
  try {
    
    await Cart.findByIdAndDelete({ _id: cartItemId });
    const count = await Cart.countDocuments({ userId: userId });
    res.status(200).json({ status: true, count: count });
  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
};

const handleFetchUserCart = async (req, res) => {
  const userId = req.user.id;
  try {
    const userCart = await Cart.find({ userId: userId }).populate({
      path: "productId",
      select: "title price rating ratingCount imageUrl",
    });
    res.status(200).json(userCart);
  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
};


const handleClearUserCart = async (req, res) => {
  const userId = req.user.id;

  try {
    // Check if there are items in the cart
    const cartItems = await Cart.find({ userId: userId });

    if (cartItems.length === 0) {
      return res.status(404).json({
        status: false,
        message: "No items found in the cart",
      });
    }


    await Cart.deleteMany({ userId: userId });

    const count = await Cart.countDocuments({ userId });

    res.status(200).json({
      status: true,
      cartCount: count,
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
    const cartItem = await Cart.findOne({ userId, productId }).populate(
      "productId"
    );

    if (!cartItem) {
      return res
        .status(404)
        .json({ status: false, message: "Cart item not found" });
    }

    const productPrice = cartItem.productId.price;

    if (cartItem.quantity > 1) {
      cartItem.quantity -= 1;
      cartItem.totalPrice = cartItem.quantity * productPrice;
      await cartItem.save();
      count = await Cart.countDocuments({ userId });
      return res.status(200).json({
        status: true,
        cartCount: count,
        message: "Product quantity decreased",
      });
    } else if (cartItem.quantity == 1) {
      return res
        .status(400)
        .json({ status: false, message: "Cannot decrease quantity below 1" });
    }
  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
};


const handleGetCartTotalPrice = async (req, res) => {
  const userId = req.user.id;

  try {
    // Fetch cart items with populated product details
    const cartItems = await Cart.find({ userId }).populate("productId");

    // Calculate the total price
    const totalPrice = cartItems.reduce((acc, item) => {
      return acc + item.quantity * item.productId.price;
    }, 0);

    res.status(200).json({ status: true, totalPrice: totalPrice });
  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
};

const handleIncrementCartItem = async (req, res) => {
  const userId = req.user.id;
  const { productId } = req.body;

  try {
    const cartItem = await Cart.findOne({ userId, productId }).populate(
      "productId"
    );

    if (cartItem) {
      cartItem.quantity += 1;
      cartItem.totalPrice = cartItem.quantity * cartItem.productId.price; // Correctly calculate totalPrice
      await cartItem.save();
      res
        .status(200)
        .json({ status: true, message: "Item quantity increased." });
    } else {
      res
        .status(404)
        .json({ status: false, message: "Item not found in cart." });
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
  handleGetCartTotalPrice,
  handleIncrementCartItem,
};
