"use client";

import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import axiosInstance from "@/lib/axios";
import { RootState } from "@/store";
import { toast, Toaster } from "sonner";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Mail, Calendar, Edit3, ImageIcon, AlertCircle } from "lucide-react";

interface ProfileType {
  _id: string;
  email: string;
  name: string;
  bio?: string;
  created_at?: string | null;
}

export default function Profile() {
  const [profile, setProfile] = useState<ProfileType | null>(null);
  const [form, setForm] = useState({ name: "", bio: "" });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { user } = useSelector((s: RootState) => s.auth);

  const formatJoinDate = (d?: string | null) =>
    d && !isNaN(Date.parse(d))
      ? new Date(d).toLocaleDateString("en-US", {
          year: "numeric",
          month: "long",
          day: "numeric",
        })
      : "Unknown date";

  const initials = (name?: string | null) => {
    if (!name) return "U";
    return name
      .split(" ")
      .map((n) => n.charAt(0))
      .slice(0, 2)
      .join("")
      .toUpperCase();
  };

  const fetchProfile = async () => {
    if (!user) {
      setError("You must be logged in to view your profile.");
      setLoading(false);
      return;
    }
    try {
      setLoading(true);
      setError(null);
      const { data } = await axiosInstance.get("/auth/me");
      if (data?.success && data.user) {
        setProfile(data.user);
        setForm({ name: data.user.name ?? "", bio: data.user.bio ?? "" });
      } else {
        throw new Error(data?.message || "Failed to fetch profile");
      }
    } catch (err: any) {
      const msg =
        err?.response?.data?.message || err?.message || "Network error";
      setError(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profile) return;
    try {
      setSaving(true);
      const { data } = await axiosInstance.put("/auth/me", form);
      if (data?.success && data.user) {
        setProfile(data.user);
        setForm({ name: data.user.name ?? "", bio: data.user.bio ?? "" });
        toast.success("Profile updated");
      } else {
        throw new Error(data?.message || "Update failed");
      }
    } catch (err: any) {
      const msg =
        err?.response?.data?.message || err?.message || "Update failed";
      toast.error(msg);
    } finally {
      setSaving(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, [user]); // hand change

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-50 p-6">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600" />
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-50 p-6">
        <Card className="max-w-md w-full">
          <CardHeader>
            <CardTitle className="text-red-600 flex items-center gap-2">
              <AlertCircle className="h-5 w-5" />
              Access Denied
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-700">{error || "You must be logged in."}</p>
            <Button
              onClick={() => (window.location.href = "/auth")}
              className="mt-4 w-full"
            >
              Go to Login
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 via-indigo-50 to-blue-200 py-10 px-4">
      <Toaster position="top-right" />
      <div className="max-w-6xl mx-auto">
        <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <h2 className="text-xl font-semibold text-slate-700 text-center sm:text-left">
            Profile
          </h2>
          <div className="text-sm text-slate-500 text-center sm:text-right">
            Manage account settings
          </div>
        </div>

        <div className="bg-white/70 rounded-2xl shadow-lg overflow-hidden">
          <div className="h-32 sm:h-40 bg-gradient-to-r from-blue-300 to-indigo-200 relative">
            <div className="absolute left-1/2 sm:left-6 top-6 transform sm:transform-none -translate-x-1/2 sm:translate-x-0 flex items-center gap-4">
              <div className="h-20 w-20 sm:h-24 sm:w-24 rounded-full bg-blue-600 text-white flex items-center justify-center text-2xl sm:text-3xl font-bold shadow-lg border-4 border-white/70">
                {initials(profile.name)}
              </div>
              <div className="hidden sm:block">
                <div className="text-lg sm:text-2xl font-semibold text-slate-800">
                  {profile.name}
                </div>
                <div className="text-sm text-slate-600">{profile.email}</div>
              </div>
            </div>
            <div className="absolute right-6 top-6 hidden sm:flex items-center gap-2 text-slate-700">
              <div className="flex items-center gap-2 px-3 py-1 bg-white/60 rounded-full border border-white/40 shadow-sm">
                <ImageIcon className="h-4 w-4" />
                <span className="text-sm">Personal</span>
              </div>
            </div>
          </div>

          <div className="p-6 sm:p-8 grid gap-6 sm:grid-cols-2">
            <div className="flex items-stretch">
              <Card className="w-full rounded-2xl shadow-md border-0">
                <CardContent className="p-6">
                  <div className="sm:hidden flex items-center gap-4 mb-4">
                    <div className="h-14 w-14 rounded-full bg-blue-600 text-white flex items-center justify-center text-lg font-bold">
                      {initials(profile.name)}
                    </div>
                    <div>
                      <div className="font-semibold text-slate-800">
                        {profile.name}
                      </div>
                      <div className="text-sm text-slate-500">
                        {profile.email}
                      </div>
                    </div>
                  </div>

                  <div className="text-center sm:text-left space-y-4">
                    <div>
                      <h3 className="text-slate-800 font-semibold text-lg sm:text-xl">
                        {profile.name}
                      </h3>
                      <p className="text-sm text-slate-500 mt-1">
                        {profile.email}
                      </p>
                    </div>

                    <div className="flex items-center justify-center sm:justify-start gap-2 text-slate-600">
                      <Mail className="h-4 w-4 text-blue-500" />
                      <span className="text-sm">{profile.email}</span>
                    </div>

                    <div className="flex items-center justify-center sm:justify-start gap-2 text-slate-600">
                      <Calendar className="h-4 w-4 text-blue-500" />
                      <span className="text-sm">
                        Joined on {formatJoinDate(profile.created_at)}
                      </span>
                    </div>

                    <div className="mt-4 p-3 rounded-lg bg-blue-50 border border-blue-100 text-left">
                      <div className="text-sm font-medium text-slate-700">
                        Bio
                      </div>
                      <div className="text-sm text-slate-600 mt-1">
                        {profile.bio ? (
                          profile.bio
                        ) : (
                          <span className="italic text-slate-400">
                            No bio yet
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="flex items-stretch">
              <Card className="w-full rounded-2xl shadow-md border-0">
                <CardHeader className="px-6 pt-6">
                  <CardTitle className="flex items-center gap-2 text-slate-800">
                    <Edit3 className="h-4 w-4 text-blue-600" /> Edit Profile
                  </CardTitle>
                  <CardDescription className="text-sm text-slate-500">
                    Change your display name and bio
                  </CardDescription>
                </CardHeader>

                <CardContent className="p-6">
                  <form onSubmit={handleSave} className="space-y-4">
                    <div>
                      <Label htmlFor="name">Full Name</Label>
                      <Input
                        id="name"
                        value={form.name}
                        onChange={(e) =>
                          setForm({ ...form, name: e.target.value })
                        }
                        placeholder="Your full name"
                        className="mt-1"
                      />
                    </div>

                    <div>
                      <Label htmlFor="bio">Bio</Label>
                      <Textarea
                        id="bio"
                        value={form.bio}
                        onChange={(e) =>
                          setForm({ ...form, bio: e.target.value })
                        }
                        rows={4}
                        placeholder="Short bio about you"
                        className="mt-1"
                      />
                    </div>

                    <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center">
                      <Button
                        type="submit"
                        className="flex-1"
                        disabled={saving}
                      >
                        {saving ? "Saving..." : "Save Changes"}
                      </Button>
                      <Button
                        variant="ghost"
                        onClick={() => {
                          setForm({
                            name: profile.name ?? "",
                            bio: profile.bio ?? "",
                          });
                          toast("Changes discarded");
                        }}
                        className="flex-1 sm:flex-none"
                      >
                        Reset
                      </Button>
                    </div>
                  </form>
                  <p className="mt-4 text-xs text-slate-500 text-center sm:text-left">
                    Your name and bio are private to your account. Email is
                    read-only.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
