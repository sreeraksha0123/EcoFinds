import express from "express";
import {
  addProduct,
  getProducts,
  getProduct,
  removeProduct,
} from "../controllers/productController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();
router.get("/", getProducts);
router.get("/:id", getProduct);
router.post("/", protect, addProduct);
router.delete("/:id", protect, removeProduct);

export default router;
