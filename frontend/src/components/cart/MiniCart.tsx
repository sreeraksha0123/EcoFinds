// src/components/cart/MiniCart.tsx
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { ShoppingCart, X } from "lucide-react";

type CartItem = {
  _id: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
};

export default function MiniCart() {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // Check if mobile
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);

    // Load cart from localStorage
    loadCart();

    // Listen for cart updates
    const handleCartUpdate = () => loadCart();
    const handleStorage = () => loadCart();

    window.addEventListener("cart-updated", handleCartUpdate);
    window.addEventListener("storage", handleStorage);

    return () => {
      window.removeEventListener("resize", checkMobile);
      window.removeEventListener("cart-updated", handleCartUpdate);
      window.removeEventListener("storage", handleStorage);
    };
  }, []);

  const loadCart = () => {
    const cart = localStorage.getItem("cart");
    if (cart) {
      try {
        setItems(JSON.parse(cart));
      } catch (error) {
        console.error("Error parsing cart:", error);
        setItems([]);
      }
    } else {
      setItems([]);
    }
  };

  const totalQuantity = items.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  return (
    <div className="relative">
      {/* Cart Icon */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 hover:bg-gray-100 rounded-full transition"
      >
        <ShoppingCart className="w-6 h-6 text-emerald-700" />
        {totalQuantity > 0 && (
          <span className="absolute -top-1 -right-1 bg-emerald-600 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
            {totalQuantity}
          </span>
        )}
      </button>

      {/* Mini Cart Dropdown */}
      {isOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />

          {/* Cart Content */}
          <div className="absolute right-0 top-12 w-80 bg-white shadow-2xl rounded-lg z-50 max-h-96 overflow-auto">
            <div className="p-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-gray-800">Your Cart</h3>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-1 hover:bg-gray-100 rounded"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {items.length === 0 ? (
                <p className="text-gray-500 text-center py-8">
                  Your cart is empty
                </p>
              ) : (
                <>
                  <div className="space-y-3 mb-4">
                    {items.map((item) => (
                      <div
                        key={item._id}
                        className="flex gap-3 p-2 border rounded"
                      >
                        <Image
                          src={item.image || "/images/placeholder.jpg"}
                          alt={item.name}
                          width={50}
                          height={50}
                          className="rounded object-cover"
                        />
                        <div className="flex-1">
                          <h4 className="text-sm font-medium">{item.name}</h4>
                          <p className="text-xs text-gray-600">
                            ₹{item.price} × {item.quantity}
                          </p>
                        </div>
                        <div className="text-sm font-medium text-emerald-600">
                          ₹{item.price * item.quantity}
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="border-t pt-3 mb-3">
                    <div className="flex justify-between font-bold text-lg">
                      <span>Total:</span>
                      <span className="text-emerald-600">₹{totalPrice}</span>
                    </div>
                  </div>

                  <Link
                    href="/cart"
                    onClick={() => setIsOpen(false)}
                    className="block w-full py-2 bg-emerald-600 text-white text-center rounded-lg hover:bg-emerald-700 transition"
                  >
                    View Cart & Checkout
                  </Link>
                </>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}