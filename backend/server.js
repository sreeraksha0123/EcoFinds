// backend/server.js
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import morgan from "morgan";
import { initDB } from "./config/db.js";

// ============================================
// 🌿 Load Environment Variables
// ============================================
dotenv.config();

// ============================================
// 🚀 Initialize Express App
// ============================================
const app = express();

// ============================================
// 🧾 Logging Middleware (Morgan)
// ============================================
// Use detailed request logging in development
if (process.env.NODE_ENV !== "production") {
  app.use(morgan("dev"));
}

// ============================================
// 🔐 CORS Configuration
// ============================================
app.use(
  cors({
    origin: [
      "http://127.0.0.1:5500",
      "http://localhost:5500"
    ],
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);


// ============================================
// 🧠 JSON Parser
// ============================================
app.use(express.json());

// ============================================
// 🔗 Import Routes
// ============================================
import authRoutes from "./routes/authRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import cartRoutes from "./routes/cartRoutes.js";

// ============================================
// 🌱 Default Route (Health Check)
// ============================================
app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "🌿 EcoFinds API is running successfully!",
    environment: process.env.NODE_ENV || "development",
    timestamp: new Date().toISOString(),
  });
});

// ============================================
// 💾 Database + Server Startup
// ============================================
const startServer = async () => {
  try {
    // Initialize SQLite database
    await initDB();

    // Attach routes AFTER DB is ready
    app.use("/api/auth", authRoutes);
    app.use("/api/products", productRoutes);
    app.use("/api/cart", cartRoutes);

    const PORT = process.env.PORT || 5000;

    app.listen(PORT, () => {
      console.log("🗄️ SQLite database initialized successfully!");
      console.log(`✅ Server running on port ${PORT}`);
      console.log(`🌐 API: http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("❌ Error starting server:", error);
    process.exit(1);
  }
};

// Start the server
startServer();
