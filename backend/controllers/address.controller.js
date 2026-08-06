import Address from "../models/address.model.js";

export const addAddress = async (req, res) => {
  try {
    const { fullname, phone, line1, line2, city, state, postalCode, country, isDefault } = req.body;
    if (!fullname || !phone || !line1 || !city || !state || !postalCode || !country) {
      return res.status(400).json({ message: "Missing required address fields" });
    }
    if (isDefault) {
      await Address.updateMany({ user: req.userId }, { isDefault: false });
    }
    const address = await Address.create({
      user: req.userId,
      fullname,
      phone,
      line1,
      line2,
      city,
      state,
      postalCode,
      country,
      isDefault: !!isDefault,
    });
    res.status(201).json({ message: "Address added successfully.", address });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getAddresses = async (req, res) => {
  try {
    const addresses = await Address.find({ user: req.userId }).sort({ isDefault: -1, createdAt: -1 });
    res.status(200).json({ message: "Addresses retrieved successfully.", addresses });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateAddress = async (req, res) => {
  try {
    const { addressId } = req.params;
    const address = await Address.findOne({ _id: addressId, user: req.userId });
    if (!address) {
      return res.status(404).json({ message: "Address not found" });
    }
    if (req.body.isDefault) {
      await Address.updateMany({ user: req.userId }, { isDefault: false });
    }
    const fields = ["fullname", "phone", "line1", "line2", "city", "state", "postalCode", "country", "isDefault"];
    for (const field of fields) {
      if (req.body[field] !== undefined) address[field] = req.body[field];
    }
    await address.save();
    res.status(200).json({ message: "Address updated successfully.", address });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteAddress = async (req, res) => {
  try {
    const { addressId } = req.params;
    const address = await Address.findOneAndDelete({ _id: addressId, user: req.userId });
    if (!address) {
      return res.status(404).json({ message: "Address not found" });
    }
    res.status(200).json({ message: "Address deleted successfully." });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
