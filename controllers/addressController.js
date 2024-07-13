const Address = require("../models/Address");

const handleCreateAddress = async (req, res) => {
  const address = new Address({
    userId: req.user.id,
    addressLine1: req.body.addressLine1,
    city: req.body.city,
    province: req.body.province,
    district: req.body.district,
    postalCode: req.body.postalCode,
    country: req.body.country,
    deliveryInstructions: req.body.deliveryInstructions,
    default: req.body.default,
  });
  try {
    if (req.body.default) {
      await Address.updateMany({ userId: req.user.id }, { default: false });
    }
    await address.save();
    res
      .status(201)
      .json({ status: true, message: "Address saved successfully" });
  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
};
const handleDeleteAddress = async (req, res) => {
  const addressId = req.params.id;
  try {
    const address = await Address.findById(addressId);
    if (!address) {
      res.status(404).json({ message: "Address not found" });
    }
    await Address.findByIdAndDelete(addressId);
    res
      .status(200)
      .json({ status: true, message: "Address deleted successfully" });
  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
};
const handleGetDefaultAddress = async (req, res) => {
  const userId = req.user.id;
  try {
    const defaultAddress = await Address.findOne({ userId, default: true });
    res.status(200).json(defaultAddress);
  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
};
const handleGetUserAddresses = async (req, res) => {
  const userId = req.user.id;
  try {
    const address = await Address.find({ userId });
    res.status(200).json(address);
  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
};
const handleUpdateAddress = async (req, res) => {
  const addressId = req.params.id;

  const address = {
    addressLine1: req.body.addressLine1,
    city: req.body.city,
    province: req.body.province,
    district: req.body.district,
    postalCode: req.body.postalCode,
    country: req.body.country,
    deliveryInstructions: req.body.deliveryInstructions,
    default: req.body.default,
  };

  try {
    if (req.body.default) {
      await Address.updateMany({ userId: req.user.id }, { default: false });
    }
    const findingAddress = await Address.findById(addressId);
    if (!findingAddress) {
      res.status(404).json({ message: "Address not found" });
    }
    const updatedAddress = await Address.findByIdAndUpdate(
      addressId,
      { $set: address },
      {
        new: true,
      }
    );
    if (!updatedAddress) {
      res.status(404).json({ message: "Address not updated" });
    }
    res
      .status(200)
      .json({ status: true, message: "Address updated Successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ status: false, message: error.message });
  }
};
const handleSetDefaultAddress = async (req, res) => {
  const addressId = req.params.id;
  const userId = req.user.id;

  try {
    await Address.updateMany({ userId }, { default: false });
    const updatedAddress = await Address.findByIdAndUpdate(
      addressId,
      { default: true },
      { new: true }
    );
    if (updatedAddress) {
      res
        .status(200)
        .json({ status: true, message: "Address updated successfully " });
    } else {
      res.status(404).json({ status: false, message: "Address not found" });
    }
  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
};

module.exports = {
  handleCreateAddress,
  handleDeleteAddress,
  handleGetDefaultAddress,
  handleGetUserAddresses,
  handleSetDefaultAddress,
  handleUpdateAddress,
};
