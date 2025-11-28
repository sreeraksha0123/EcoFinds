// backend/controllers/authController.js
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { getDB } from "../config/db.js";

/**
 * @route POST /api/auth/signup
 * @desc Register a new user
 */
export const signup = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Input validation
    if (!name?.trim() || !email?.trim() || !password?.trim()) {
      return res.status(400).json({ success: false, message: "All fields are required." });
    }

    const db = await getDB();

    // Check if email already exists
    const existingUser = await db.get("SELECT * FROM users WHERE email = ?", [email]);
    if (existingUser) {
      return res.status(400).json({ success: false, message: "Email is already registered." });
    }

    // Hash password securely
    const hashedPassword = await bcrypt.hash(password, 12);

    // Insert user into database
    await db.run(
      "INSERT INTO users (name, email, password) VALUES (?, ?, ?)",
      [name.trim(), email.trim().toLowerCase(), hashedPassword]
    );

    return res.status(201).json({
      success: true,
      message: "Account created successfully. Please log in.",
    });
  } catch (error) {
    console.error("❌ Signup Error:", error.message);
    return res.status(500).json({
      success: false,
      message: "Server error while registering user.",
    });
  }
};

/**
 * @route POST /api/auth/login
 * @desc Authenticate user and return JWT
 */
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Input validation
    if (!email?.trim() || !password?.trim()) {
      return res.status(400).json({ success: false, message: "Email and password are required." });
    }

    const db = await getDB();

    // Find user
    const user = await db.get("SELECT * FROM users WHERE email = ?", [email.trim().toLowerCase()]);
    if (!user) {
      return res.status(401).json({ success: false, message: "Invalid email or password." });
    }

    // Validate password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ success: false, message: "Invalid email or password." });
    }

    // Generate secure JWT
    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET || "defaultsecretkey",
      { expiresIn: "2h" }
    );

    // Return user info (excluding password)
    return res.json({
      success: true,
      message: "Login successful.",
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    console.error("❌ Login Error:", error.message);
    return res.status(500).json({
      success: false,
      message: "Server error while logging in.",
    });
  }
};

