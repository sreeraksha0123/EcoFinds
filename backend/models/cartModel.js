// backend/models/cartModel.js
import { initDB } from "../config/db.js";

export const addToCartDB = async (user_id, product_id, quantity) => {
  const db = await initDB();
  await db.run(
    "INSERT INTO cart (user_id, product_id, quantity) VALUES (?, ?, ?)",
    [user_id, product_id, quantity]
  );
};

export const getCartItemsByUser = async (user_id) => {
  const db = await initDB();
  return db.all(
    `SELECT c.id, p.name, p.price, c.quantity 
     FROM cart c 
     JOIN products p ON c.product_id = p.id 
     WHERE c.user_id = ?`,
    [user_id]
  );
};

export const removeCartItem = async (user_id, product_id) => {
  const db = await initDB();
  await db.run("DELETE FROM cart WHERE user_id = ? AND product_id = ?", [
    user_id,
    product_id,
  ]);
};
