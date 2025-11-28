// backend/server.js
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { initDB } from "./config/db.js";

// Load environment variables
dotenv.config();

// Create Express app
const app = express();

// Middleware
app.use(cors());
app.use(express.json()); // Parses incoming JSON

// Initialize database
const dbPromise = initDB();

// Routes
import authRoutes from "./routes/authRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import cartRoutes from "./routes/cartRoutes.js";

// Attach routes with API prefix
app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/cart", cartRoutes);

// Default route
app.get("/", (req, res) => {
  res.json({ message: "EcoFinds API is running 🚀" });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});

export { dbPromise };
