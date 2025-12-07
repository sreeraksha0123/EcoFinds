// src/components/layout/Navbar.tsx
"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { Leaf, LogOut } from "lucide-react";
import MiniCart from "../cart/MiniCart";

export default function Navbar() {
  const { data: session, status } = useSession();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 text-emerald-700">
            <Leaf className="w-8 h-8" />
            <span className="text-2xl font-bold">EcoFinds</span>
          </Link>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center gap-6">
            <Link
              href="/"
              className="text-gray-700 hover:text-emerald-600 transition"
            >
              Home
            </Link>
            <Link
              href="/products"
              className="text-gray-700 hover:text-emerald-600 transition"
            >
              Buy
            </Link>
            {session && (
              <>
                <Link
                  href="/sell"
                  className="text-gray-700 hover:text-emerald-600 transition"
                >
                  Sell
                </Link>
                <Link
                  href="/dashboard"
                  className="text-gray-700 hover:text-emerald-600 transition"
                >
                  Dashboard
                </Link>
              </>
            )}
          </div>

          {/* Right Side - Auth & Cart */}
          <div className="flex items-center gap-4">
            {status === "loading" ? (
              <div className="text-sm text-gray-500">Loading...</div>
            ) : session ? (
              <>
                <span className="text-sm text-gray-700 hidden sm:inline">
                  {session.user?.name}
                </span>
                <button
                  onClick={() => signOut({ callbackUrl: "/" })}
                  className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition"
                >
                  <LogOut className="w-4 h-4" />
                  <span className="hidden sm:inline">Logout</span>
                </button>
                <MiniCart />
              </>
            ) : (
              <Link
                href="/auth/login"
                className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition"
              >
                Login
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}