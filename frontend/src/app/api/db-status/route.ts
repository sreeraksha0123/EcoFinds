// src/app/api/db-status/route.ts
import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import Product from "@/lib/models/Product";
import User from "@/lib/models/User";
import Order from "@/lib/models/Order";

export async function GET(req: NextRequest) {
  try {
    await dbConnect();
    
    // Count all documents
    const totalProducts = await Product.countDocuments();
    const inStockProducts = await Product.countDocuments({ inStock: true });
    const outOfStockProducts = await Product.countDocuments({ inStock: false });
    const totalUsers = await User.countDocuments();
    const totalOrders = await Order.countDocuments();

    // Get sample products
    const sampleProducts = await Product.find().limit(5).select('name price quantity inStock');

    return NextResponse.json({
      success: true,
      database: {
        connected: true,
        mongodb_uri_set: !!process.env.MONGODB_URI,
      },
      stats: {
        totalProducts,
        inStockProducts,
        outOfStockProducts,
        totalUsers,
        totalOrders,
      },
      sampleProducts,
      message: "Database is working correctly!"
    });
  } catch (error: any) {
    console.error("Database status check error:", error);
    return NextResponse.json(
      {
        success: false,
        database: {
          connected: false,
          error: error.message,
        },
        message: "Database connection failed!"
      },
      { status: 500 }
    );
  }
}