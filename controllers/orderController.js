const Order = require("../models/Order");

const handlePlaceOrder = async (req, res) => {
  try {
    const order = new Order(req.body);
    await order.save();
    res.status(201).json({ status: true, message: "Order saved Successfully" });
  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
};
const handleGetOrderDetails = async (req, res) => {
  const orderId = req.params.id;
  try {
    const order = await Order.findById(orderId)
      .populate({
        path: "userId",
        select: "name email phone",
      })
      .populate({
        path: "deliveryAddress",
        select: "addressLine1 city state postalCode",
      });
      
    if (order) {
      res.status(200).json(order);
    } else {
      res.status(404).json({ status: false, message: "Order not Found" });
    }
  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
};
const handleGetUserOrders = async (req, res) => {
  const userId = req.user.id;
  try {
    const orders = await Order.find({ userId });
    if (orders) {
      res.status(200).json(orders);
    } else {
      res.status(404).json({ status: false, message: "Orders not found" });
    }
  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
};
const handleRateOrders = async (req, res) => {
  const orderId = req.params.id;
  const { rating, feedback } = req.body;

  try {
    const updatedOrder = await Order.findByIdAndUpdate(
      orderId,
      { rating, feedback },
      { new: true }
    );
    if (updatedOrder) {
      res
        .status(200)
        .json({ status: true, message: "Order updated successfully" });
    } else {
      res
        .status(404)
        .json({ status: false, message: "Failed to Update Order" });
    }
  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
};
const handleUpdateOrderStatus = async (req, res) => {
  const orderId = req.params.id;
  const { orderStatus } = req.body;

  try {
    const updatedOrder = await Order.findByIdAndUpdate(
      orderId,
      { orderStatus },
      { new: true }
    );
    if (updatedOrder) {
      res
        .status(200)
        .json({ status: true, message: "Order Status updated successfully" });
    } else {
      res
        .status(404)
        .json({ status: false, message: "Failed to Update Order Status" });
    }
  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
};

module.exports = {
  handlePlaceOrder,
  handleGetUserOrders,
  handleGetOrderDetails,
  handleRateOrders,
  handleUpdateOrderStatus,
};
