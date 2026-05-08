"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  Bell,
  Shield,
  Building2,
  Lock,
  Smartphone,
  Save,
  Trash2,
  Eye,
  EyeOff,
  Wallet,
  BadgeCheck,
  Users,
} from "lucide-react";
import { useTheme } from "next-themes";
import api from "@/lib/api";
import { toast } from "sonner";

export default function OwnerSettingsPage() {
  const { theme, setTheme } = useTheme();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const [settings, setSettings] = useState({
    bookingNotifications: true,
    maintenanceAlerts: true,
    marketingEmails: false,
    instantBooking: true,
    autoApproveTenants: false,
    showContactPublicly: true,
    twoFactorAuth: false,
    propertyVisibility: "public",
    payoutMethod: "bank",
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const res = await api.get("/auth/owner/settings");

      setSettings((prev) => ({
        ...prev,
        ...res.data,
      }));
    } catch (error) {
      console.error(error);
      toast.error("Failed to load settings");
    } finally {
      setLoading(false);
    }
  };

  const handleToggle = (key: string) => {
    setSettings((prev: any) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;

    setSettings((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSave = async () => {
    try {
      setSaving(true);

      if (
        settings.newPassword &&
        settings.newPassword !== settings.confirmPassword
      ) {
        toast.error("Passwords do not match");
        return;
      }

      if (
        settings.newPassword &&
        settings.newPassword.length < 6
      ) {
        toast.error("Password must be at least 6 characters");
        return;
      }

      const payload: any = {
        bookingNotifications:
          settings.bookingNotifications,
        maintenanceAlerts:
          settings.maintenanceAlerts,
        marketingEmails: settings.marketingEmails,
        instantBooking: settings.instantBooking,
        autoApproveTenants:
          settings.autoApproveTenants,
        showContactPublicly:
          settings.showContactPublicly,
        twoFactorAuth: settings.twoFactorAuth,
        propertyVisibility:
          settings.propertyVisibility,
        payoutMethod: settings.payoutMethod,
      };

      if (
        settings.currentPassword &&
        settings.newPassword
      ) {
        payload.currentPassword =
          settings.currentPassword;
        payload.newPassword = settings.newPassword;
      }

      await api.put(
        "/auth/owner/settings",
        payload,
      );

      toast.success("Owner settings updated");

      setSettings((prev) => ({
        ...prev,
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      }));
    } catch (error: any) {
      console.error(error);

      toast.error(
        error?.response?.data ||
          "Failed to update settings",
      );
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen text-gray-400">
        Loading owner settings...
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-8">
      {/* HEADER */}
      <div>
        <h1 className="text-4xl font-bold text-white">
          Owner Settings
        </h1>

        <p className="text-gray-400 mt-2">
          Manage your property business preferences,
          security, and platform settings.
        </p>
      </div>

      {/* BUSINESS SETTINGS */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6 space-y-6"
      >
        <div className="flex items-center gap-3">
          <Building2 className="text-blue-500" />

          <h2 className="text-2xl font-semibold text-white">
            Business Preferences
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* DARK MODE */}
          <div className="bg-zinc-800 rounded-2xl p-5 flex items-center justify-between">
            <div>
              <h3 className="text-white font-medium">
                Dark Mode
              </h3>

              <p className="text-gray-400 text-sm mt-1">
                Enable dark dashboard appearance.
              </p>
            </div>

            <button
              onClick={() =>
                setTheme(
                  theme === "dark"
                    ? "light"
                    : "dark",
                )
              }
              className={`w-14 h-7 rounded-full transition relative ${
                theme === "dark"
                  ? "bg-green-500"
                  : "bg-zinc-600"
              }`}
            >
              <div
                className={`absolute top-1 w-5 h-5 rounded-full bg-white transition ${
                  theme === "dark"
                    ? "right-1"
                    : "left-1"
                }`}
              />
            </button>
          </div>

          {/* INSTANT BOOKING */}
          <div className="bg-zinc-800 rounded-2xl p-5 flex items-center justify-between">
            <div>
              <h3 className="text-white font-medium">
                Instant Booking
              </h3>

              <p className="text-gray-400 text-sm mt-1">
                Allow tenants to book instantly.
              </p>
            </div>

            <button
              onClick={() =>
                handleToggle("instantBooking")
              }
              className={`w-14 h-7 rounded-full transition relative ${
                settings.instantBooking
                  ? "bg-green-500"
                  : "bg-zinc-600"
              }`}
            >
              <div
                className={`absolute top-1 w-5 h-5 rounded-full bg-white transition ${
                  settings.instantBooking
                    ? "right-1"
                    : "left-1"
                }`}
              />
            </button>
          </div>

          {/* AUTO APPROVE */}
          <div className="bg-zinc-800 rounded-2xl p-5 flex items-center justify-between">
            <div>
              <h3 className="text-white font-medium">
                Auto Approve Tenants
              </h3>

              <p className="text-gray-400 text-sm mt-1">
                Automatically approve verified users.
              </p>
            </div>

            <button
              onClick={() =>
                handleToggle("autoApproveTenants")
              }
              className={`w-14 h-7 rounded-full transition relative ${
                settings.autoApproveTenants
                  ? "bg-green-500"
                  : "bg-zinc-600"
              }`}
            >
              <div
                className={`absolute top-1 w-5 h-5 rounded-full bg-white transition ${
                  settings.autoApproveTenants
                    ? "right-1"
                    : "left-1"
                }`}
              />
            </button>
          </div>

          {/* PUBLIC CONTACT */}
          <div className="bg-zinc-800 rounded-2xl p-5 flex items-center justify-between">
            <div>
              <h3 className="text-white font-medium">
                Public Contact Info
              </h3>

              <p className="text-gray-400 text-sm mt-1">
                Show contact details on listings.
              </p>
            </div>

            <button
              onClick={() =>
                handleToggle("showContactPublicly")
              }
              className={`w-14 h-7 rounded-full transition relative ${
                settings.showContactPublicly
                  ? "bg-green-500"
                  : "bg-zinc-600"
              }`}
            >
              <div
                className={`absolute top-1 w-5 h-5 rounded-full bg-white transition ${
                  settings.showContactPublicly
                    ? "right-1"
                    : "left-1"
                }`}
              />
            </button>
          </div>
        </div>
      </motion.div>

      {/* NOTIFICATIONS */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6 space-y-6"
      >
        <div className="flex items-center gap-3">
          <Bell className="text-yellow-500" />

          <h2 className="text-2xl font-semibold text-white">
            Notifications
          </h2>
        </div>

        <div className="space-y-4">
          <ToggleCard
            title="Booking Notifications"
            description="Receive booking request alerts instantly."
            value={settings.bookingNotifications}
            onClick={() =>
              handleToggle("bookingNotifications")
            }
          />

          <ToggleCard
            title="Maintenance Alerts"
            description="Get tenant maintenance issue notifications."
            value={settings.maintenanceAlerts}
            onClick={() =>
              handleToggle("maintenanceAlerts")
            }
          />

          <ToggleCard
            title="Marketing Emails"
            description="Receive platform promotions and growth tips."
            value={settings.marketingEmails}
            onClick={() =>
              handleToggle("marketingEmails")
            }
          />
        </div>
      </motion.div>

      {/* PAYOUT & VISIBILITY */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="grid grid-cols-1 lg:grid-cols-2 gap-6"
      >
        {/* PAYOUT */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6 space-y-6">
          <div className="flex items-center gap-3">
            <Wallet className="text-green-500" />

            <h2 className="text-2xl font-semibold text-white">
              Payout Settings
            </h2>
          </div>

          <div className="space-y-2">
            <label className="text-gray-400 text-sm">
              Preferred Payout Method
            </label>

            <select
              name="payoutMethod"
              value={settings.payoutMethod}
              onChange={handleChange}
              className="w-full bg-zinc-800 border border-zinc-700 rounded-2xl p-4 text-white"
            >
              <option value="bank">
                Bank Transfer
              </option>

              <option value="upi">UPI</option>

              <option value="paypal">
                PayPal
              </option>
            </select>
          </div>
        </div>

        {/* PROPERTY VISIBILITY */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6 space-y-6">
          <div className="flex items-center gap-3">
            <Users className="text-purple-500" />

            <h2 className="text-2xl font-semibold text-white">
              Listing Visibility
            </h2>
          </div>

          <div className="space-y-2">
            <label className="text-gray-400 text-sm">
              Property Visibility
            </label>

            <select
              name="propertyVisibility"
              value={
                settings.propertyVisibility ||
                "public"
              }
              onChange={handleChange}
              className="w-full bg-zinc-800 border border-zinc-700 rounded-2xl p-4 text-white"
            >
              <option value="public">
                Public Listings
              </option>

              <option value="private">
                Private Listings
              </option>

              <option value="verified">
                Verified Users Only
              </option>
            </select>
          </div>
        </div>
      </motion.div>

      {/* SECURITY */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6 space-y-6"
      >
        <div className="flex items-center gap-3">
          <Shield className="text-green-500" />

          <h2 className="text-2xl font-semibold text-white">
            Security
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="space-y-2">
            <label className="text-gray-400 text-sm">
              Current Password
            </label>

            <div className="relative">
              <input
                type={
                  showPassword ? "text" : "password"
                }
                name="currentPassword"
                value={settings.currentPassword}
                onChange={handleChange}
                className="w-full bg-zinc-800 border border-zinc-700 rounded-2xl p-4 pr-12 text-white"
                placeholder="Enter current password"
              />

              <button
                type="button"
                onClick={() =>
                  setShowPassword(!showPassword)
                }
                className="absolute right-4 top-4 text-gray-400"
              >
                {showPassword ? (
                  <EyeOff size={18} />
                ) : (
                  <Eye size={18} />
                )}
              </button>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-gray-400 text-sm">
              New Password
            </label>

            <input
              type="password"
              name="newPassword"
              value={settings.newPassword}
              onChange={handleChange}
              className="w-full bg-zinc-800 border border-zinc-700 rounded-2xl p-4 text-white"
              placeholder="Enter new password"
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-gray-400 text-sm">
            Confirm Password
          </label>

          <input
            type="password"
            name="confirmPassword"
            value={settings.confirmPassword}
            onChange={handleChange}
            className="w-full bg-zinc-800 border border-zinc-700 rounded-2xl p-4 text-white"
            placeholder="Confirm new password"
          />
        </div>

        {/* 2FA */}
        <div className="bg-zinc-800 rounded-2xl p-5 flex items-center justify-between">
          <div>
            <h3 className="text-white font-medium flex items-center gap-2">
              <Smartphone size={18} />
              Two-Factor Authentication
            </h3>

            <p className="text-gray-400 text-sm mt-1">
              Protect your owner account with extra security.
            </p>
          </div>

          <button
            onClick={() =>
              handleToggle("twoFactorAuth")
            }
            className={`w-14 h-7 rounded-full transition relative ${
              settings.twoFactorAuth
                ? "bg-green-500"
                : "bg-zinc-600"
            }`}
          >
            <div
              className={`absolute top-1 w-5 h-5 rounded-full bg-white transition ${
                settings.twoFactorAuth
                  ? "right-1"
                  : "left-1"
              }`}
            />
          </button>
        </div>
      </motion.div>

      {/* ACTIONS */}
      <div className="flex flex-col md:flex-row gap-4">
        <button
          onClick={handleSave}
          disabled={saving}
          className="flex-1 bg-blue-600 hover:bg-blue-500 transition py-4 rounded-2xl font-semibold text-white flex items-center justify-center gap-2 disabled:opacity-50"
        >
          <Save size={18} />

          {saving
            ? "Saving Changes..."
            : "Save Owner Settings"}
        </button>

        <button className="flex-1 bg-red-600 hover:bg-red-500 transition py-4 rounded-2xl font-semibold text-white flex items-center justify-center gap-2">
          <Trash2 size={18} />
          Delete Owner Account
        </button>
      </div>
    </div>
  );
}

function ToggleCard({
  title,
  description,
  value,
  onClick,
}: {
  title: string;
  description: string;
  value: boolean;
  onClick: () => void;
}) {
  return (
    <div className="bg-zinc-800 rounded-2xl p-5 flex items-center justify-between">
      <div>
        <h3 className="text-white font-medium">
          {title}
        </h3>

        <p className="text-gray-400 text-sm mt-1">
          {description}
        </p>
      </div>

      <button
        onClick={onClick}
        className={`w-14 h-7 rounded-full transition relative ${
          value ? "bg-green-500" : "bg-zinc-600"
        }`}
      >
        <div
          className={`absolute top-1 w-5 h-5 rounded-full bg-white transition ${
            value ? "right-1" : "left-1"
          }`}
        />
      </button>
    </div>
  );
}
