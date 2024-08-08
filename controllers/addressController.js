const Address = require("../models/Address");

const handleCreateAddress = async (req, res) => {
  const address = new Address({
    userId: req.user.id,
    addressTitle: req.body.addressTitle,
    location: req.body.location,
    customerName: req.body.customerName,
    phone: req.body.phone,
    longitude: req.body.longitude,
    latitude: req.body.latitude,
    deliveryInstructions: req.body.deliveryInstructions,
    default: req.body.default,
  });
  try {
    if (req.body.default) {
      await Address.updateMany({ userId: req.user.id }, { default: false });
    }
    const savedAddress = await address.save();
    res.status(201).json({
      status: true,
      message: "Address saved successfully",
      data: {
        _id: savedAddress._id, 
      },
    });
  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
};

const handleDeleteAddress = async (req, res) => {
  const addressId = req.params.id;
  try {
    const address = await Address.findById(addressId);
    if (!address) {
      return res.status(404).json({ message: "Address not found" });
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
    addressTitle: req.body.addressTitle,
    location: req.body.location,
    customerName: req.body.customerName,
    phone: req.body.phone,
    latitude: req.body.latitude,
    longitude: req.body.longitude,
    deliveryInstructions: req.body.deliveryInstructions,
    default: req.body.default,
  };

  try {
    if (req.body.default) {
      await Address.updateMany({ userId: req.user.id }, { default: false });
    }
    const findingAddress = await Address.findById(addressId);
    if (!findingAddress) {
      return res.status(404).json({ message: "Address not found" });
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
      return res
        .status(200)
        .json({ status: true, message: "Address updated successfully " });
    } else {
      return res
        .status(404)
        .json({ status: false, message: "Address not found" });
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
