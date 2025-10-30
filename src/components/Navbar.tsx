"use client";

import React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Database } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useSelector, useDispatch } from "react-redux";
import { userLoggedOut } from "@/store/authSlice";
import axiosInstance from "@/lib/axios";

const Navbar = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const pathname = usePathname();
  const { isAuthenticated } = useSelector((state: any) => state.auth || {});

  const handleLogout = async () => {
    try {
      await axiosInstance.post("/auth/logout");
      dispatch(userLoggedOut());
      router.push("/");
    } catch (err) {
      console.error("Logout failed", err);
    }
  };

  return (
    <nav className="bg-white shadow-sm">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <Database className="h-8 w-8 text-blue-500" />
          <span className="text-xl font-bold text-blue-500">TaskFlow</span>
        </div>

        {/* Navigation */}
        <div className="flex items-center gap-4">
          <Button
            asChild
            variant="ghost"
            className={`text-gray-600 hover:text-blue-500 font-bold transition-colors duration-200 ${
              pathname === "/" ? "text-blue-500" : ""
            }`}
          >
            <Link href="/">Home</Link>
          </Button>

          <Button
            asChild
            variant="ghost"
            className={`text-gray-600 hover:text-blue-500 font-bold transition-colors duration-200 ${
              pathname === "/dashboard" ? "text-blue-500" : ""
            }`}
          >
            <Link href="/dashboard">Dashboard</Link>
          </Button>

          <Button
            asChild
            variant="ghost"
            className={`text-gray-600 hover:text-blue-500 font-bold transition-colors duration-200 ${
              pathname === "/profile" ? "text-blue-500" : ""
            }`}
          >
            <Link href="/profile">Profile</Link>
          </Button>

          {isAuthenticated ? (
            <Button
              onClick={handleLogout}
              variant="outline"
              className="text-gray-700"
            >
              Logout
            </Button>
          ) : (
            <Button
              asChild
              variant="ghost"
              className="text-gray-600 hover:text-blue-500 font-bold transition-colors duration-200"
            >
              <Link href="/auth">Login</Link>
            </Button>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
