import crypto from "crypto";
import Razorpay from "razorpay";
import Order from "../models/order.model.js";

let razorpay;
function getRazorpay() {
  if (!razorpay) {
    razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    });
  }
  return razorpay;
}

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

    const razorpayOrder = await getRazorpay().orders.create({
      amount: Math.round(order.totalAmount * 100), // paise
      currency: "INR",
      receipt: String(order._id),
    });

    order.paymentStatus = "processing";
    order.razorpayOrderId = razorpayOrder.id;
    await order.save();

    res.status(200).json({
      message: "Payment initiation successful.",
      razorpayOrderId: razorpayOrder.id,
      amount: razorpayOrder.amount,
      currency: razorpayOrder.currency,
      keyId: process.env.RAZORPAY_KEY_ID,
      orderId: order._id,
    });
  } catch (error) {
    res.status(500).json({ message: error.error?.description || error.message || "Payment initiation failed" });
  }
};

export const handlePaymentCallback = async (req, res) => {
  try {
    const { orderId, razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;
    const order = await Order.findOne({ _id: orderId, user: req.userId });
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }
    if (order.razorpayOrderId !== razorpay_order_id) {
      return res.status(400).json({ message: "Payment reference does not match this order" });
    }

    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest("hex");

    if (expectedSignature !== razorpay_signature) {
      order.paymentStatus = "failed";
      await order.save();
      return res.status(400).json({ message: "Payment verification failed" });
    }

    order.paymentStatus = "paid";
    order.paymentId = razorpay_payment_id;
    await order.save();

    res.status(200).json({ message: "Payment verified successfully.", order });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
