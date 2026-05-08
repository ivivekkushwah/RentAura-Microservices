"use client";

import { useEffect, useState } from "react";
import ChatBot from "@/components/ChatBot";

// 🔥 JWT helper
const getUserFromToken = () => {
  const token = localStorage.getItem("token");
  if (!token) return null;

  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    return {
      role: payload.role?.toLowerCase() as "user" | "owner",
    };
  } catch {
    return null;
  }
};

export default function ClientChatBot() {
  const [role, setRole] = useState<"user" | "owner" | undefined>(undefined);

  useEffect(() => {
    const user = getUserFromToken();
    setRole(user?.role);
  }, []);

  return <ChatBot role={role} />;
}