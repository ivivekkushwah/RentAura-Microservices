"use client";

import { useEffect, useState } from "react";
import { ChatSidebar } from "@/components/chat-sidebar";
import type { IMessageThread } from "@/types/message";
import { useParams, useRouter } from "next/navigation";
import { MessageCircle, X } from "lucide-react";

// ------------------------------------
// Types
// ------------------------------------
interface IMessageParticipant {
  id?: string;
  fullname?: string;
  avatar?: string;
}

interface RawThread {
  _id?: string;
  id?: string;
  ownerId: string;
  userId: string;
  roomId?: string;
  roomTitle?: string;
  messages: IMessageThread["messages"];
  unreadByOwner?: number;
  unreadByUser?: number;
  unreadCount?: number;
  participants?: IMessageParticipant[];
  owner?: { fullname?: string; avatar?: string };
  user?: { fullname?: string; avatar?: string };
}

interface Props {
  children: React.ReactNode;
}

// ------------------------------------
// ✅ FIXED MESSAGES LAYOUT
// ------------------------------------
export default function MessagesLayout({ children }: Props) {
  const router = useRouter();
  const params = useParams();

  const [threads, setThreads] = useState<IMessageThread[]>([]);
  const [currentUserId, setCurrentUserId] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // 🔥 JWT HELPERS
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

  // ✅ ACTIVE THREAD
  const activeThreadId =
    params && typeof params.threadId === "string"
      ? params.threadId
      : null;

  // ✅ SET CURRENT USER
  useEffect(() => {
    const user = getUserFromToken();
    setCurrentUserId(user?.email || "");
  }, []);

  // ✅ FETCH THREADS (SAFE)
  useEffect(() => {
    if (!currentUserId) return;

    const loadThreads = async () => {
      try {
        const token = getToken();

        // ⚠️ If backend not ready, don't crash
        const res = await fetch("http://localhost:8080/messages", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) {
          console.warn("⚠️ Messages API not available yet");
          setThreads([]);
          return;
        }

        const data: RawThread[] = await res.json();

        const formatted: IMessageThread[] = data.map((t) => {
          const lastMsg = t.messages?.[t.messages.length - 1];

          return {
            _id: t._id || t.id || "",
            threadKey: t._id || t.id || "",
            title: t.roomTitle || "Chat",
            roomName: t.roomTitle || "",
            ownerId: t.ownerId,
            userId: t.userId,
            roomId: t.roomId || "",
            messages: t.messages,
            unreadByOwner: t.unreadByOwner ?? 0,
            unreadByUser: t.unreadByUser ?? 0,
            unreadCount: t.unreadCount ?? 0,
            lastMessageAt: lastMsg
              ? new Date(lastMsg.timestamp)
              : new Date(),
            owner: {
              id: t.ownerId,
              fullname: t.owner?.fullname || "Owner",
              avatar: t.owner?.avatar || "",
            },
            user: {
              id: t.userId,
              fullname: t.user?.fullname || "User",
              avatar: t.user?.avatar || "",
            },
            participants: t.participants ?? [],
          };
        });

        setThreads(formatted);
      } catch (err) {
        console.warn("⚠️ Chat service not implemented yet");
        setThreads([]);
      }
    };

    loadThreads();
  }, [currentUserId]);

  const handleClearUnread = (threadId: string) => {
    setThreads((prev) =>
      prev.map((t) =>
        String(t._id) === String(threadId)
          ? { ...t, unreadCount: 0 }
          : t
      )
    );
  };

  // ------------------------------------
  // UI
  // ------------------------------------
  return (
    <div className="flex h-[calc(100vh-64px)] bg-background overflow-hidden">

      {/* Desktop Sidebar */}
      <aside className="hidden md:flex w-80 border-r">
        <ChatSidebar
          threads={threads}
          activeThreadId={activeThreadId}
          currentUserId={currentUserId}
          onThreadSelect={(id) => router.push(`/messages/${id}`)}
          onClearUnread={handleClearUnread}
        />
      </aside>

      {/* Mobile Sidebar */}
      <div
        className={`fixed inset-0 z-40 md:hidden ${
          sidebarOpen ? "block" : "hidden"
        }`}
      >
        <div
          className="absolute inset-0 bg-black/40"
          onClick={() => setSidebarOpen(false)}
        />

        <div className="absolute left-0 top-0 bottom-0 w-80 bg-card">
          <div className="p-3 flex justify-between border-b">
            <h2>Messages</h2>
            <button onClick={() => setSidebarOpen(false)}>
              <X />
            </button>
          </div>

          <ChatSidebar
            threads={threads}
            activeThreadId={activeThreadId}
            currentUserId={currentUserId}
            onThreadSelect={(id) => router.push(`/messages/${id}`)}
            onClearUnread={handleClearUnread}
          />
        </div>
      </div>

      {/* Main */}
      <main className="flex flex-1 flex-col">
        <div className="md:hidden flex justify-between p-2 border-b">
          <button onClick={() => setSidebarOpen(true)}>
            <MessageCircle />
          </button>
          <span>Messages</span>
        </div>

        <div className="flex-1">
          {children || (
            <div className="flex flex-col items-center justify-center h-full">
              <MessageCircle className="h-12 w-12" />
              <p>Select a conversation</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}