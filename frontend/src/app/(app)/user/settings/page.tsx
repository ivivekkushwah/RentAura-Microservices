"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  Bell,
  Shield,
  User,
  Lock,
  Smartphone,
  Save,
  Trash2,
  Eye,
  EyeOff,
} from "lucide-react";
import { useTheme } from "next-themes";
import api from "@/lib/api";
import { toast } from "sonner";

export default function SettingsPage() {
  const { theme, setTheme } = useTheme();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const [settings, setSettings] = useState({
    emailNotifications: true,
    pushNotifications: false,
    roommateSuggestions: true,
    profileVisibility: "public",
    twoFactorAuth: false,
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const res = await api.get("/auth/settings");

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
        emailNotifications: settings.emailNotifications,
        pushNotifications: settings.pushNotifications,
        roommateSuggestions: settings.roommateSuggestions,
        profileVisibility: settings.profileVisibility,
        twoFactorAuth: settings.twoFactorAuth,
      };

      if (
        settings.currentPassword &&
        settings.newPassword
      ) {
        payload.currentPassword = settings.currentPassword;
        payload.newPassword = settings.newPassword;
      }

      await api.put("/auth/settings", payload);

      toast.success("Settings updated successfully");

      setSettings((prev) => ({
        ...prev,
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      }));
    } catch (error: any) {
      console.error(error);

      toast.error(
        error?.response?.data || "Failed to update settings",
      );
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen text-gray-400">
        Loading settings...
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto p-6 space-y-8">
      {/* HEADER */}
      <div>
        <h1 className="text-4xl font-bold text-white">Settings</h1>

        <p className="text-gray-400 mt-2">
          Manage your account preferences and security.
        </p>
      </div>

      {/* ACCOUNT SETTINGS */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6 space-y-6"
      >
        <div className="flex items-center gap-3">
          <User className="text-blue-500" />

          <h2 className="text-2xl font-semibold text-white">
            Account Preferences
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
                Enable dark appearance across the app.
              </p>
            </div>

            <button
              onClick={() =>
                setTheme(
                  theme === "dark" ? "light" : "dark",
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

          {/* ROOMMATE */}
          <div className="bg-zinc-800 rounded-2xl p-5 flex items-center justify-between">
            <div>
              <h3 className="text-white font-medium">
                Roommate Suggestions
              </h3>

              <p className="text-gray-400 text-sm mt-1">
                Get AI-based roommate recommendations.
              </p>
            </div>

            <button
              onClick={() =>
                handleToggle("roommateSuggestions")
              }
              className={`w-14 h-7 rounded-full transition relative ${
                settings.roommateSuggestions
                  ? "bg-green-500"
                  : "bg-zinc-600"
              }`}
            >
              <div
                className={`absolute top-1 w-5 h-5 rounded-full bg-white transition ${
                  settings.roommateSuggestions
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
          {/* EMAIL */}
          <div className="bg-zinc-800 rounded-2xl p-5 flex items-center justify-between">
            <div>
              <h3 className="text-white font-medium">
                Email Notifications
              </h3>

              <p className="text-gray-400 text-sm mt-1">
                Receive booking and property updates by
                email.
              </p>
            </div>

            <button
              onClick={() =>
                handleToggle("emailNotifications")
              }
              className={`w-14 h-7 rounded-full transition relative ${
                settings.emailNotifications
                  ? "bg-green-500"
                  : "bg-zinc-600"
              }`}
            >
              <div
                className={`absolute top-1 w-5 h-5 rounded-full bg-white transition ${
                  settings.emailNotifications
                    ? "right-1"
                    : "left-1"
                }`}
              />
            </button>
          </div>

          {/* PUSH */}
          <div className="bg-zinc-800 rounded-2xl p-5 flex items-center justify-between">
            <div>
              <h3 className="text-white font-medium">
                Push Notifications
              </h3>

              <p className="text-gray-400 text-sm mt-1">
                Receive instant alerts on your device.
              </p>
            </div>

            <button
              onClick={() =>
                handleToggle("pushNotifications")
              }
              className={`w-14 h-7 rounded-full transition relative ${
                settings.pushNotifications
                  ? "bg-green-500"
                  : "bg-zinc-600"
              }`}
            >
              <div
                className={`absolute top-1 w-5 h-5 rounded-full bg-white transition ${
                  settings.pushNotifications
                    ? "right-1"
                    : "left-1"
                }`}
              />
            </button>
          </div>
        </div>
      </motion.div>

      {/* SECURITY */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6 space-y-6"
      >
        <div className="flex items-center gap-3">
          <Shield className="text-green-500" />

          <h2 className="text-2xl font-semibold text-white">
            Security
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* CURRENT PASSWORD */}
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
                className="w-full bg-zinc-800 border border-zinc-700 rounded-xl p-3 pr-12 text-white"
                placeholder="Enter current password"
              />

              <button
                type="button"
                onClick={() =>
                  setShowPassword(!showPassword)
                }
                className="absolute right-4 top-3 text-gray-400"
              >
                {showPassword ? (
                  <EyeOff size={18} />
                ) : (
                  <Eye size={18} />
                )}
              </button>
            </div>
          </div>

          {/* NEW PASSWORD */}
          <div className="space-y-2">
            <label className="text-gray-400 text-sm">
              New Password
            </label>

            <input
              type="password"
              name="newPassword"
              value={settings.newPassword}
              onChange={handleChange}
              className="w-full bg-zinc-800 border border-zinc-700 rounded-xl p-3 text-white"
              placeholder="Enter new password"
            />
          </div>

          {/* CONFIRM PASSWORD */}
          <div className="space-y-2 md:col-span-2">
            <label className="text-gray-400 text-sm">
              Confirm Password
            </label>

            <input
              type="password"
              name="confirmPassword"
              value={settings.confirmPassword}
              onChange={handleChange}
              className="w-full bg-zinc-800 border border-zinc-700 rounded-xl p-3 text-white"
              placeholder="Confirm new password"
            />
          </div>
        </div>

        {/* 2FA */}
        <div className="bg-zinc-800 rounded-2xl p-5 flex items-center justify-between">
          <div>
            <h3 className="text-white font-medium flex items-center gap-2">
              <Smartphone size={18} />
              Two-Factor Authentication
            </h3>

            <p className="text-gray-400 text-sm mt-1">
              Add extra security to your account.
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

      {/* PRIVACY */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6 space-y-6"
      >
        <div className="flex items-center gap-3">
          <Lock className="text-purple-500" />

          <h2 className="text-2xl font-semibold text-white">
            Privacy
          </h2>
        </div>

        <div className="space-y-2">
          <label className="text-gray-400 text-sm">
            Profile Visibility
          </label>

          <select
            name="profileVisibility"
            value={
              settings.profileVisibility || "public"
            }
            onChange={handleChange}
            className="w-full bg-zinc-800 border border-zinc-700 rounded-xl p-3 text-white"
          >
            <option value="public">Public</option>

            <option value="private">Private</option>

            <option value="contacts">
              Contacts Only
            </option>
          </select>
        </div>
      </motion.div>

      {/* BUTTONS */}
      <div className="flex flex-col md:flex-row gap-4">
        <button
          onClick={handleSave}
          disabled={saving}
          className="flex-1 bg-green-600 hover:bg-green-500 transition py-4 rounded-2xl font-semibold text-white flex items-center justify-center gap-2 disabled:opacity-50"
        >
          <Save size={18} />

          {saving ? "Saving..." : "Save Settings"}
        </button>

        <button className="flex-1 bg-red-600 hover:bg-red-500 transition py-4 rounded-2xl font-semibold text-white flex items-center justify-center gap-2">
          <Trash2 size={18} />

          Delete Account
        </button>
      </div>
    </div>
  );
}