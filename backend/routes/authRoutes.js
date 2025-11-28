// backend/routes/authRoutes.js
import express from "express";
import { signup, login } from "../controllers/authController.js";
import { protect } from "../middleware/authMiddleware.js"; // For optional protected routes

const router = express.Router();

/**
 * @route   POST /api/auth/signup
 * @desc    Register a new user
 * @access  Public
 * @body    { name, email, password }
 * @returns { success, message }
 */
router.post("/signup", signup);

/**
 * @route   POST /api/auth/login
 * @desc    Authenticate user and return JWT
 * @access  Public
 * @body    { email, password }
 * @returns { success, token, user }
 */
router.post("/login", login);

/**
 * @route   GET /api/auth/profile
 * @desc    Get authenticated user info
 * @access  Private
 * @header  Authorization: Bearer <token>
 */
router.get("/profile", protect, async (req, res) => {
  try {
    res.json({
      success: true,
      message: "User profile fetched successfully",
      user: req.user,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch user profile",
    });
  }
});

export default router;
