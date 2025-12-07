import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import dbConnect from "@/lib/dbConnect";
import Product from "@/lib/models/Product";

// ✅ Universal param unwrapping helper
async function getParamId(context: any) {
  try {
    const resolved = await context?.params;
    return resolved?.id || context?.params?.id || null;
  } catch {
    return context?.params?.id || null;
  }
}

// ✅ PATCH — Update product
export async function PATCH(req: NextRequest, context: any) {
  try {
    await dbConnect();
    const id = await getParamId(context);

    if (!id) {
      console.log("⚠️ Missing product ID in PATCH route");
      return NextResponse.json(
        { success: false, message: "Missing product ID" },
        { status: 400 }
      );
    }

    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    // ✅ Validate Mongo ObjectId
    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      console.log("Invalid ObjectId:", id);
      return NextResponse.json(
        { success: false, message: "Invalid product ID format" },
        { status: 400 }
      );
    }

    const updates = await req.json();

    const product = await Product.findById(id);
    if (!product) {
      return NextResponse.json(
        { success: false, message: "Product not found" },
        { status: 404 }
      );
    }

    if (product.createdBy !== session.user.email) {
      return NextResponse.json(
        { success: false, message: "You are not authorized to edit this product" },
        { status: 403 }
      );
    }

    Object.assign(product, updates);
    await product.save();

    return NextResponse.json({
      success: true,
      message: "Product updated successfully",
      product,
    });
  } catch (error: any) {
    console.error("❌ PATCH error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to update product", error: error.message },
      { status: 500 }
    );
  }
}

// ✅ DELETE — Delete product
export async function DELETE(req: NextRequest, context: any) {
  try {
    await dbConnect();
    const id = await getParamId(context);

    if (!id) {
      return NextResponse.json(
        { success: false, message: "Missing product ID" },
        { status: 400 }
      );
    }

    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      return NextResponse.json(
        { success: false, message: "Invalid product ID format" },
        { status: 400 }
      );
    }

    const product = await Product.findById(id);
    if (!product) {
      return NextResponse.json(
        { success: false, message: "Product not found" },
        { status: 404 }
      );
    }

    if (product.createdBy !== session.user.email) {
      return NextResponse.json(
        { success: false, message: "You are not authorized to delete this product" },
        { status: 403 }
      );
    }

    await product.deleteOne();
    return NextResponse.json({
      success: true,
      message: "Product deleted successfully",
    });
  } catch (error: any) {
    console.error("❌ DELETE error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to delete product", error: error.message },
      { status: 500 }
    );
  }
}
