import express from "express";
import {
  createOrder,
  getOrderDetails,
  getOrderHistory,
} from "../controllers/order.controller.js";
import { requireAuth } from "../middleware/auth.middleware.js";

const router = express.Router();

router.use(requireAuth);

router.post("/create", createOrder);
router.get("/getHistory", getOrderHistory);
router.get("/getDetails/:orderId", getOrderDetails);

export default router;
