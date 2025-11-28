// backend/routes/cartRoutes.js
import express from "express";
import {
  addToCart,
  getCartItems,
  removeFromCart,
} from "../controllers/cartController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

/**
 * @route   POST /api/cart
 * @desc    Add a product to the cart (creates or updates quantity)
 * @access  Private
 * @body    { product_id, quantity }
 */
router.post("/", protect, addToCart);

/**
 * @route   GET /api/cart
 * @desc    Get all cart items for the logged-in user
 * @access  Private
 */
router.get("/", protect, getCartItems);

/**
 * @route   DELETE /api/cart/:productId
 * @desc    Remove a specific product from the cart
 * @access  Private
 */
router.delete("/:productId", protect, removeFromCart);

export default router;
