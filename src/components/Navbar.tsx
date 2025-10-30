"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Database, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useSelector, useDispatch } from "react-redux";
import { userLoggedOut } from "@/store/authSlice";
import axiosInstance from "@/lib/axios";

export default function Navbar() {
  const dispatch = useDispatch();
  const router = useRouter();
  const pathname = usePathname();
  const { isAuthenticated } = useSelector((s: any) => s.auth || {});
  const [open, setOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await axiosInstance.post("/auth/logout");
      dispatch(userLoggedOut());
      router.push("/");
      setOpen(false);
    } catch (err) {
      console.error("Logout failed", err);
    }
  };

  const handleLinkClick = (href: string) => {
    router.push(href);
    setOpen(false);
  };

  return (
    <nav className="bg-white shadow-sm sticky top-0 z-40">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-3">
            <Database className="h-8 w-8 text-blue-500" />
            <Link href="/" className="text-lg font-bold text-blue-600">
              TaskFlow
            </Link>
          </div>

          <div className="hidden md:flex items-center gap-4">
            <Link
              href="/"
              className={`px-3 py-2 rounded-md text-sm font-medium ${
                pathname === "/"
                  ? "text-blue-600"
                  : "text-gray-600 hover:text-blue-600"
              }`}
            >
              Home
            </Link>
            <Link
              href="/dashboard"
              className={`px-3 py-2 rounded-md text-sm font-medium ${
                pathname === "/dashboard"
                  ? "text-blue-600"
                  : "text-gray-600 hover:text-blue-600"
              }`}
            >
              Dashboard
            </Link>
            <Link
              href="/profile"
              className={`px-3 py-2 rounded-md text-sm font-medium ${
                pathname === "/profile"
                  ? "text-blue-600"
                  : "text-gray-600 hover:text-blue-600"
              }`}
            >
              Profile
            </Link>
            {isAuthenticated ? (
              <Button onClick={handleLogout} variant="outline" className="ml-2">
                Logout
              </Button>
            ) : (
              <Link href="/auth">
                <Button variant="ghost" className="ml-2">
                  Login
                </Button>
              </Link>
            )}
          </div>

          <div className="md:hidden">
            <button
              onClick={() => setOpen((v) => !v)}
              className="p-2 rounded-md hover:bg-gray-100"
            >
              {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {open && (
        <div className="md:hidden bg-white border-t">
          <div className="px-4 py-3 space-y-1">
            <button
              onClick={() => handleLinkClick("/")}
              className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-50"
            >
              Home
            </button>
            <button
              onClick={() => handleLinkClick("/dashboard")}
              className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-50"
            >
              Dashboard
            </button>
            <button
              onClick={() => handleLinkClick("/profile")}
              className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-50"
            >
              Profile
            </button>
            {isAuthenticated ? (
              <button
                onClick={handleLogout}
                className="w-full text-left px-3 py-2 rounded-md text-base font-medium text-red-600 hover:bg-gray-50"
              >
                Logout
              </button>
            ) : (
              <button
                onClick={() => handleLinkClick("/auth")}
                className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-50"
              >
                Login
              </button>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
