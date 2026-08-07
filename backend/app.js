import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import bookRoute from "./route/book.route.js";
import cartRoute from "./route/cart.route.js";
import addressRoute from "./route/address.route.js";
import orderRoute from "./route/order.route.js";
import paymentRoute from "./route/payment.route.js";
import userRoute from "./route/user.route.js";

dotenv.config();

const app = express();

app.use(cors({ origin: process.env.FRONTEND_URL || "*" }));
app.use(express.json());

app.get("/", (req, res) => {
  res.send("BookStore Backend is Running 🚀");
});

app.use("/book", bookRoute);
app.use("/user", userRoute);
app.use("/cart", cartRoute);
app.use("/address", addressRoute);
app.use("/order", orderRoute);
app.use("/payment", paymentRoute);

export default app;
