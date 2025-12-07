"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import toast from "react-hot-toast";
import { Trash2, Package, Edit2, Save, X } from "lucide-react";

type Product = {
  _id: string;
  name: string;
  description?: string;
  price: number;
  image?: string;
  quantity: number;
  inStock: boolean;
};

export default function SellPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState({
    name: "",
    price: "",
    image: "",
    description: "",
    quantity: "",
  });
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    image: "",
    description: "",
    quantity: "1",
  });

  // Redirect unauthenticated users
  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/login");
    } else if (status === "authenticated") {
      fetchMyProducts();
    }
  }, [status, router]);

  // Fetch user's own products
  const fetchMyProducts = async () => {
    try {
      const res = await fetch("/api/products?mine=true");
      const data = await res.json();
      if (data.success) setProducts(data.products);
      else console.error("Fetch failed:", data);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  // Create new product
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name || !formData.price) {
      toast.error("Please fill in product name and price");
      return;
    }
    if (Number(formData.price) <= 0) {
      toast.error("Price must be greater than 0");
      return;
    }
    if (Number(formData.quantity) <= 0) {
      toast.error("Quantity must be at least 1");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name.trim(),
          price: Number(formData.price),
          image: formData.image.trim() || "",
          description: formData.description.trim() || "",
          quantity: Number(formData.quantity),
          category: "User Listed", // ✅ added for backend consistency
        }),
      });

      const data = await res.json();

      if (data.success) {
        toast.success("Product listed successfully!");
        setFormData({
          name: "",
          price: "",
          image: "",
          description: "",
          quantity: "1",
        });
        fetchMyProducts();
      } else {
        toast.error(data.message || "Failed to list product");
        console.error("Server error:", data);
      }
    } catch (error) {
      console.error("Error creating product:", error);
      toast.error("An error occurred while creating product");
    } finally {
      setLoading(false);
    }
  };

  // Delete a product
  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this product?")) return;

    try {
      const res = await fetch(`/api/products/${id}`, { method: "DELETE" });
      const data = await res.json();
      if (data.success) {
        toast.success("Product deleted successfully");
        fetchMyProducts();
      } else {
        toast.error(data.message || "Failed to delete product");
      }
    } catch (error) {
      toast.error("An error occurred while deleting");
    }
  };

  // Start editing
  const startEdit = (product: Product) => {
    setEditingId(product._id);
    setEditForm({
      name: product.name,
      price: product.price.toString(),
      image: product.image || "",
      description: product.description || "",
      quantity: product.quantity.toString(),
    });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditForm({
      name: "",
      price: "",
      image: "",
      description: "",
      quantity: "",
    });
  };

  // Update a product
  const handleUpdate = async (id: string) => {
    try {
      const res = await fetch(`/api/products/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: editForm.name.trim(),
          price: Number(editForm.price),
          image: editForm.image.trim(),
          description: editForm.description.trim(),
          quantity: Number(editForm.quantity),
          inStock: Number(editForm.quantity) > 0,
        }),
      });

      const data = await res.json();

      if (data.success) {
        toast.success("Product updated successfully!");
        setEditingId(null);
        fetchMyProducts();
      } else {
        toast.error(data.message || "Failed to update product");
      }
    } catch (error) {
      toast.error("An error occurred while updating");
    }
  };

  // Loading indicator
  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-emerald-600 border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-6xl mx-auto px-6">
        {/* Create Form */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-12">
          <h1 className="text-3xl font-bold text-gray-800 mb-6">
            List Your Product
          </h1>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid md:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Product Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none"
                  placeholder="Eco-friendly Water Bottle"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Price (₹) *
                </label>
                <input
                  type="number"
                  required
                  min="0"
                  step="0.01"
                  value={formData.price}
                  onChange={(e) =>
                    setFormData({ ...formData, price: e.target.value })
                  }
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none"
                  placeholder="299"
                />
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Image URL
                </label>
                <input
                  type="url"
                  value={formData.image}
                  onChange={(e) =>
                    setFormData({ ...formData, image: e.target.value })
                  }
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none"
                  placeholder="https://example.com/image.jpg"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Quantity *
                </label>
                <input
                  type="number"
                  required
                  min="1"
                  value={formData.quantity}
                  onChange={(e) =>
                    setFormData({ ...formData, quantity: e.target.value })
                  }
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none"
                  placeholder="1"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <textarea
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                rows={4}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none resize-none"
                placeholder="Describe your eco-friendly product..."
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-emerald-600 text-white rounded-lg font-medium hover:bg-emerald-700 transition disabled:opacity-50"
            >
              {loading ? "Listing..." : "List Product"}
            </button>
          </form>
        </div>

        {/* Your Products */}
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">
            Your Listed Products
          </h2>

          {products.length === 0 ? (
            <div className="text-center py-12">
              <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">
                You haven't listed any products yet
              </p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map((product) => (
                <div
                  key={product._id}
                  className="border rounded-lg p-4 relative"
                >
                  {editingId === product._id ? (
                    // Edit Mode
                    <div className="space-y-3">
                      <input
                        type="text"
                        value={editForm.name}
                        onChange={(e) =>
                          setEditForm({ ...editForm, name: e.target.value })
                        }
                        className="w-full px-3 py-2 border rounded-lg text-sm"
                        placeholder="Name"
                      />
                      <input
                        type="number"
                        value={editForm.price}
                        onChange={(e) =>
                          setEditForm({ ...editForm, price: e.target.value })
                        }
                        className="w-full px-3 py-2 border rounded-lg text-sm"
                        placeholder="Price"
                      />
                      <input
                        type="number"
                        value={editForm.quantity}
                        onChange={(e) =>
                          setEditForm({ ...editForm, quantity: e.target.value })
                        }
                        className="w-full px-3 py-2 border rounded-lg text-sm"
                        placeholder="Quantity"
                      />
                      <input
                        type="url"
                        value={editForm.image}
                        onChange={(e) =>
                          setEditForm({ ...editForm, image: e.target.value })
                        }
                        className="w-full px-3 py-2 border rounded-lg text-sm"
                        placeholder="Image URL"
                      />
                      <textarea
                        value={editForm.description}
                        onChange={(e) =>
                          setEditForm({
                            ...editForm,
                            description: e.target.value,
                          })
                        }
                        className="w-full px-3 py-2 border rounded-lg text-sm resize-none"
                        rows={2}
                        placeholder="Description"
                      />
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleUpdate(product._id)}
                          className="flex-1 py-2 bg-emerald-600 text-white rounded-lg text-sm hover:bg-emerald-700 transition flex items-center justify-center gap-1"
                        >
                          <Save className="w-4 h-4" />
                          Save
                        </button>
                        <button
                          onClick={cancelEdit}
                          className="flex-1 py-2 bg-gray-300 text-gray-700 rounded-lg text-sm hover:bg-gray-400 transition flex items-center justify-center gap-1"
                        >
                          <X className="w-4 h-4" />
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    // View Mode
                    <>
                      <div className="relative h-40 bg-gray-100 rounded-lg mb-3">
                        <Image
                          src={product.image || "/images/placeholder.jpg"}
                          alt={product.name}
                          fill
                          className="object-cover rounded-lg"
                        />
                      </div>

                      <h3 className="font-bold text-gray-800 mb-1">
                        {product.name}
                      </h3>
                      <p className="text-sm text-gray-600 mb-2 line-clamp-2">
                        {product.description || "No description"}
                      </p>
                      <p className="text-sm text-gray-600 mb-2">
                        ₹{product.price} • Qty: {product.quantity}
                      </p>

                      <div className="flex items-center justify-between gap-2">
                        <span
                          className={`text-xs px-2 py-1 rounded ${
                            product.inStock
                              ? "bg-green-100 text-green-700"
                              : "bg-red-100 text-red-700"
                          }`}
                        >
                          {product.inStock ? "In Stock" : "Out of Stock"}
                        </span>

                        <div className="flex gap-2">
                          <button
                            onClick={() => startEdit(product)}
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(product._id)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
