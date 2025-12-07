// src/app/api/dashboard/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import dbConnect from "@/lib/dbConnect";
import Product from "@/lib/models/Product";
import Order from "@/lib/models/Order";

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    await dbConnect();

    const userId = (session.user as any).id;

    // Get all products created by this user (faster query without populate)
    const myProducts = await Product.find({ createdBy: userId }).lean();

    // Calculate stats
    const totalProducts = myProducts.length;
    const inStockCount = myProducts.filter((p) => p.inStock).length;
    const outOfStockCount = myProducts.filter((p) => !p.inStock).length;

    // Get orders where user is a seller (optimized query)
    const orders = await Order.find({
      "items.sellerId": userId,
    })
      .sort({ createdAt: -1 })
      .limit(10)
      .lean();

    // Calculate total revenue and order count
    let totalRevenue = 0;
    let orderCount = 0;

    orders.forEach((order) => {
      const sellerItems = order.items.filter(
        (item: any) => item.sellerId.toString() === userId
      );
      
      if (sellerItems.length > 0) {
        orderCount++;
        sellerItems.forEach((item: any) => {
          totalRevenue += item.price * item.quantity;
        });
      }
    });

    const stats = {
      totalProducts,
      inStockCount,
      outOfStockCount,
      totalRevenue,
      orderCount,
    };

    return NextResponse.json({
      success: true,
      stats,
      recentOrders: orders,
    });
  } catch (error: any) {
    console.error("Dashboard error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch dashboard data" },
      { status: 500 }
    );
  }
}