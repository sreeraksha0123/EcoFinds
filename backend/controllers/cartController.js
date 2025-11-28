// backend/controllers/cartController.js
import {
  addToCartDB,
  getCartItemsByUser,
  removeCartItem,
} from "../models/cartModel.js";

/**
 * @route POST /api/cart/add
 * @desc Add an item to the user's cart
 * @access Private (JWT)
 */
export const addToCart = async (req, res) => {
  try {
    const userId = req.user?.id; // from authMiddleware
    const { product_id, quantity } = req.body;

    // Validation
    if (!userId) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }
    if (!product_id) {
      return res.status(400).json({ success: false, message: "Product ID is required" });
    }
    if (quantity && quantity <= 0) {
      return res.status(400).json({ success: false, message: "Quantity must be greater than 0" });
    }

    // Add item to cart
    await addToCartDB(userId, product_id, quantity || 1);

    return res.status(201).json({
      success: true,
      message: "Item added to cart successfully",
    });
  } catch (error) {
    console.error("❌ Add to Cart Error:", error.message);
    return res.status(500).json({
      success: false,
      message: "Server error while adding item to cart",
    });
  }
};

/**
 * @route GET /api/cart
 * @desc Get all items in the logged-in user's cart
 * @access Private (JWT)
 */
export const getCartItems = async (req, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    const items = await getCartItemsByUser(userId);

    return res.status(200).json({
      success: true,
      message: "Cart fetched successfully",
      items,
    });
  } catch (error) {
    console.error("❌ Get Cart Error:", error.message);
    return res.status(500).json({
      success: false,
      message: "Server error while fetching cart items",
    });
  }
};

/**
 * @route DELETE /api/cart/:productId
 * @desc Remove a specific product from user's cart
 * @access Private (JWT)
 */
export const removeFromCart = async (req, res) => {
  try {
    const userId = req.user?.id;
    const { productId } = req.params;

    if (!userId) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }
    if (!productId) {
      return res.status(400).json({ success: false, message: "Product ID required" });
    }

    await removeCartItem(userId, productId);

    return res.status(200).json({
      success: true,
      message: "Item removed from cart",
    });
  } catch (error) {
    console.error("❌ Remove Cart Item Error:", error.message);
    return res.status(500).json({
      success: false,
      message: "Server error while removing item from cart",
    });
  }
};
