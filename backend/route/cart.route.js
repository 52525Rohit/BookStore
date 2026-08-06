import express from "express";
import {
  addToCart,
  getCart,
  updateCartItem,
  removeCartItem,
} from "../controllers/cart.controller.js";
import { requireAuth } from "../middleware/auth.middleware.js";

const router = express.Router();

router.use(requireAuth);

router.post("/add", addToCart);
router.get("/", getCart);
router.put("/update/:itemId", updateCartItem);
router.delete("/remove/:itemId", removeCartItem);

export default router;
