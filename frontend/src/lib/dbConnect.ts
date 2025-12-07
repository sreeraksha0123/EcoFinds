// src/lib/dbConnect.ts
import mongoose from "mongoose";

let isConnected = false;

export default async function dbConnect() {
  if (isConnected) {
    console.log("📦 Using existing MongoDB connection");
    return;
  }

  if (!process.env.MONGODB_URI) {
    throw new Error("❌ MONGODB_URI is not defined in environment variables");
  }

  try {
    const db = await mongoose.connect(process.env.MONGODB_URI);
    isConnected = true;
    console.log("✅ MongoDB connected successfully");
    console.log(`📊 Database: ${db.connection.db.databaseName}`);
    console.log(`🔗 Host: ${db.connection.host}`);
  } catch (error) {
    console.error("❌ MongoDB connection error:", error);
    throw error;
  }
}