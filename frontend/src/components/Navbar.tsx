"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Bell, Menu, LogOut } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { usePathname } from "next/navigation";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { ModeToggle } from "@/components/mode-toggle";
import { motion } from "framer-motion";
import api from "@/lib/api";

// ---------------- Types ----------------
interface Notification {
  _id: string;
  type: "booking" | "message";
  message: string;
  createdAt: string;
  isRead: boolean;
}

// ---------------- Component ----------------
export function Navbar() {
  const [user, setUser] = useState<{ email: string; role: string } | null>(
    null,
  );
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const pathname = usePathname();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await api.get("/auth/me"); // 🔥 cookie auto sent
        setUser({
          email: res.data.email,
          role: res.data.role.toLowerCase(),
        });
      } catch {
        setUser(null);
      }
    };

    fetchUser();

    setNotifications([]);
  }, []);

  const isLoggedIn = !!user;
  const role = user?.role;

  // ---------------- Logout ----------------
  const handleLogout = async () => {
    try {
      await api.post("/auth/logout"); // 🔥 remove cookie
      toast.success("Logged out");
      window.location.href = "/login";
    } catch {
      toast.error("Logout failed");
    }
  };

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  // ---------------- Navigation ----------------
  const navLinks =
  role === "owner"
    ? [
        { href: "/owner/dashboard", label: "Dashboard" },
        { href: "/owner/properties", label: "Properties" },
        { href: "/owner/bookings", label: "Bookings" },
        { href: "/owner/tenants", label: "Tenants" }, // keep only if working
        // { href: "/messages", label: "Messages" },
      ]
    : [
        ...(isLoggedIn
          ? [{ href: "/user/dashboard", label: "Dashboard" }]
          : []),

        { href: "/Explore", label: "Explore" },
        // { href: "/roommates", label: "Roommates" },

        ...(isLoggedIn
          ? [
              { href: "/user/bookings", label: "My Bookings" },
              { href: "/user/favorites", label: "Favorites" },
              // { href: "/messages", label: "Messages" },
            ]
          : [
              { href: "/about", label: "About" },
              { href: "/contact", label: "Contact" },
            ]),
      ];

  const accountLinks =
  role === "owner"
    ? [
        { href: "/owner/profile", label: "Profile" },
        { href: "/owner/settings", label: "Settings" },
       
      ]
    : [
        
        { href: "/user/profile", label: "Profile" },
        { href: "/user/settings", label: "Settings" },
      
      ];

  // ---------------- UI ----------------
  return (
    <motion.header
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ type: "spring", stiffness: 80 }}
      className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur-md shadow-md"
    >
      <div className="flex h-16 w-full items-center justify-between px-4 sm:px-6 lg:px-10">
        {/* Brand */}
        <Link href="/" className="text-2xl font-bold text-primary">
          RentAura
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-6">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`text-sm font-semibold ${
                  isActive ? "text-primary" : "text-gray-600 hover:text-primary"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        {/* Right */}
        <div className="flex items-center gap-3">
          {/* Notifications (disabled UI) */}
          {/* {isLoggedIn && (
            <Button variant="ghost" className="relative">
              <Bell className="h-5 w-5" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 text-xs bg-red-500 text-white rounded-full px-1">
                  {unreadCount}
                </span>
              )}
            </Button>
          )} */}

          <ModeToggle />

          {/* Account */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                {isLoggedIn ? "My Account" : "Login / Signup"}
              </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end">
              {isLoggedIn ? (
                <>
                  <DropdownMenuLabel>My Account</DropdownMenuLabel>
                  <DropdownMenuSeparator />

                  {accountLinks.map((link) => (
                    <DropdownMenuItem key={link.href} asChild>
                      <Link href={link.href}>{link.label}</Link>
                    </DropdownMenuItem>
                  ))}

                  <DropdownMenuSeparator />

                  <DropdownMenuItem onClick={handleLogout}>
                    <LogOut className="mr-2 h-4 w-4" /> Logout
                  </DropdownMenuItem>
                </>
              ) : (
                <>
                  <DropdownMenuItem asChild>
                    <Link href="/login">Login</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/sign-up">Signup</Link>
                  </DropdownMenuItem>
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Mobile */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            <Menu className="h-5 w-5" />
          </Button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t p-4 flex flex-col gap-3">
          {navLinks.map((link) => (
            <Link key={link.href} href={link.href}>
              {link.label}
            </Link>
          ))}
        </div>
      )}
    </motion.header>
  );
}
