// src/app/cart/page.tsx
"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import toast from "react-hot-toast";
import { Minus, Plus, Trash2, ShoppingBag } from "lucide-react";

type CartItem = {
  _id: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
};

export default function CartPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const [cart, setCart] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadCart();
  }, []);

  const loadCart = () => {
    const cartData = localStorage.getItem("cart");
    if (cartData) {
      try {
        setCart(JSON.parse(cartData));
      } catch (error) {
        console.error("Error loading cart:", error);
        setCart([]);
      }
    }
  };

  const updateQuantity = (itemId: string, newQuantity: number) => {
    if (newQuantity < 1) return;

    const updatedCart = cart.map((item) =>
      item._id === itemId ? { ...item, quantity: newQuantity } : item
    );

    setCart(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
    window.dispatchEvent(new Event("cart-updated"));
  };

  const removeItem = (itemId: string) => {
    const updatedCart = cart.filter((item) => item._id !== itemId);
    setCart(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
    window.dispatchEvent(new Event("cart-updated"));
    toast.success("Item removed from cart");
  };

  const handleCheckout = async () => {
    if (!session) {
      toast.error("Please login to checkout");
      router.push("/auth/login");
      return;
    }

    if (cart.length === 0) {
      toast.error("Your cart is empty");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items: cart }),
      });

      const data = await res.json();

      if (data.success) {
        toast.success("Order placed successfully! 🎉");
        // Clear cart
        localStorage.removeItem("cart");
        setCart([]);
        window.dispatchEvent(new Event("cart-updated"));
        
        // Redirect to products page after a short delay
        setTimeout(() => {
          router.push("/products");
        }, 1500);
      } else {
        toast.error(data.message || "Checkout failed");
      }
    } catch (error) {
      toast.error("An error occurred during checkout");
    } finally {
      setLoading(false);
    }
  };

  const totalPrice = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-6">
        <div className="text-center">
          <ShoppingBag className="w-20 h-20 text-gray-300 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            Your cart is empty
          </h2>
          <p className="text-gray-600 mb-6">
            Add some eco-friendly products to get started!
          </p>
          <Link
            href="/products"
            className="inline-block px-6 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition"
          >
            Browse Products
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">
          Shopping Cart ({totalItems} {totalItems === 1 ? "item" : "items"})
        </h1>

        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
          {cart.map((item) => (
            <div
              key={item._id}
              className="flex gap-4 py-4 border-b last:border-b-0"
            >
              <div className="relative w-24 h-24 bg-gray-100 rounded-lg flex-shrink-0">
                <Image
                  src={item.image || "/images/placeholder.jpg"}
                  alt={item.name}
                  fill
                  className="object-cover rounded-lg"
                />
              </div>

              <div className="flex-1">
                <h3 className="font-bold text-gray-800 mb-1">{item.name}</h3>
                <p className="text-emerald-600 font-medium mb-3">
                  ₹{item.price} each
                </p>

                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2 bg-gray-50 rounded-lg px-3 py-2">
                    <button
                      onClick={() => updateQuantity(item._id, item.quantity - 1)}
                      disabled={item.quantity <= 1}
                      className="w-7 h-7 flex items-center justify-center bg-white hover:bg-gray-100 rounded-md border disabled:opacity-50 disabled:cursor-not-allowed transition"
                    >
                      <Minus className="w-4 h-4" />
                    </button>

                    <span className="font-bold text-lg w-10 text-center">
                      {item.quantity}
                    </span>

                    <button
                      onClick={() => updateQuantity(item._id, item.quantity + 1)}
                      className="w-7 h-7 flex items-center justify-center bg-white hover:bg-gray-100 rounded-md border transition"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>

                  <button
                    onClick={() => removeItem(item._id)}
                    className="ml-auto p-2 text-red-600 hover:bg-red-50 rounded-lg transition flex items-center gap-1"
                  >
                    <Trash2 className="w-5 h-5" />
                    <span className="text-sm font-medium">Remove</span>
                  </button>
                </div>
              </div>

              <div className="text-right">
                <p className="font-bold text-xl text-gray-800">
                  ₹{item.price * item.quantity}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  {item.quantity} × ₹{item.price}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Checkout Summary */}
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">
            Order Summary
          </h2>

          <div className="space-y-3 mb-6">
            <div className="flex justify-between text-gray-600">
              <span>Total Items:</span>
              <span className="font-medium">{totalItems}</span>
            </div>
            <div className="flex justify-between text-gray-600">
              <span>Subtotal:</span>
              <span className="font-medium">₹{totalPrice}</span>
            </div>
            <div className="border-t pt-3 flex justify-between items-center">
              <span className="text-xl font-bold text-gray-800">
                Total Amount:
              </span>
              <span className="text-2xl font-bold text-emerald-600">
                ₹{totalPrice}
              </span>
            </div>
          </div>

          <button
            onClick={handleCheckout}
            disabled={loading}
            className="w-full py-3 bg-emerald-600 text-white rounded-lg font-medium hover:bg-emerald-700 transition disabled:opacity-50 disabled:cursor-not-allowed text-lg"
          >
            {loading ? "Processing..." : "Proceed to Checkout"}
          </button>

          {!session && (
            <p className="text-center text-sm text-gray-600 mt-4">
              Please{" "}
              <Link
                href="/auth/login"
                className="text-emerald-600 font-medium hover:underline"
              >
                login
              </Link>{" "}
              to complete your purchase
            </p>
          )}

          <Link
            href="/products"
            className="block text-center text-emerald-600 hover:text-emerald-700 font-medium mt-4 text-sm"
          >
            ← Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  );
}