import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import dbConnect from "@/lib/dbConnect";
import Product from "@/lib/models/Product";
import User from "@/lib/models/User";

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json(
        { success: false, message: "Please login first" },
        { status: 401 }
      );
    }

    await dbConnect();
    const user = await User.findOne({ email: session.user.email });
    if (!user) {
      return NextResponse.json(
        { success: false, message: "User not found in database" },
        { status: 404 }
      );
    }

    // Prevent duplicate seeding
    const existing = await Product.countDocuments({ createdBy: user._id });
    if (existing > 0) {
      return NextResponse.json({
        success: false,
        message: "You already have seeded products. Clear the database first!",
      });
    }

    // ✅ Local images (no 404s) + valid quantity/inStock
    const products = [
      {
        name: "Bamboo Sunglasses",
        description:
          "Stylish sunglasses with bamboo frames and polarized lenses.",
        price: 899,
        quantity: 30,
        inStock: true,
        image: "/products/bamboo-sunglasses.jpg",
        category: "Accessories",
        createdBy: user._id,
      },
      {
        name: "Eco-Friendly Yoga Mat",
        description:
          "Natural rubber and cork yoga mat. Non-slip and durable.",
        price: 1299,
        quantity: 25,
        inStock: true,
        image: "/products/eco-yoga-mat.jpg",
        category: "Fitness",
        createdBy: user._id,
      },
      {
        name: "Beeswax Food Wraps",
        description:
          "Set of 5 reusable wraps made from cotton and beeswax.",
        price: 349,
        quantity: 70,
        inStock: true,
        image: "/products/beeswax-wraps.jpg",
        category: "Kitchen",
        createdBy: user._id,
      },
      {
        name: "Reusable Coffee Cup",
        description:
          "350ml bamboo fiber cup with silicone lid and sleeve.",
        price: 399,
        quantity: 45,
        inStock: true,
        image: "/products/coffee-cup.jpg",
        category: "Lifestyle",
        createdBy: user._id,
      },
      {
        name: "Organic Cotton Tote Bag",
        description:
          "Durable reusable shopping bag made from organic cotton.",
        price: 249,
        quantity: 80,
        inStock: true,
        image: "/products/cotton-tote.jpg",
        category: "Accessories",
        createdBy: user._id,
      },
      {
        name: "Bamboo Toothbrush (Pack of 4)",
        description:
          "Soft-bristle bamboo toothbrush set. Biodegradable handles.",
        price: 299,
        quantity: 100,
        inStock: true,
        image: "/products/bamboo-toothbrush.jpg",
        category: "Personal Care",
        createdBy: user._id,
      },
      {
        name: "Reusable Metal Straws (Set of 6)",
        description: "Stainless steel straws with cleaning brush.",
        price: 199,
        quantity: 120,
        inStock: true,
        image: "/products/metal-straws.jpg",
        category: "Kitchen",
        createdBy: user._id,
      },
      {
        name: "Compostable Phone Case",
        description:
          "Made from plant-based biopolymers. Compostable and protective.",
        price: 699,
        quantity: 40,
        inStock: true,
        image: "/products/compostable-case.jpg",
        category: "Electronics",
        createdBy: user._id,
      },
      {
        name: "Coconut Shell Bowls (Set of 2)",
        description:
          "Handcrafted bowls made from upcycled coconut shells.",
        price: 549,
        quantity: 60,
        inStock: true,
        image: "/products/coconut-bowls.jpg",
        category: "Kitchen",
        createdBy: user._id,
      },
      {
        name: "Eco Laundry Detergent Sheets",
        description:
          "Compact, zero-waste detergent sheets for all washing machines.",
        price: 499,
        quantity: 75,
        inStock: true,
        image: "/products/eco-detergent.jpg",
        category: "Home Care",
        createdBy: user._id,
      },
    ];

    await Product.insertMany(products);
    console.log(`✅ Seeded ${products.length} products for user ${session.user.email}`);

    return NextResponse.json({
      success: true,
      message: "Database seeded successfully!",
      count: products.length,
    });
  } catch (error: any) {
    console.error("❌ Seed error:", error);
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}
