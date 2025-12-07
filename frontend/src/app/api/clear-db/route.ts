// src/app/api/clear-db/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import dbConnect from "@/lib/dbConnect";
import Product from "@/lib/models/Product";
import Order from "@/lib/models/Order";

export async function POST(req: NextRequest) {
  try {
    // Ensure the user is logged in
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json(
        { success: false, message: "Unauthorized — please log in first." },
        { status: 401 }
      );
    }

    await dbConnect();

    // 🧹 Clear all products & orders in the database (global)
    const deletedProducts = await Product.deleteMany({});
    const deletedOrders = await Order.deleteMany({});

    return NextResponse.json({
      success: true,
      message: "All products and orders cleared successfully!",
      deleted: {
        products: deletedProducts.deletedCount,
        orders: deletedOrders.deletedCount,
      },
    });
  } catch (error: any) {
    console.error("❌ Clear DB Error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to clear database", error: error.message },
      { status: 500 }
    );
  }
}
