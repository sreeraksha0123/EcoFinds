// backend/controllers/productController.js
import {
  createProduct,
  getAllProducts,
  getProductById,
  deleteProduct,
} from "../models/productModel.js";

export const addProduct = async (req, res) => {
  try {
    const { name, description, price, image, seller_id } = req.body;
    await createProduct(name, description, price, image, seller_id);
    res.status(201).json({ message: "Product added successfully" });
  } catch (err) {
    res.status(500).json({ message: "Error adding product", error: err.message });
  }
};

export const getProducts = async (_, res) => {
  try {
    const products = await getAllProducts();
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: "Error fetching products" });
  }
};

export const getProduct = async (req, res) => {
  try {
    const product = await getProductById(req.params.id);
    res.json(product || { message: "Not found" });
  } catch {
    res.status(500).json({ message: "Error fetching product" });
  }
};

export const removeProduct = async (req, res) => {
  try {
    await deleteProduct(req.params.id);
    res.json({ message: "Product deleted" });
  } catch {
    res.status(500).json({ message: "Error deleting product" });
  }
};
