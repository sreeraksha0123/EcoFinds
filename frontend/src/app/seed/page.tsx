// src/app/seed/page.tsx
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { Package, RefreshCw, Trash2 } from "lucide-react";
import { useSession } from "next-auth/react";

export default function SeedPage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [loading, setLoading] = useState(false);
  const [clearing, setClearing] = useState(false);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/login");
    }
  }, [status, router]);

  const handleClearAndSeed = async () => {
    setLoading(true);
    try {
      const clearRes = await fetch("/api/clear-db", { method: "POST" });
      const clearData = await clearRes.json();

      if (!clearData.success) {
        toast.error("Failed to clear database");
        setLoading(false);
        return;
      }

      toast.success(`Cleared ${clearData.deleted.products} old products`);

      const seedRes = await fetch("/api/seed", { method: "POST" });
      const seedData = await seedRes.json();

      if (seedData.success) {
        toast.success(`${seedData.count} fresh products added! 🎉`);
        setTimeout(() => router.push("/products"), 2000);
      } else {
        toast.error(seedData.message || "Failed to add products");
      }
    } catch (error) {
      toast.error("An error occurred");
    } finally {
      setLoading(false);
    }
  };

  const handleSeedOnly = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/seed", { method: "POST" });
      const data = await res.json();

      if (data.success) {
        toast.success(`${data.count} products added successfully! 🎉`);
        setTimeout(() => router.push("/products"), 2000);
      } else {
        toast.error(data.message || "Failed to add products");
      }
    } catch (error) {
      toast.error("An error occurred");
    } finally {
      setLoading(false);
    }
  };

  const handleClearOnly = async () => {
    if (!confirm("⚠️ This will delete ALL your products and orders. Are you sure?")) return;

    setClearing(true);
    try {
      const res = await fetch("/api/clear-db", { method: "POST" });
      const data = await res.json();

      if (data.success) {
        toast.success(`Database cleared! ${data.deleted.products} products deleted.`);
        setTimeout(() => router.push("/products"), 1500);
      } else {
        toast.error(data.message || "Failed to clear database");
      }
    } catch (error) {
      toast.error("An error occurred");
    } finally {
      setClearing(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-6">
      <div className="max-w-lg w-full bg-white rounded-2xl shadow-lg p-8">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Package className="w-8 h-8 text-emerald-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Database Management</h1>
          <p className="text-gray-600">Clear old data and add fresh sample products</p>
        </div>

        <div className="space-y-4">
          <button
            onClick={handleClearAndSeed}
            disabled={loading || clearing}
            className="w-full py-3 bg-emerald-600 text-white rounded-lg font-medium hover:bg-emerald-700 transition disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <RefreshCw className="w-5 h-5 animate-spin" />
                Processing...
              </>
            ) : (
              <>
                <RefreshCw className="w-5 h-5" />
                Clear Database & Add 10 Fresh Products
              </>
            )}
          </button>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">OR</span>
            </div>
          </div>

          <button
            onClick={handleSeedOnly}
            disabled={loading || clearing}
            className="w-full py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition disabled:opacity-50 flex items-center justify-center gap-2"
          >
            <Package className="w-5 h-5" />
            Add Products Only (Keep Existing)
          </button>

          <button
            onClick={handleClearOnly}
            disabled={loading || clearing}
            className="w-full py-3 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {clearing ? (
              <>
                <RefreshCw className="w-5 h-5 animate-spin" />
                Clearing...
              </>
            ) : (
              <>
                <Trash2 className="w-5 h-5" />
                Clear Database Only
              </>
            )}
          </button>
        </div>

        <div className="mt-6 p-4 bg-blue-50 rounded-lg">
          <p className="text-sm text-blue-800 font-medium mb-2">ℹ️ What you'll get:</p>
          <ul className="text-xs text-blue-700 space-y-1">
            <li>• 10 eco-friendly products</li>
            <li>• All with working Amazon CDN images</li>
            <li>• Proper stock quantities</li>
            <li>• Ready to buy and test!</li>
          </ul>
        </div>

        <p className="text-xs text-gray-500 text-center mt-4">
          ⚠️ Note: You must be logged in to use these features
        </p>
      </div>
    </div>
  );
}
