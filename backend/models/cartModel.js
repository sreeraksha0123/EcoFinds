// backend/models/cartModel.js
import { getDB } from "../config/db.js";

/**
 * Adds an item to the user's cart.
 * If the item already exists, increments the quantity instead of creating a new row.
 */
export const addToCartDB = async (user_id, product_id, quantity = 1) => {
  try {
    const db = await getDB();

    // Check if item already exists in the cart
    const existingItem = await db.get(
      "SELECT * FROM cart WHERE user_id = ? AND product_id = ?",
      [user_id, product_id]
    );

    if (existingItem) {
      // Update existing quantity
      const newQuantity = existingItem.quantity + quantity;
      await db.run(
        "UPDATE cart SET quantity = ? WHERE user_id = ? AND product_id = ?",
        [newQuantity, user_id, product_id]
      );
    } else {
      // Insert a new item
      await db.run(
        "INSERT INTO cart (user_id, product_id, quantity) VALUES (?, ?, ?)",
        [user_id, product_id, quantity]
      );
    }

    return { success: true };
  } catch (error) {
    console.error("❌ DB Error - addToCartDB:", error.message);
    throw new Error("Database error while adding item to cart");
  }
};

/**
 * Fetches all cart items for a specific user, with joined product info.
 */
export const getCartItemsByUser = async (user_id) => {
  try {
    const db = await getDB();

    const items = await db.all(
      `
      SELECT 
        c.id AS cart_id,
        p.id AS product_id,
        p.name,
        p.price,
        p.image,
        c.quantity,
        ROUND(p.price * c.quantity, 2) AS total_price
      FROM cart c
      JOIN products p ON c.product_id = p.id
      WHERE c.user_id = ?
      ORDER BY c.id DESC
      `,
      [user_id]
    );

    return items;
  } catch (error) {
    console.error("❌ DB Error - getCartItemsByUser:", error.message);
    throw new Error("Database error while fetching cart items");
  }
};

/**
 * Removes a product from the user's cart.
 */
export const removeCartItem = async (user_id, product_id) => {
  try {
    const db = await getDB();

    const result = await db.run(
      "DELETE FROM cart WHERE user_id = ? AND product_id = ?",
      [user_id, product_id]
    );

    if (result.changes === 0) {
      throw new Error("Cart item not found or already removed");
    }

    return { success: true };
  } catch (error) {
    console.error("❌ DB Error - removeCartItem:", error.message);
    throw new Error("Database error while removing cart item");
  }
};
