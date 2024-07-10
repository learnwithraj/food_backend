const User = require("../models/User");

const handleGetUser = async (req, res) => {
  const userId = req.user.id;
  try {
    const user = await User.findById(
      { _id: userId },
      { password: 0, __v: 0, createdAt: 0, updatedAt: 0 }
    );
    res.status(200).json({ status: true, user });
  } catch (error) {
    res
      .status(500)
      .json({
        status: false,
        message: "Error getting user",
        error: error.message,
      });
  }
};

const handleDeleteUser = async (req, res) => {
  const userId = req.user.id;
  try {
    await User.findByIdAndDelete(userId);
    res
      .status(200)
      .json({ status: true, message: "User Deleted successfully" });
  } catch (error) {
    res
      .status(500)
      .json({
        status: false,
        message: "Error deleting user",
        error: error.message,
      });
  }
};

const handleUpdateUser = async (req, res) => {
  const userId = req.user.id;
  try {
    const user = await User.findByIdAndUpdate(
      userId,
      {
        $set: req.body,
      },
      { new: true }
    );
    if (!user) {
      return res.status(404).json({ message: "User not Found" });
    }
    res
      .status(200)
      .json({ status: true, message: "User updated successfully" });
  } catch (error) {
    res
      .status(500)
      .json({
        status: false,
        message: "Error updating user",
        error: error.message,
      });
  }
};

module.exports = {
  handleDeleteUser,
  handleGetUser,
  handleUpdateUser,
};
