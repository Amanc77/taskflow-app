"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Database, Lock, Mail, User } from "lucide-react";
import { useRouter } from "next/navigation";
import axiosInstance from "@/lib/axios";
import { Toaster, toast } from "sonner";
import { AxiosError } from "axios";

interface Credentials {
  name?: string;
  email: string;
  password: string;
}

interface ApiResponse {
  success: boolean;
  message: string;
  user?: { id: string; name: string; email: string };
  token?: string;
}

export default function Auth() {
  const router = useRouter();

  const [login, setLogin] = useState<Credentials>({ email: "", password: "" });
  const [signup, setSignup] = useState<Credentials>({
    name: "",
    email: "",
    password: "",
  });
  const [loginLoading, setLoginLoading] = useState(false);
  const [signupLoading, setSignupLoading] = useState(false);

  const handleLoginChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLogin({ ...login, [e.target.name]: e.target.value });
  };

  const handleSignupChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSignup({ ...signup, [e.target.name]: e.target.value });
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const { email, password } = login;

    if (!email.trim() || !password.trim())
      return toast.error("Fill all fields");
    if (!/^\S+@\S+\.\S+$/.test(email)) return toast.error("Invalid email");

    setLoginLoading(true);
    try {
      const res = await axiosInstance.post<ApiResponse>("/auth/login", {
        email: email.trim(),
        password,
      });

      toast.success("Logged in!");
      router.push("/");
    } catch (err) {
      const error = err as AxiosError<{ message?: string }>;
      toast.error(error.response?.data?.message || "Login failed");
    } finally {
      setLoginLoading(false);
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    const { name, email, password } = signup;

    if (!name?.trim() || !email.trim() || !password.trim())
      return toast.error("All fields required");
    if (!/^\S+@\S+\.\S+$/.test(email)) return toast.error("Invalid email");
    if (password.length < 6) return toast.error("Password too short");

    setSignupLoading(true);
    try {
      const res = await axiosInstance.post<ApiResponse>("/auth/signup", {
        name: name.trim(),
        email: email.trim(),
        password,
      });

      toast.success("Account created!");
      router.push("/");
    } catch (err) {
      const error = err as AxiosError<{ message?: string }>;
      toast.error(error.response?.data?.message || "Signup failed");
    } finally {
      setSignupLoading(false);
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

        <Card className="shadow-2xl border-0 rounded-3xl">
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
                        value={login.email}
                        onChange={handleLoginChange}
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
                        value={login.password}
                        onChange={handleLoginChange}
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
                        placeholder="your name"
                        className="pl-11 h-12 bg-gray-50 border-0 rounded-xl focus:ring-2 focus:ring-blue-500"
                        value={signup.name}
                        onChange={handleSignupChange}
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
                        placeholder="abc@gmail.com"
                        className="pl-11 h-12 bg-gray-50 border-0 rounded-xl focus:ring-2 focus:ring-blue-500"
                        value={signup.email}
                        onChange={handleSignupChange}
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
                        value={signup.password}
                        onChange={handleSignupChange}
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

      <Toaster position="top-right" richColors closeButton />
    </div>
  );
}
