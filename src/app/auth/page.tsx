"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Database, Lock, Mail, User } from "lucide-react";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { userLoggedIn } from "@/store/authSlice";
import axiosInstance from "@/lib/axios";
import { Toaster, toast } from "sonner";

interface FormData {
  name?: string;
  email: string;
  password: string;
}

const Auth = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const [formData, setFormData] = useState<FormData>({
    email: "",
    password: "",
  });
  const [loginLoading, setLoginLoading] = useState(false);
  const [signupLoading, setSignupLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.password) {
      toast.error("All fields are required");
      return;
    }
    setSignupLoading(true);
    try {
      const response = await axiosInstance.post("/auth/signup", {
        name: formData.name.trim(),
        email: formData.email.trim(),
        password: formData.password.trim(),
      });
      if (response.data.success) {
        dispatch(
          userLoggedIn({
            user: response.data.user,
            token: response.data.token || "",
          })
        );
        toast.success(response.data.message);
        router.push("/");
      } else {
        toast.error(response.data.message || "Something went wrong");
      }
    } catch (error: any) {
      console.error("Signup error:", error);
      toast.error(
        error.response?.data?.message || "Server error. Try again later."
      );
    } finally {
      setSignupLoading(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.email || !formData.password) {
      toast.error("All fields are required");
      return;
    }
    setLoginLoading(true);
    try {
      const response = await axiosInstance.post("/auth/login", {
        email: formData.email.trim(),
        password: formData.password.trim(),
      });
      if (response.data.success) {
        dispatch(
          userLoggedIn({
            user: response.data.user,
            token: response.data.token || "",
          })
        );
        toast.success(response.data.message);
        router.push("/");
      } else {
        toast.error(response.data.message || "Something went wrong");
      }
    } catch (error: any) {
      console.error("Login error:", error);
      toast.error(
        error.response?.data?.message || "Server error. Try again later."
      );
    } finally {
      setLoginLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-50 p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-3">
            <Database className="h-10 w-10 text-blue-600" />
            <h1 className="text-4xl font-bold text-blue-600">TaskFlow</h1>
          </div>
          <p className="text-gray-600">Manage your tasks with ease</p>
        </div>
        <Card className="shadow-2xl border-0 rounded-3xl bg-white/95">
          <CardContent className="p-8">
            <Tabs defaultValue="login" className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-8 bg-gray-100 rounded-full p-1">
                <TabsTrigger
                  value="login"
                  className="rounded-full data-[state=active]:bg-white data-[state=active]:text-blue-600 data-[state=active]:shadow-sm"
                >
                  Login
                </TabsTrigger>
                <TabsTrigger
                  value="signup"
                  className="rounded-full data-[state=active]:bg-blue-600 data-[state=active]:text-white"
                >
                  Sign Up
                </TabsTrigger>
              </TabsList>
              <TabsContent value="login">
                <form onSubmit={handleLogin} className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="login-email">Email</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                      <Input
                        id="login-email"
                        type="email"
                        name="email"
                        placeholder="you@example.com"
                        className="pl-11 h-12 bg-gray-50 border-0 rounded-xl focus:ring-2 focus:ring-blue-500"
                        value={formData.email || ""}
                        onChange={handleChange}
                        disabled={loginLoading}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="login-password">Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                      <Input
                        id="login-password"
                        type="password"
                        name="password"
                        placeholder="••••••••"
                        className="pl-11 h-12 bg-gray-50 border-0 rounded-xl focus:ring-2 focus:ring-blue-500"
                        value={formData.password || ""}
                        onChange={handleChange}
                        disabled={loginLoading}
                      />
                    </div>
                  </div>
                  <Button
                    type="submit"
                    className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-xl"
                    disabled={loginLoading}
                  >
                    {loginLoading ? "Signing in..." : "Login"}
                  </Button>
                </form>
              </TabsContent>
              <TabsContent value="signup">
                <form onSubmit={handleSignup} className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="signup-name">Full Name</Label>
                    <div className="relative">
                      <User className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                      <Input
                        id="signup-name"
                        type="text"
                        name="name"
                        placeholder="Your Name"
                        className="pl-11 h-12 bg-gray-50 border-0 rounded-xl focus:ring-2 focus:ring-blue-500"
                        value={formData.name || ""}
                        onChange={handleChange}
                        disabled={signupLoading}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signup-email">Email</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                      <Input
                        id="signup-email"
                        type="email"
                        name="email"
                        placeholder="you@example.com"
                        className="pl-11 h-12 bg-gray-50 border-0 rounded-xl focus:ring-2 focus:ring-blue-500"
                        value={formData.email || ""}
                        onChange={handleChange}
                        disabled={signupLoading}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signup-password">Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                      <Input
                        id="signup-password"
                        type="password"
                        name="password"
                        placeholder="••••••••"
                        className="pl-11 h-12 bg-gray-50 border-0 rounded-xl focus:ring-2 focus:ring-blue-500"
                        value={formData.password || ""}
                        onChange={handleChange}
                        disabled={signupLoading}
                      />
                    </div>
                  </div>
                  <Button
                    type="submit"
                    className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-xl"
                    disabled={signupLoading}
                  >
                    {signupLoading ? "Creating..." : "Create Account"}
                  </Button>
                </form>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
      <Toaster position="top-right" />
    </div>
  );
};

export default Auth;
