const User = require("../models/User");
var admin = require("firebase-admin");
const { getAuth } = require("firebase-admin/auth");

const handleGetUser = async (req, res) => {
  const userId = req.user.id;
  try {
    const user = await User.findById(
      { _id: userId },
      { password: 0, __v: 0, createdAt: 0, updatedAt: 0 }
    );
    // res.status(200).json({ status: true, user });
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({
      status: false,
      message: error.message,
    });
  }
};


const handleDeleteUser = async (req, res) => {
  const userId = req.user.id;

  try {
  
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ status: false, message: "User not found" });
    }

    const firebaseUid = user.uid; 

    // Delete user from Firebase  using UID
    await admin.auth().deleteUser(firebaseUid);

    // Delete user from your MongoDB database
    await User.findByIdAndDelete(userId);

    res
      .status(200)
      .json({ status: true, message: "Account Deleted successfully" });
  } catch (error) {
    res.status(500).json({
      status: false,
      message: error.message,
    });
  }
};

const handleUpdateUser = async (req, res) => {
  const userId = req.user.id;
  const { firstName, lastName, email, phone } = req.body;

  try {
    // Update user in MongoDB
    const user = await User.findByIdAndUpdate(
      userId,
      {
        firstName,
        lastName,
        email,
        phone,
      },
      { new: true, select: "-password -__v -createdAt -updatedAt" }
    );

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Update user in Firebase 
    await getAuth().updateUser(user.uid, {
      email: email,
    });

    res
      .status(200)
      .json({ status: true, message: "User Updated Successfully" });
  } catch (error) {
    res.status(500).json({
      status: false,
      message: error.message,
    });
  }
};

const handleUpdateUserPassword = async (req, res) => {
  const { oldPassword, newPassword } = req.body;
  try {
    const user = await User.findById(req.user.id); 

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (!(await user.comparePassword(oldPassword))) {
      return res
        .status(401)
        .json({ status: false, message: "Incorrect old password" });
    }

    user.password = newPassword;
    await user.save();
    res.json({ message: "Password changed successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  handleDeleteUser,
  handleGetUser,
  handleUpdateUser,
  handleUpdateUserPassword,
};
