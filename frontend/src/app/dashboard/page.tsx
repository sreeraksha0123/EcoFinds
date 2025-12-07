// src/app/dashboard/page.tsx
"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Package, TrendingUp, ShoppingBag, ShoppingCart } from "lucide-react";

type DashboardStats = {
  totalProducts: number;
  inStockCount: number;
  outOfStockCount: number;
  totalRevenue: number;
  orderCount: number;
};

type Order = {
  _id: string;
  totalAmount: number;
  createdAt: string;
  items: Array<{
    name: string;
    price: number;
    quantity: number;
    sellerId: string;
  }>;
};

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [stats, setStats] = useState<DashboardStats>({
    totalProducts: 0,
    inStockCount: 0,
    outOfStockCount: 0,
    totalRevenue: 0,
    orderCount: 0,
  });
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/login");
    } else if (status === "authenticated") {
      fetchDashboardData();
    }
  }, [status, router]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/dashboard");
      const data = await res.json();

      if (data.success) {
        setStats(data.stats);
        setOrders(data.recentOrders);
      }
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  if (status === "loading" || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-emerald-600 border-t-transparent mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Seller Dashboard</h1>
          <p className="text-gray-600 mt-2">
            Welcome back, {session?.user?.name}!
          </p>
        </div>

        {/* Main Stats Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          {/* Amount Sold (Revenue) */}
          <div className="bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-2xl shadow-lg p-6 text-white">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-white bg-opacity-20 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-6 h-6" />
              </div>
            </div>
            <h3 className="text-white text-opacity-90 font-medium mb-2">
              Amount Sold
            </h3>
            <p className="text-4xl font-bold">₹{stats.totalRevenue}</p>
            <p className="text-sm text-white text-opacity-75 mt-2">
              Total revenue earned
            </p>
          </div>

          {/* Listed Products */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Package className="w-6 h-6 text-blue-600" />
              </div>
              <span className="text-4xl font-bold text-gray-800">
                {stats.totalProducts}
              </span>
            </div>
            <h3 className="text-gray-600 font-medium mb-2">Listed Products</h3>
            <div className="flex gap-4 text-sm">
              <span className="text-green-600">
                ✓ {stats.inStockCount} In Stock
              </span>
              <span className="text-red-600">
                ✗ {stats.outOfStockCount} Out of Stock
              </span>
            </div>
          </div>

          {/* Orders Received */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <ShoppingCart className="w-6 h-6 text-purple-600" />
              </div>
              <span className="text-4xl font-bold text-gray-800">
                {stats.orderCount}
              </span>
            </div>
            <h3 className="text-gray-600 font-medium mb-2">Orders Received</h3>
            <p className="text-sm text-gray-500">
              Total orders containing your products
            </p>
          </div>
        </div>

        {/* Recent Orders */}
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">
            Recent Orders
          </h2>

          {orders.length === 0 ? (
            <div className="text-center py-12">
              <ShoppingBag className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">No orders received yet</p>
              <p className="text-sm text-gray-400 mt-2">
                Orders will appear here when customers buy your products
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4 text-gray-700 font-medium">
                      Order ID
                    </th>
                    <th className="text-left py-3 px-4 text-gray-700 font-medium">
                      Items Sold
                    </th>
                    <th className="text-left py-3 px-4 text-gray-700 font-medium">
                      Your Earnings
                    </th>
                    <th className="text-left py-3 px-4 text-gray-700 font-medium">
                      Date
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((order) => {
                    // Filter items that belong to this seller
                    const sellerItems = order.items.filter(
                      (item) => item.sellerId === (session?.user as any)?.id
                    );

                    if (sellerItems.length === 0) return null;

                    const sellerRevenue = sellerItems.reduce(
                      (sum, item) => sum + item.price * item.quantity,
                      0
                    );

                    return (
                      <tr key={order._id} className="border-b hover:bg-gray-50">
                        <td className="py-3 px-4 text-sm text-gray-600 font-mono">
                          #{order._id.slice(-8).toUpperCase()}
                        </td>
                        <td className="py-3 px-4 text-sm text-gray-800">
                          {sellerItems.map((item, idx) => (
                            <div key={idx} className="mb-1 last:mb-0">
                              <span className="font-medium">{item.name}</span>
                              <span className="text-gray-500 ml-2">
                                (×{item.quantity})
                              </span>
                            </div>
                          ))}
                        </td>
                        <td className="py-3 px-4 text-sm font-bold text-emerald-600">
                          ₹{sellerRevenue}
                        </td>
                        <td className="py-3 px-4 text-sm text-gray-600">
                          {new Date(order.createdAt).toLocaleDateString('en-IN', {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric'
                          })}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}