import express from "express";
import {
  addAddress,
  getAddresses,
  updateAddress,
  deleteAddress,
} from "../controllers/address.controller.js";
import { requireAuth } from "../middleware/auth.middleware.js";

const router = express.Router();

router.use(requireAuth);

router.post("/add", addAddress);
router.get("/getAddresses", getAddresses);
router.put("/update/:addressId", updateAddress);
router.delete("/delete/:addressId", deleteAddress);

export default router;
