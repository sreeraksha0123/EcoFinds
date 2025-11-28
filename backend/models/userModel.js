// backend/models/userModel.js
import { getDB } from "../config/db.js";

/**
 * Creates a new user record in the database.
 * @param {string} name - The user's name.
 * @param {string} email - The user's email.
 * @param {string} password - The hashed password.
 * @returns {object} The created user's ID and info.
 */
export const createUser = async (name, email, password) => {
  try {
    const db = await getDB();

    // Check for existing user
    const existing = await db.get("SELECT id FROM users WHERE email = ?", [email]);
    if (existing) {
      throw new Error("User with this email already exists.");
    }

    // Insert new user
    const result = await db.run(
      "INSERT INTO users (name, email, password) VALUES (?, ?, ?)",
      [name.trim(), email.toLowerCase(), password]
    );

    return { id: result.lastID, name, email };
  } catch (error) {
    console.error("❌ DB Error - createUser:", error.message);
    throw new Error("Database error while creating user");
  }
};

/**
 * Finds a user by their email address.
 * @param {string} email - The user's email.
 * @returns {object|null} The user record, or null if not found.
 */
export const findUserByEmail = async (email) => {
  try {
    const db = await getDB();

    const user = await db.get("SELECT * FROM users WHERE email = ?", [
      email.toLowerCase(),
    ]);

    return user || null;
  } catch (error) {
    console.error("❌ DB Error - findUserByEmail:", error.message);
    throw new Error("Database error while fetching user by email");
  }
};

/**
 * Finds a user by their ID (used in authentication middleware or profile APIs).
 * @param {number} id - The user's ID.
 * @returns {object|null} The user record.
 */
export const findUserById = async (id) => {
  try {
    const db = await getDB();

    const user = await db.get(
      "SELECT id, name, email FROM users WHERE id = ?",
      [id]
    );

    return user || null;
  } catch (error) {
    console.error("❌ DB Error - findUserById:", error.message);
    throw new Error("Database error while fetching user by ID");
  }
};
