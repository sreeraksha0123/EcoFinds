// backend/config/db.js
import sqlite3 from "sqlite3";
import { open } from "sqlite";
import path from "path";
import { fileURLToPath } from "url";

// Resolve the current directory (ESM-safe)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Database file path (from .env or fallback)
const dbPath = process.env.DATABASE_PATH || path.resolve(__dirname, "../database.sqlite");

let dbInstance = null;

/**
 * Initialize and set up the SQLite database.
 * This function:
 * - Opens the connection
 * - Creates required tables if not existing
 * - Stores the connection for reuse
 */
export const initDB = async () => {
  try {
    if (dbInstance) return dbInstance; // Return existing connection

    const db = await open({
      filename: dbPath,
      driver: sqlite3.Database,
    });

    // Enable foreign key constraints (important for referential integrity)
    await db.exec(`PRAGMA foreign_keys = ON;`);

    // Create Users table
    await db.exec(`
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        email TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL
      );
    `);

    // Create Products table
    await db.exec(`
      CREATE TABLE IF NOT EXISTS products (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        description TEXT,
        price REAL NOT NULL,
        image TEXT,
        seller_id INTEGER,
        FOREIGN KEY (seller_id) REFERENCES users(id) ON DELETE CASCADE
      );
    `);

    // Create Cart table
    await db.exec(`
      CREATE TABLE IF NOT EXISTS cart (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        product_id INTEGER NOT NULL,
        quantity INTEGER DEFAULT 1 CHECK(quantity > 0),
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
        FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
      );
    `);

    console.log("🗄️ SQLite database initialized successfully at:", dbPath);
    dbInstance = db;
    return db;
  } catch (err) {
    console.error("❌ Database initialization failed:", err.message);
    process.exit(1);
  }
};

/**
 * Returns the active database connection.
 * If it's not yet initialized, it initializes automatically.
 */
export const getDB = async () => {
  if (!dbInstance) {
    dbInstance = await initDB();
  }
  return dbInstance;
};
