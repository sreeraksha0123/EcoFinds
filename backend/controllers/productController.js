// backend/controllers/productController.js
import {
  createProduct,
  getAllProducts,
  getProductById,
  deleteProduct,
} from "../models/productModel.js";

/**
 * @route POST /api/products
 * @desc Add a new product (only for authenticated users)
 * @access Private (JWT)
 */
export const addProduct = async (req, res) => {
  try {
    const sellerId = req.user?.id; // From JWT middleware
    const { name, description, price, image } = req.body;

    // Input validation
    if (!sellerId) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }
    if (!name || !price) {
      return res.status(400).json({
        success: false,
        message: "Product name and price are required",
      });
    }
    if (isNaN(price) || price <= 0) {
      return res.status(400).json({
        success: false,
        message: "Price must be a valid positive number",
      });
    }

    await createProduct(name.trim(), description?.trim() || "", price, image || "", sellerId);

    return res.status(201).json({
      success: true,
      message: "Product added successfully",
    });
  } catch (error) {
    console.error("❌ Add Product Error:", error.message);
    return res.status(500).json({
      success: false,
      message: "Server error while adding product",
    });
  }
};

/**
 * @route GET /api/products
 * @desc Get all products
 * @access Public
 */
export const getProducts = async (_, res) => {
  try {
    const products = await getAllProducts();

    return res.status(200).json({
      success: true,
      message: "Products fetched successfully",
      data: products,
    });
  } catch (error) {
    console.error("❌ Fetch Products Error:", error.message);
    return res.status(500).json({
      success: false,
      message: "Server error while fetching products",
    });
  }
};

/**
 * @route GET /api/products/:id
 * @desc Get a single product by ID
 * @access Public
 */
export const getProduct = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({ success: false, message: "Product ID is required" });
    }

    const product = await getProductById(id);
    if (!product) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }

    return res.status(200).json({
      success: true,
      message: "Product fetched successfully",
      data: product,
    });
  } catch (error) {
    console.error("❌ Get Product Error:", error.message);
    return res.status(500).json({
      success: false,
      message: "Server error while fetching product",
    });
  }
};

/**
 * @route DELETE /api/products/:id
 * @desc Delete a product (only if the logged-in user is the seller)
 * @access Private (JWT)
 */
export const removeProduct = async (req, res) => {
  try {
    const sellerId = req.user?.id;
    const { id } = req.params;

    if (!sellerId) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    const product = await getProductById(id);
    if (!product) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }

    // Check ownership
    if (product.seller_id !== sellerId) {
      return res.status(403).json({
        success: false,
        message: "You can only delete products you added",
      });
    }

    await deleteProduct(id);

    return res.status(200).json({
      success: true,
      message: "Product deleted successfully",
    });
  } catch (error) {
    console.error("❌ Delete Product Error:", error.message);
    return res.status(500).json({
      success: false,
      message: "Server error while deleting product",
    });
  }
};
