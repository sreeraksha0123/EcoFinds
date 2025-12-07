// src/components/products/ProductCard.tsx
"use client";

import Image from "next/image";
import { ShoppingCart, Plus, Minus } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";

type Product = {
  _id: string;
  name: string;
  description?: string;
  price: number;
  image?: string;
  quantity: number;
  inStock: boolean;
};

export default function ProductCard({ product }: { product: Product }) {
  const [selectedQuantity, setSelectedQuantity] = useState(1);

  const handleAddToCart = () => {
    if (!product.inStock || product.quantity <= 0) {
      toast.error("Product is out of stock");
      return;
    }

    if (selectedQuantity > product.quantity) {
      toast.error(`Only ${product.quantity} unit(s) available`);
      return;
    }

    try {
      const cart = JSON.parse(localStorage.getItem("cart") || "[]");
      const existingIndex = cart.findIndex(
        (item: any) => item._id === product._id
      );

      if (existingIndex > -1) {
        // Check if adding more would exceed available stock
        const newQuantity = cart[existingIndex].quantity + selectedQuantity;
        if (newQuantity > product.quantity) {
          toast.error(`Cannot add more. Only ${product.quantity} unit(s) available total.`);
          return;
        }
        cart[existingIndex].quantity = newQuantity;
      } else {
        cart.push({
          _id: product._id,
          name: product.name,
          price: product.price,
          image: product.image || "",
          quantity: selectedQuantity,
        });
      }

      localStorage.setItem("cart", JSON.stringify(cart));
      window.dispatchEvent(new Event("cart-updated"));
      toast.success(`${selectedQuantity} × ${product.name} added to cart!`);
      setSelectedQuantity(1); // Reset to 1 after adding
    } catch (error) {
      console.error("Error adding to cart:", error);
      toast.error("Failed to add to cart");
    }
  };

  const incrementQuantity = () => {
    if (selectedQuantity < product.quantity) {
      setSelectedQuantity(selectedQuantity + 1);
    } else {
      toast.error(`Only ${product.quantity} unit(s) available`);
    }
  };

  const decrementQuantity = () => {
    if (selectedQuantity > 1) {
      setSelectedQuantity(selectedQuantity - 1);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
      {/* Product Image */}
      <div className="relative h-48 bg-gray-100">
        <Image
          src={product.image || "/images/placeholder.jpg"}
          alt={product.name}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
        {!product.inStock && (
          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <span className="text-white font-bold text-lg">Out of Stock</span>
          </div>
        )}
      </div>

      {/* Product Info */}
      <div className="p-4">
        <h3 className="text-lg font-bold text-gray-800 mb-2">
          {product.name}
        </h3>
        <p className="text-sm text-gray-600 mb-3 line-clamp-2">
          {product.description || "Eco-friendly sustainable product"}
        </p>

        <div className="flex items-center justify-between mb-3">
          <span className="text-2xl font-bold text-emerald-600">
            ₹{product.price}
          </span>
          <span className={`text-sm font-medium ${
            product.quantity > 0 ? "text-gray-600" : "text-red-600"
          }`}>
            {product.quantity > 0 ? `${product.quantity} in stock` : "Out of Stock"}
          </span>
        </div>

        {/* Quantity Selector */}
        {product.inStock && product.quantity > 0 && (
          <div className="flex items-center justify-center gap-3 mb-3 bg-gray-50 rounded-lg p-2">
            <button
              onClick={decrementQuantity}
              disabled={selectedQuantity <= 1}
              className="w-8 h-8 flex items-center justify-center bg-white rounded-lg border border-gray-300 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition"
            >
              <Minus className="w-4 h-4" />
            </button>
            
            <span className="text-lg font-semibold w-12 text-center">
              {selectedQuantity}
            </span>
            
            <button
              onClick={incrementQuantity}
              disabled={selectedQuantity >= product.quantity}
              className="w-8 h-8 flex items-center justify-center bg-white rounded-lg border border-gray-300 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>
        )}

        <button
          onClick={handleAddToCart}
          disabled={!product.inStock || product.quantity <= 0}
          className={`w-full py-2 rounded-lg font-medium flex items-center justify-center gap-2 transition ${
            product.inStock && product.quantity > 0
              ? "bg-emerald-600 text-white hover:bg-emerald-700"
              : "bg-gray-300 text-gray-500 cursor-not-allowed"
          }`}
        >
          <ShoppingCart className="w-5 h-5" />
          {product.inStock && product.quantity > 0
            ? "Add to Cart"
            : "Out of Stock"}
        </button>
      </div>
    </div>
  );
}