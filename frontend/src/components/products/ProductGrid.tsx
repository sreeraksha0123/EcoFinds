"use client";

import ProductCard from "./ProductCard";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";

export default function ProductGrid() {
  const [products, setProducts] = useState<any[]>([]);

  // Temporary local mock data (later from backend)
  useEffect(() => {
    setProducts([
      {
        id: 1,
        name: "Bamboo Toothbrush",
        price: 120,
        image: "/images/bamboo-toothbrush.jpg",
        desc: "Biodegradable and eco-friendly alternative to plastic toothbrushes.",
      },
      {
        id: 2,
        name: "Reusable Cotton Tote",
        price: 250,
        image: "/images/cotton-tote.jpg",
        desc: "Durable and stylish cotton tote bag for everyday shopping.",
      },
      {
        id: 3,
        name: "Organic Soap Bar",
        price: 180,
        image: "/images/soap-bar.jpg",
        desc: "Handcrafted soap made with organic oils and natural ingredients.",
      },
    ]);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.2, duration: 0.5 }}
      className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-10 max-w-6xl mx-auto"
    >
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </motion.div>
  );
}
