import express from "express";
import {
  initiatePayment,
  handlePaymentCallback,
} from "../controllers/payment.controller.js";
import { requireAuth } from "../middleware/auth.middleware.js";

const router = express.Router();

router.use(requireAuth);

router.post("/initiate", initiatePayment);
router.post("/callback", handlePaymentCallback);

export default router;
