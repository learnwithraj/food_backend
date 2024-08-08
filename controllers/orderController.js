const Order = require("../models/Order");

const handlePlaceOrder = async (req, res) => {
  const order = new Order({
    userId: req.user.id,
    orderItems: req.body.orderItems,
    orderTotal: req.body.orderTotal,
    deliveryFee: req.body.deliveryFee,
    grandTotal: req.body.grandTotal,
    deliveryAddress: req.body.deliveryAddress,
    paymentMethod: req.body.paymentMethod,
    paymentStatus: req.body.paymentStatus,
    orderStatus: req.body.orderStatus,
    orderDate: req.body.orderDate,
    rating: req.body.rating,
    feedback: req.body.feedback,
    discountAmount: req.body.discountAmount,
  });
  try {
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
        select: "addressTitle location customerName phone latitude longitude",
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
    const orders = await Order.find({ userId }).populate({
      path: "deliveryAddress",
      select: "addressTitle location customerName phone latitude longitude",
    });
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
