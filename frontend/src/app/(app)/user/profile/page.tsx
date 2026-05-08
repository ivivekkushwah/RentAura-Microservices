"use client";

import { useEffect, useState } from "react";
import api from "@/lib/api";
import { toast } from "sonner";

interface UserProfile {
  fullname?: string;
  email: string;
  phone?: string;
  city?: string;
  bio?: string;
  profileImage?: string;
}

export default function UserProfilePage() {
  const [user, setUser] = useState<UserProfile>({
    fullname: "",
    email: "",
    phone: "",
    city: "",
    bio: "",
    profileImage: "",
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  // ================= FETCH USER =================
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await api.get("/auth/me");
        console.log(res.data);
        setUser({
          fullname: res.data.name || "",
          email: res.data.email || "",
          phone: res.data.phone || "",
          city: res.data.city || "",
          bio: res.data.bio || "",
          profileImage: res.data.avatar || "",
        });
      } catch (err) {
        console.error(err);
        toast.error("Failed to load profile");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  // ================= INPUT CHANGE =================
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;

    setUser((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // ================= IMAGE UPLOAD =================
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
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

      const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;

      const res = await fetch(
        `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
        {
          method: "POST",
          body: formData,
        },
      );

      const data = await res.json();

      setUser((prev) => ({
        ...prev,
        profileImage: data.secure_url,
      }));

      toast.success("Image uploaded");
    } catch (err) {
      console.error(err);
      toast.error("Upload failed");
    } finally {
      setUploading(false);
    }
  };

  // ================= SAVE PROFILE =================
  const handleSave = async () => {
    try {
      setSaving(true);

      const payload = {
        name: user.fullname?.trim() || undefined,
        phone: user.phone?.trim() || undefined,
        city: user.city?.trim() || undefined,
        bio: user.bio?.trim() || undefined,
        avatar: user.profileImage?.trim() || undefined,
      };

      await api.put("/auth/profile", payload);

      toast.success("Profile updated");
    } catch (err) {
      console.error(err);
      toast.error("Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  // ================= LOADING =================
  if (loading) {
    return (
      <div className="p-6 text-center text-gray-400">Loading profile...</div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto p-6 space-y-6">
      {/* HEADER */}
      <div>
        <h1 className="text-3xl font-bold">My Profile</h1>

        <p className="text-gray-400 mt-1">Manage your account details</p>
      </div>

      {/* PROFILE CARD */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 space-y-6">
        {/* IMAGE */}
        <div className="flex flex-col items-center gap-4">
          <div className="w-32 h-32 rounded-full overflow-hidden border border-zinc-700 bg-zinc-800 flex items-center justify-center">
            <img
              src={user.profileImage || "/placeholder.webp"}
              alt="Profile"
              className="w-full h-full object-cover"
            />
          </div>

          <label className="bg-blue-600 hover:bg-blue-500 px-4 py-2 rounded cursor-pointer text-sm">
            {uploading ? "Uploading..." : "Change Photo"}

            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
            />
          </label>
        </div>

        {/* FORM */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* FULLNAME */}
          <div className="space-y-2">
            <label className="text-sm text-gray-400">Full Name</label>

            <input
              type="text"
              name="fullname"
              value={user.fullname}
              onChange={handleChange}
              placeholder="Enter full name"
              className="w-full bg-zinc-800 border border-zinc-700 rounded-xl p-3"
            />
          </div>

          {/* EMAIL */}
          <div className="space-y-2">
            <label className="text-sm text-gray-400">Email</label>

            <input
              type="email"
              value={user.email}
              disabled
              className="w-full bg-zinc-800 border border-zinc-700 rounded-xl p-3 opacity-70 cursor-not-allowed"
            />
          </div>

          {/* PHONE */}
          <div className="space-y-2">
            <label className="text-sm text-gray-400">Phone</label>

            <input
              type="text"
              name="phone"
              value={user.phone}
              onChange={handleChange}
              placeholder="Enter phone"
              className="w-full bg-zinc-800 border border-zinc-700 rounded-xl p-3"
            />
          </div>

          {/* CITY */}
          <div className="space-y-2">
            <label className="text-sm text-gray-400">City</label>

            <input
              type="text"
              name="city"
              value={user.city}
              onChange={handleChange}
              placeholder="Enter city"
              className="w-full bg-zinc-800 border border-zinc-700 rounded-xl p-3"
            />
          </div>
        </div>

        {/* BIO */}
        <div className="space-y-2">
          <label className="text-sm text-gray-400">Bio</label>

          <textarea
            name="bio"
            value={user.bio}
            onChange={handleChange}
            rows={5}
            placeholder="Tell something about yourself"
            className="w-full bg-zinc-800 border border-zinc-700 rounded-xl p-3 resize-none"
          />
        </div>

        {/* BUTTON */}
        <button
          onClick={handleSave}
          disabled={saving}
          className="w-full bg-green-600 hover:bg-green-500 py-3 rounded-xl font-medium disabled:opacity-50"
        >
          {saving ? "Saving..." : "Save Changes"}
        </button>
      </div>
    </div>
  );
}
