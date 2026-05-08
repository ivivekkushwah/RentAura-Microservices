"use client";

import { useEffect, useState } from "react";
import {
  Building2,
  Mail,
  Phone,
  MapPin,
  Camera,
  Star,
  Home,
  Users,
  ShieldCheck,
  Save,
} from "lucide-react";
import { motion } from "framer-motion";
import api from "@/lib/api";
import { toast } from "sonner";

interface OwnerProfile {
  name: string;
  email: string;
  phone: string;
  city: string;
  bio: string;
  avatar: string;
  companyName: string;
  totalProperties: number;
  totalRooms: number;
  verified: boolean;
  rating: number;
}

export default function OwnerProfilePage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  const [profile, setProfile] = useState<OwnerProfile>({
    name: "",
    email: "",
    phone: "",
    city: "",
    bio: "",
    avatar: "",
    companyName: "",
    totalProperties: 0,
    totalRooms: 0,
    verified: false,
    rating: 0,
  });

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
  try {
    // ================= PROFILE =================
    const profileRes = await api.get("/auth/me");

    // ================= PROPERTIES =================
    const propRes = await api.get("/properties/owner");

    const properties = propRes.data || [];

    // ================= ROOMS =================
    const roomResponses = await Promise.all(
      properties.map((p: any) =>
        api.get(`/rooms/property/${p.id}`),
      ),
    );

    const rooms = roomResponses.flatMap(
      (r) => r.data,
    );

    // ================= SET PROFILE =================
    setProfile({
      name: profileRes.data.name || "",
      email: profileRes.data.email || "",
      phone: profileRes.data.phone || "",
      city: profileRes.data.city || "",
      bio: profileRes.data.bio || "",
      avatar: profileRes.data.avatar || "",

      companyName:
        profileRes.data.companyName ||
        "RentAura Properties",

      totalProperties: properties.length,

      totalRooms: rooms.length,

      verified:
        profileRes.data.verified || false,

      rating:
        profileRes.data.rating || 4.8,
    });
  } catch (error) {
    console.error(error);
    toast.error("Failed to load profile");
  } finally {
    setLoading(false);
  }
};
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;

    setProfile((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageUpload = async (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = e.target.files?.[0];

    if (!file) return;

    try {
      setUploading(true);

      const formData = new FormData();

      formData.append("file", file);
      formData.append(
        "upload_preset",
        process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || "",
      );

      const cloudName =
        process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;

      const res = await fetch(
        `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
        {
          method: "POST",
          body: formData,
        },
      );

      const data = await res.json();

      setProfile((prev) => ({
        ...prev,
        avatar: data.secure_url,
      }));

      toast.success("Profile image updated");
    } catch (error) {
      console.error(error);
      toast.error("Upload failed");
    } finally {
      setUploading(false);
    }
  };

  const handleSave = async () => {
    try {
      setSaving(true);

      const payload = {
        name: profile.name,
        phone: profile.phone,
        city: profile.city,
        bio: profile.bio,
        avatar: profile.avatar,
        companyName: profile.companyName,
      };

      await api.put("/auth/profile", payload);

      toast.success("Owner profile updated successfully");
    } catch (error) {
      console.error(error);
      toast.error("Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen text-gray-400">
        Loading owner profile...
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-8">
      {/* HEADER */}
      <div className="flex flex-col lg:flex-row gap-6">
        {/* PROFILE CARD */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="lg:w-[350px] bg-zinc-900 border border-zinc-800 rounded-3xl p-6"
        >
          <div className="flex flex-col items-center text-center">
            <div className="relative">
              <img
                src={profile.avatar || "/placeholder.webp"}
                alt="Owner"
                className="w-36 h-36 rounded-full object-cover border-4 border-zinc-700"
              />

              <label className="absolute bottom-2 right-2 bg-blue-600 hover:bg-blue-500 p-2 rounded-full cursor-pointer transition">
                <Camera size={18} className="text-white" />

                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
              </label>
            </div>

            <h1 className="text-3xl font-bold text-white mt-5">
              {profile.name || "Property Owner"}
            </h1>

            <div className="flex items-center gap-2 mt-2">
              <Building2 size={18} className="text-blue-500" />

              <p className="text-gray-400">
                {profile.companyName}
              </p>
            </div>

            <div className="flex items-center gap-2 mt-3">
              <Star className="text-yellow-400 fill-yellow-400" size={18} />

              <span className="text-white font-medium">
                {profile.rating}
              </span>
            </div>

            {profile.verified && (
              <div className="mt-4 flex items-center gap-2 bg-green-500/10 border border-green-500/30 px-4 py-2 rounded-full text-green-400 text-sm">
                <ShieldCheck size={16} />
                Verified Owner
              </div>
            )}
          </div>

          {/* STATS */}
          <div className="grid grid-cols-2 gap-4 mt-8">
            <div className="bg-zinc-800 rounded-2xl p-4 text-center">
              <Home className="mx-auto text-blue-500 mb-2" />

              <h3 className="text-2xl font-bold text-white">
                {profile.totalProperties}
              </h3>

              <p className="text-gray-400 text-sm">
                Properties
              </p>
            </div>

            <div className="bg-zinc-800 rounded-2xl p-4 text-center">
              <Users className="mx-auto text-purple-500 mb-2" />

              <h3 className="text-2xl font-bold text-white">
                {profile.totalRooms}
              </h3>

              <p className="text-gray-400 text-sm">Rooms</p>
            </div>
          </div>
        </motion.div>

        {/* FORM SECTION */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="flex-1 bg-zinc-900 border border-zinc-800 rounded-3xl p-8 space-y-8"
        >
          <div>
            <h2 className="text-3xl font-bold text-white">
              Owner Profile
            </h2>

            <p className="text-gray-400 mt-2">
              Manage your public owner information and property business details.
            </p>
          </div>

          {/* BASIC INFO */}
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-gray-400 text-sm">
                  Full Name
                </label>

                <div className="relative">
                  <UserInputIcon />

                  <input
                    type="text"
                    name="name"
                    value={profile.name}
                    onChange={handleChange}
                    placeholder="Enter owner name"
                    className="w-full bg-zinc-800 border border-zinc-700 rounded-2xl pl-12 pr-4 py-4 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-gray-400 text-sm">
                  Business Name
                </label>

                <div className="relative">
                  <Building2 className="absolute left-4 top-4 text-gray-500" size={20} />

                  <input
                    type="text"
                    name="companyName"
                    value={profile.companyName}
                    onChange={handleChange}
                    placeholder="Enter business name"
                    className="w-full bg-zinc-800 border border-zinc-700 rounded-2xl pl-12 pr-4 py-4 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-gray-400 text-sm">
                  Email Address
                </label>

                <div className="relative">
                  <Mail className="absolute left-4 top-4 text-gray-500" size={20} />

                  <input
                    type="email"
                    value={profile.email}
                    disabled
                    className="w-full bg-zinc-800 border border-zinc-700 rounded-2xl pl-12 pr-4 py-4 text-gray-400 cursor-not-allowed"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-gray-400 text-sm">
                  Phone Number
                </label>

                <div className="relative">
                  <Phone className="absolute left-4 top-4 text-gray-500" size={20} />

                  <input
                    type="text"
                    name="phone"
                    value={profile.phone}
                    onChange={handleChange}
                    placeholder="Enter phone number"
                    className="w-full bg-zinc-800 border border-zinc-700 rounded-2xl pl-12 pr-4 py-4 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-gray-400 text-sm">
                City
              </label>

              <div className="relative">
                <MapPin className="absolute left-4 top-4 text-gray-500" size={20} />

                <input
                  type="text"
                  name="city"
                  value={profile.city}
                  onChange={handleChange}
                  placeholder="Enter city"
                  className="w-full bg-zinc-800 border border-zinc-700 rounded-2xl pl-12 pr-4 py-4 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-gray-400 text-sm">
                About Your Business
              </label>

              <textarea
                name="bio"
                value={profile.bio}
                onChange={handleChange}
                rows={6}
                placeholder="Tell tenants about your properties and services..."
                className="w-full bg-zinc-800 border border-zinc-700 rounded-2xl p-4 text-white resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* SAVE BUTTON */}
          <button
            onClick={handleSave}
            disabled={saving || uploading}
            className="w-full bg-blue-600 hover:bg-blue-500 transition py-4 rounded-2xl text-white font-semibold flex items-center justify-center gap-3 disabled:opacity-50"
          >
            <Save size={20} />

            {saving
              ? "Saving Changes..."
              : uploading
                ? "Uploading Image..."
                : "Save Owner Profile"}
          </button>
        </motion.div>
      </div>
    </div>
  );
}

function UserInputIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="absolute left-4 top-4 text-gray-500"
      width="20"
      height="20"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M5.121 17.804A9 9 0 1118.364 4.56M15 11a3 3 0 11-6 0 3 3 0 016 0zm-3 6c-2.21 0-4 1.343-4 3h8c0-1.657-1.79-3-4-3z"
      />
    </svg>
  );
}
