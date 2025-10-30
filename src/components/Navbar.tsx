"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { LogOut, LayoutDashboard, User } from "lucide-react";

const Navbar = () => {
  const pathname = usePathname();
  const user = true; 
  const signOut = () => {
    console.log("Logged out");
  };

  return (
    <nav className="border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link href="/" className="text-2xl font-bold text-foreground">
            TaskFlow
          </Link>

          <div className="flex items-center gap-4">
            {user ? (
              <>
                <Link href="/dashboard">
                  <Button
                    variant={pathname === "/dashboard" ? "default" : "ghost"}
                    size="sm"
                    className="gap-2"
                  >
                    <LayoutDashboard className="h-4 w-4" />
                    Dashboard
                  </Button>
                </Link>

                <Link href="/profile">
                  <Button
                    variant={pathname === "/profile" ? "default" : "ghost"}
                    size="sm"
                    className="gap-2"
                  >
                    <User className="h-4 w-4" />
                    Profile
                  </Button>
                </Link>

                <Button
                  onClick={signOut}
                  variant="outline"
                  size="sm"
                  className="gap-2"
                >
                  <LogOut className="h-4 w-4" />
                  Logout
                </Button>
              </>
            ) : (
              <Link href="/auth">
                <Button variant="default">Get Started</Button>
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
