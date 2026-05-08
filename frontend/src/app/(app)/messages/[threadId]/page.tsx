"use client";

import { useParams } from "next/navigation";
import { useState, useEffect } from "react";
import { ChatWindow } from "@/components/chat-window";
import type { IMessageThread, Message } from "@/types/message";

// ----------------- Types -----------------
type ViewerRole = "owner" | "user";

// ----------------- Utils -----------------
const safeToISOString = (value: unknown): string => {
  const date = new Date(value as string | number | Date);
  return isNaN(date.getTime()) ? new Date().toISOString() : date.toISOString();
};

const getToken = () => localStorage.getItem("token");

const getUserFromToken = () => {
  const token = getToken();
  if (!token) return null;

  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    return {
      email: payload.sub,
      role: payload.role,
    };
  } catch {
    return null;
  }
};

// ----------------- Component -----------------
export default function MessageThreadPage() {
  const params = useParams();

  const threadId =
    typeof params?.threadId === "string" ? params.threadId : null;

  const [thread, setThread] = useState<IMessageThread | null>(null);
  const [newMessage, setNewMessage] = useState("");

  const user = getUserFromToken();

  const currentUserId = user?.email || "";
  const currentUserName = user?.email?.split("@")[0] || "You";
  const viewerRole: ViewerRole =
    user?.role === "OWNER" ? "owner" : "user";

  // ----------------- Load Thread -----------------
  useEffect(() => {
    if (!threadId || !currentUserId) return;

    const load = async () => {
      try {
        const res = await fetch(
          `http://localhost:8080/messages/${threadId}`,
          {
            headers: {
              Authorization: `Bearer ${getToken()}`,
            },
          }
        );

        if (!res.ok) throw new Error();

        const threadData: IMessageThread = await res.json();

        // normalize timestamps
        threadData.messages = threadData.messages.map((m: Message) => ({
          ...m,
          timestamp:
            typeof m.timestamp === "string"
              ? m.timestamp
              : safeToISOString(m.timestamp),
        }));

        setThread(threadData);
      } catch {
        console.warn("⚠️ Chat service not implemented yet");
        setThread(null);
      }
    };

    load();
  }, [threadId, currentUserId]);

  // ----------------- Send Message -----------------
  const handleSendMessage = async (content: string) => {
    if (!thread) return;

    try {
      await fetch("http://localhost:8080/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${getToken()}`,
        },
        body: JSON.stringify({
          roomId: thread._id,
          content,
        }),
      });

      // Optional: refresh thread
    } catch (err) {
      console.error("❌ Failed to send message", err);
    }
  };

  // ----------------- Delete Message -----------------
  const handleDeleteMessage = (messageId: string) => {
    setThread((prev) =>
      prev
        ? {
            ...prev,
            messages: prev.messages.map((msg) =>
              msg._id === messageId ? { ...msg, isDeleted: true } : msg
            ),
          }
        : prev
    );
  };

  // ----------------- UI -----------------

  if (!threadId) {
    return (
      <div className="flex items-center justify-center h-full">
        No conversation selected
      </div>
    );
  }

  if (!thread) {
    return (
      <div className="flex items-center justify-center h-full">
        Chat not available 🚧
      </div>
    );
  }

  return (
    <div className="flex flex-col flex-1 h-[calc(100vh-4rem)]">

      {/* Header */}
      <div className="px-4 py-3 border-b">
        <h2>{thread.roomTitle || "Conversation"}</h2>
      </div>

      {/* Chat */}
      <div className="flex-1 overflow-y-auto">
        <ChatWindow
          thread={thread}
          currentUser={{
            _id: currentUserId,
            fullname: currentUserName,
            avatar: "/placeholder-user.jpg",
            role: viewerRole,
          }}
          newMessage={newMessage}
          setNewMessage={setNewMessage}
          onSendMessage={handleSendMessage}
          onDeleteMessage={handleDeleteMessage}
          typingUsers={[]}
        />
      </div>
    </div>
  );
}