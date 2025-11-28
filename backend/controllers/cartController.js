// backend/controllers/cartController.js
import {
  addToCartDB,
  getCartItemsByUser,
  removeCartItem,
} from "../models/cartModel.js";

export const addToCart = async (req, res) => {
  try {
    const { user_id, product_id, quantity } = req.body;
    await addToCartDB(user_id, product_id, quantity || 1);
    res.status(201).json({ message: "Added to cart" });
  } catch (err) {
    res.status(500).json({ message: "Error adding to cart" });
  }
};

export const getCartItems = async (req, res) => {
  try {
    const items = await getCartItemsByUser(req.params.userId);
    res.json(items);
  } catch {
    res.status(500).json({ message: "Error fetching cart" });
  }
};

export const removeFromCart = async (req, res) => {
  try {
    await removeCartItem(req.params.userId, req.params.productId);
    res.json({ message: "Item removed" });
  } catch {
    res.status(500).json({ message: "Error removing item" });
  }
};
