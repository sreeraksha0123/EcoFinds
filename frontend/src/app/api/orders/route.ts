// src/app/api/orders/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import dbConnect from "@/lib/dbConnect";
import Product from "@/lib/models/Product";
import Order from "@/lib/models/Order";
import User from "@/lib/models/User"; // ✅ ensure this exists

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json(
        { success: false, message: "Unauthorized. Please login to checkout." },
        { status: 401 }
      );
    }

    const { items } = await req.json();

    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json(
        { success: false, message: "Cart is empty" },
        { status: 400 }
      );
    }

    await dbConnect();

    // ✅ Fetch current user object to get their MongoDB _id
    const user = await User.findOne({ email: session.user.email });
    if (!user) {
      return NextResponse.json(
        { success: false, message: "User not found in database" },
        { status: 404 }
      );
    }

    const orderItems: any[] = [];
    let totalAmount = 0;

    for (const cartItem of items) {
      const product = await Product.findById(cartItem._id);

      if (!product) {
        return NextResponse.json(
          { success: false, message: `Product "${cartItem.name}" not found` },
          { status: 404 }
        );
      }

      // Check availability
      if (!product.inStock || product.quantity <= 0) {
        return NextResponse.json(
          { success: false, message: `"${product.name}" is out of stock` },
          { status: 400 }
        );
      }

      if (cartItem.quantity > product.quantity) {
        return NextResponse.json(
          {
            success: false,
            message: `Only ${product.quantity} unit(s) of "${product.name}" available.`,
          },
          { status: 400 }
        );
      }

      // ✅ Add correct ObjectId references
      orderItems.push({
        productId: product._id,
        sellerId: product.createdBy, // must be ObjectId
        name: product.name,
        price: product.price,
        quantity: cartItem.quantity,
      });

      totalAmount += product.price * cartItem.quantity;

      // Update stock
      product.quantity -= cartItem.quantity;
      if (product.quantity <= 0) {
        product.quantity = 0;
        product.inStock = false;
      }
      await product.save();
    }

    // ✅ Create order with user._id, not session.user.id (in case it’s an email)
    const order = await Order.create({
      userId: user._id,
      items: orderItems,
      totalAmount,
      status: "Pending",
      createdAt: new Date(),
    });

    return NextResponse.json(
      {
        success: true,
        message: "Order placed successfully!",
        order,
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Create order error:", error);
    return NextResponse.json(
      {
        success: false,
        message: error.message || "Failed to create order",
      },
      { status: 500 }
    );
  }
}
