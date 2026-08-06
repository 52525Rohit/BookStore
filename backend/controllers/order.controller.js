import Cart from "../models/cart.model.js";
import Address from "../models/address.model.js";
import Order from "../models/order.model.js";

export const createOrder = async (req, res) => {
  try {
    const { addressId } = req.body;
    if (!addressId) {
      return res.status(400).json({ message: "addressId is required" });
    }
    const cart = await Cart.findOne({ user: req.userId }).populate("items.book");
    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ message: "Your cart is empty" });
    }
    const address = await Address.findOne({ _id: addressId, user: req.userId });
    if (!address) {
      return res.status(404).json({ message: "Address not found" });
    }

    const items = cart.items.map((item) => ({
      book: item.book._id,
      name: item.book.name,
      price: item.book.price,
      quantity: item.quantity,
    }));
    const totalAmount = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

    const order = await Order.create({
      user: req.userId,
      items,
      address: {
        fullname: address.fullname,
        phone: address.phone,
        line1: address.line1,
        line2: address.line2,
        city: address.city,
        state: address.state,
        postalCode: address.postalCode,
        country: address.country,
      },
      totalAmount,
    });

    cart.items = [];
    await cart.save();

    res.status(201).json({ message: "Order created successfully.", order });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getOrderDetails = async (req, res) => {
  try {
    const { orderId } = req.params;
    const order = await Order.findOne({ _id: orderId, user: req.userId });
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }
    res.status(200).json({ message: "Order details retrieved successfully.", order });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getOrderHistory = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.userId }).sort({ createdAt: -1 });
    res.status(200).json({ message: "Order history retrieved successfully.", orders });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
