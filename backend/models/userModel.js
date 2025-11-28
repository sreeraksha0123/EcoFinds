// backend/models/userModel.js
import { initDB } from "../config/db.js";

export const createUser = async (name, email, password) => {
  const db = await initDB();
  await db.run("INSERT INTO users (name, email, password) VALUES (?, ?, ?)", [
    name,
    email,
    password,
  ]);
};

export const findUserByEmail = async (email) => {
  const db = await initDB();
  return db.get("SELECT * FROM users WHERE email = ?", [email]);
};
