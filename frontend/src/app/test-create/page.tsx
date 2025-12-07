// src/app/test-create/page.tsx
"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import toast from "react-hot-toast";

export default function TestCreatePage() {
  const { data: session } = useSession();
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const testCreate = async () => {
    setLoading(true);
    setResult(null);

    try {
      const testProduct = {
        name: "Test Eco Bottle",
        price: 299,
        image: "https://m.media-amazon.com/images/I/61vE3fc1VvL._SL1500_.jpg",
        description: "Test product for debugging",
        quantity: 10,
      };

      console.log("Sending:", testProduct);

      const res = await fetch("/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(testProduct),
      });

      console.log("Response status:", res.status);

      const data = await res.json();
      console.log("Response data:", data);

      setResult({
        status: res.status,
        success: data.success,
        message: data.message,
        error: data.error,
        product: data.product,
      });

      if (data.success) {
        toast.success("Product created!");
      } else {
        toast.error(data.message || "Failed");
      }
    } catch (error: any) {
      console.error("Error:", error);
      setResult({
        error: error.message,
      });
      toast.error("Request failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-lg shadow p-6">
          <h1 className="text-2xl font-bold mb-4">Test Product Creation</h1>

          <div className="mb-4 p-4 bg-blue-50 rounded">
            <p className="text-sm">
              <strong>Session:</strong>{" "}
              {session ? `Logged in as ${session.user?.name}` : "Not logged in"}
            </p>
            <p className="text-sm">
              <strong>User ID:</strong> {(session?.user as any)?.id || "N/A"}
            </p>
          </div>

          <button
            onClick={testCreate}
            disabled={loading || !session}
            className="px-6 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 disabled:opacity-50"
          >
            {loading ? "Testing..." : "Test Create Product"}
          </button>

          {!session && (
            <p className="text-red-600 text-sm mt-2">
              Please login first at /auth/login
            </p>
          )}

          {result && (
            <div className="mt-6 p-4 bg-gray-100 rounded">
              <h3 className="font-bold mb-2">Result:</h3>
              <pre className="text-xs overflow-auto">
                {JSON.stringify(result, null, 2)}
              </pre>
            </div>
          )}

          <div className="mt-6 p-4 bg-yellow-50 rounded text-sm">
            <p className="font-bold mb-2">Expected Flow:</p>
            <ol className="list-decimal ml-4 space-y-1">
              <li>User must be logged in</li>
              <li>POST request to /api/products</li>
              <li>Server validates session</li>
              <li>Server creates product in MongoDB</li>
              <li>Returns success with product data</li>
            </ol>
          </div>
        </div>
      </div>
    </div>
  );
}