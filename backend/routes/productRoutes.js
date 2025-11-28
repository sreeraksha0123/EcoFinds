// backend/routes/productRoutes.js
import express from "express";
import {
  addProduct,
  getProducts,
  getProduct,
  removeProduct,
} from "../controllers/productController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

/**
 * @route   GET /api/products
 * @desc    Get all available products (public route)
 * @access  Public
 * @query   ?search=eco&minPrice=10&maxPrice=50
 * @returns { success, data }
 */
router.get("/", getProducts);

/**
 * @route   GET /api/products/:id
 * @desc    Get details of a single product
 * @access  Public
 * @params  { id } Product ID
 * @returns { success, data }
 */
router.get("/:id", getProduct);

/**
 * @route   POST /api/products
 * @desc    Add a new product (for sellers)
 * @access  Private
 * @header  Authorization: Bearer <token>
 * @body    { name, description, price, image }
 * @returns { success, message, product }
 */
router.post("/", protect, addProduct);

/**
 * @route   DELETE /api/products/:id
 * @desc    Delete a product (seller-only)
 * @access  Private
 * @header  Authorization: Bearer <token>
 * @params  { id } Product ID
 * @returns { success, message }
 */
router.delete("/:id", protect, removeProduct);

export default router;
