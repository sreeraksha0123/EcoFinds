// backend/server.js
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { initDB } from "./config/db.js";

// Load environment variables
dotenv.config();

// Create Express app
const app = express();

// ✅ FIX: Proper CORS configuration for frontend (Live Server)
app.use(
  cors({
    origin: ["http://127.0.0.1:5500", "http://localhost:5500"], // frontend URLs
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

// Middleware to parse JSON requests
app.use(express.json());

// Import routes
import authRoutes from "./routes/authRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import cartRoutes from "./routes/cartRoutes.js";

// Default test route
app.get("/", (req, res) => {
  res.json({ message: "🌿 EcoFinds API is running successfully!" });
});

// Start server and connect to DB
const startServer = async () => {
  try {
    await initDB(); // initialize SQLite

    // ✅ Attach routes after DB is ready
    app.use("/api/auth", authRoutes);
    app.use("/api/products", productRoutes);
    app.use("/api/cart", cartRoutes);

    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () =>
      console.log(`✅ Server running smoothly on port ${PORT}`)
    );
  } catch (error) {
    console.error("❌ Error starting server:", error);
    process.exit(1);
  }
};

// Run the server
startServer();