import crypto from "crypto";
import Order from "../models/order.model.js";



export const initiatePayment = async (req, res) => {
  try {
    const { orderId } = req.body;
    const order = await Order.findOne({ _id: orderId, user: req.userId });
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }
    if (order.paymentStatus === "paid") {
      return res.status(400).json({ message: "Order is already paid" });
    }

    const paymentId = `MOCK_${crypto.randomUUID()}`;
    order.paymentStatus = "processing";
    order.paymentId = paymentId;
    await order.save();

    res.status(200).json({
      message: "Payment initiation successful.",
      paymentId,
      orderId: order._id,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const handlePaymentCallback = async (req, res) => {
  try {
    const { orderId, paymentId, status = "success" } = req.body;
    const order = await Order.findOne({ _id: orderId, user: req.userId });
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }
    if (order.paymentId !== paymentId) {
      return res.status(400).json({ message: "Payment reference does not match this order" });
    }

    order.paymentStatus = status === "success" ? "paid" : "failed";
    await order.save();

    res.status(200).json({ message: "Payment callback handled successfully.", order });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
