// src/app/api/products/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route"; // ✅ correct path
import dbConnect from "@/lib/dbConnect";
import Product from "@/lib/models/Product";
import User from "@/lib/models/User"; // ✅ needed to fetch ObjectId

// ✅ GET all products or user's products
export async function GET(req: NextRequest) {
  try {
    await dbConnect();
    console.log("✅ Connected to database");

    const { searchParams } = new URL(req.url);
    const mine = searchParams.get("mine");

    if (mine === "true") {
      const session = await getServerSession(authOptions);
      if (!session?.user?.email) {
        return NextResponse.json(
          { success: false, message: "Unauthorized user" },
          { status: 401 }
        );
      }

      const user = await User.findOne({ email: session.user.email });
      if (!user) {
        return NextResponse.json(
          { success: false, message: "User not found" },
          { status: 404 }
        );
      }

      const products = await Product.find({ createdBy: user._id }).sort({
        createdAt: -1,
      });
      console.log(`✅ Found ${products.length} products for ${session.user.email}`);
      return NextResponse.json({ success: true, products });
    }

    // Otherwise return all in-stock products
    const products = await Product.find({ inStock: true }).sort({
      createdAt: -1,
    });
    console.log(`✅ Found ${products.length} in-stock products`);
    return NextResponse.json({ success: true, products });
  } catch (error: any) {
    console.error("❌ Get products error:", error);
    return NextResponse.json(
      { success: false, message: error.message || "Failed to fetch products" },
      { status: 500 }
    );
  }
}

// ✅ POST - Create new product
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json(
        { success: false, message: "Unauthorized. Please login." },
        { status: 401 }
      );
    }

    const { name, price, image, description, quantity, category } =
      await req.json();

    if (!name || !price) {
      return NextResponse.json(
        { success: false, message: "Name and price are required" },
        { status: 400 }
      );
    }

    await dbConnect();

    // ✅ Fetch the user's ObjectId
    const user = await User.findOne({ email: session.user.email });
    if (!user) {
      return NextResponse.json(
        { success: false, message: "User not found in database" },
        { status: 404 }
      );
    }

    const qty = quantity ? Number(quantity) : 1;

    const product = await Product.create({
      name: name.trim(),
      price: Number(price),
      image: image?.trim() || "/products/placeholder.jpg",
      description: description?.trim() || "",
      quantity: qty,
      inStock: qty > 0,
      category: category?.trim() || "General",
      createdBy: user._id, // ✅ correct ObjectId reference
    });

    console.log("✅ Product created:", product._id);
    return NextResponse.json(
      { success: true, message: "Product created successfully", product },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("❌ Create product error:", error);
    return NextResponse.json(
      {
        success: false,
        message: error.message || "Failed to create product",
      },
      { status: 500 }
    );
  }
}
