// backend/models/productModel.js
import { initDB } from "../config/db.js";

export const createProduct = async (name, description, price, image, seller_id) => {
  const db = await initDB();
  await db.run(
    "INSERT INTO products (name, description, price, image, seller_id) VALUES (?, ?, ?, ?, ?)",
    [name, description, price, image, seller_id]
  );
};

export const getAllProducts = async () => {
  const db = await initDB();
  return db.all("SELECT * FROM products");
};

export const getProductById = async (id) => {
  const db = await initDB();
  return db.get("SELECT * FROM products WHERE id = ?", [id]);
};

export const deleteProduct = async (id) => {
  const db = await initDB();
  await db.run("DELETE FROM products WHERE id = ?", [id]);
};
