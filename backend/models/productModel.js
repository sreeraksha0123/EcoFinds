// backend/models/productModel.js
import { getDB } from "../config/db.js";

/**
 * Adds a new product to the database.
 * @returns {object} Newly created product with its ID.
 */
export const createProduct = async (name, description, price, image, seller_id) => {
  try {
    const db = await getDB();

    const result = await db.run(
      `
      INSERT INTO products (name, description, price, image, seller_id)
      VALUES (?, ?, ?, ?, ?)
      `,
      [name, description, price, image, seller_id]
    );

    return { id: result.lastID, name, description, price, image, seller_id };
  } catch (error) {
    console.error("❌ DB Error - createProduct:", error.message);
    throw new Error("Database error while creating product");
  }
};

/**
 * Fetches all products with optional seller information.
 * @returns {Array} List of products
 */
export const getAllProducts = async () => {
  try {
    const db = await getDB();

    const products = await db.all(`
      SELECT 
        p.id,
        p.name,
        p.description,
        p.price,
        p.image,
        p.seller_id,
        u.name AS seller_name,
        u.email AS seller_email
      FROM products p
      LEFT JOIN users u ON p.seller_id = u.id
      ORDER BY p.id DESC
    `);

    return products;
  } catch (error) {
    console.error("❌ DB Error - getAllProducts:", error.message);
    throw new Error("Database error while fetching products");
  }
};

/**
 * Fetches a single product by its ID.
 * @returns {object|null} Product object or null if not found
 */
export const getProductById = async (id) => {
  try {
    const db = await getDB();

    const product = await db.get(
      `
      SELECT 
        p.id,
        p.name,
        p.description,
        p.price,
        p.image,
        p.seller_id,
        u.name AS seller_name
      FROM products p
      LEFT JOIN users u ON p.seller_id = u.id
      WHERE p.id = ?
      `,
      [id]
    );

    return product;
  } catch (error) {
    console.error("❌ DB Error - getProductById:", error.message);
    throw new Error("Database error while fetching product by ID");
  }
};

/**
 * Deletes a product by ID.
 * @returns {boolean} True if deleted successfully
 */
export const deleteProduct = async (id) => {
  try {
    const db = await getDB();

    const result = await db.run("DELETE FROM products WHERE id = ?", [id]);
    if (result.changes === 0) {
      throw new Error("Product not found");
    }

    return true;
  } catch (error) {
    console.error("❌ DB Error - deleteProduct:", error.message);
    throw new Error("Database error while deleting product");
  }
};
