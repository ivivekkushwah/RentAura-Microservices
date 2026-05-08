"use client";

import {
  useState,
  useMemo,
  useCallback,
  ChangeEvent,
  KeyboardEvent,
} from "react";
import { cn } from "@/lib/utils";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { Search, MessageCircle } from "lucide-react";
import type { IMessageThread } from "@/types/message";
import { motion } from "framer-motion";

// ✅ UPDATED PROPS (onClearUnread added)
interface ChatSidebarProps {
  threads: IMessageThread[];
  activeThreadId: string | null;
  currentUserId: string;
  onThreadSelect: (threadId: string) => void;
  onClearUnread: (threadId: string) => void; // ✅ NEW
}

export function ChatSidebar({
  threads,
  activeThreadId,
  currentUserId,
  onThreadSelect,
  onClearUnread, // ✅ NEW
}: ChatSidebarProps) {
  const [searchQuery, setSearchQuery] = useState("");

  const getOtherParticipant = useCallback(
    (t: IMessageThread) => {
      const isOwner = String(t.owner?.id) === String(currentUserId);
      return isOwner ? t.user : t.owner;
    },
    [currentUserId]
  );

  const getInitials = (name: string) =>
    name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .substring(0, 2)
      .toUpperCase();

  // ✅ Search filter
  const filteredThreads = useMemo(() => {
    return threads.filter((t) => {
      const other = getOtherParticipant(t);
      const name = other?.fullname || "Unknown";
      const title = t.roomTitle || "";
      return (name + " " + title)
        .toLowerCase()
        .includes(searchQuery.toLowerCase());
    });
  }, [threads, searchQuery, getOtherParticipant]);

  // ✅ Format timestamp
  const formatTime = (dateLike?: Date | string) => {
    if (!dateLike) return "";
    const date = new Date(dateLike);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const days = diff / 86400000;

    if (days < 1)
      return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    if (days < 2) return "Yesterday";
    if (days < 7) return date.toLocaleDateString([], { weekday: "short" });
    return date.toLocaleDateString([], { month: "short", day: "numeric" });
  };

  // ✅ Last message preview
  const getLastMessage = (t: IMessageThread) => {
    if (!t.messages?.length) return "No messages yet";

    const last = t.messages[t.messages.length - 1];
    const prefix =
      String(last.senderId) === String(currentUserId) ? "You: " : "";
    const msg =
      last.content?.length > 50
        ? last.content.slice(0, 50) + "..."
        : last.content;

    return prefix + (msg ?? "");
  };

  const handleSearchChange = (e: ChangeEvent<HTMLInputElement>) =>
    setSearchQuery(e.target.value);

  const handleKeyDown = (
    e: KeyboardEvent<HTMLDivElement>,
    threadId: string
  ) => {
    if (e.key === "Enter") {
      onClearUnread(threadId); // ✅ Clear unread on keyboard open too
      onThreadSelect(threadId);
    }
  };

  return (
    <div className="w-80 border-r border-border bg-background flex flex-col h-full shadow-xl">
      {/* ================= HEADER ================= */}
      <div className="p-4 border-b border-border bg-card/80 backdrop-blur sticky top-0 z-10">
        <div className="flex items-center gap-2 mb-4">
          <MessageCircle className="h-6 w-6 text-primary" />
          <h1 className="text-xl font-semibold text-foreground">
            Messages
          </h1>
        </div>

        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search..."
            value={searchQuery}
            onChange={handleSearchChange}
            className="pl-10 rounded-full bg-muted/40 border-muted focus:ring-2 focus:ring-primary"
          />
        </div>
      </div>

      {/* ================= THREAD LIST ================= */}
      <ScrollArea className="flex-1">
        <div className="p-2 space-y-1">
          {filteredThreads.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <MessageCircle className="h-12 w-12 mx-auto mb-3 opacity-30" />
              <p className="text-sm">No conversations found</p>
            </div>
          ) : (
            filteredThreads.map((t) => {
              const other = getOtherParticipant(t);
              const name = other?.fullname || "Unknown User";
              const avatar = other?.avatar;
              const isOwner = String(t.owner?.id) === String(currentUserId);
              const unread = isOwner ? t.unreadByOwner : t.unreadByUser;
              const threadId = String(t._id);

              return (
                <motion.div
                  key={threadId}
                  role="button"
                  tabIndex={0}
                  onClick={() => {
                    onClearUnread(threadId);   // ✅ INSTANT BADGE CLEAR
                    onThreadSelect(threadId); // ✅ OPEN CHAT
                  }}
                  onKeyDown={(e) => handleKeyDown(e, threadId)}
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.15 }}
                  className={cn(
                    "flex items-center gap-3 p-3 rounded-xl cursor-pointer select-none",
                    "hover:bg-accent/70 transition-all duration-200 active:scale-[0.98]",
                    activeThreadId === threadId &&
                      "bg-accent text-accent-foreground shadow-inner"
                  )}
                >
                  {/* Avatar */}
                  <Avatar className="h-12 w-12">
                    {avatar ? (
                      <AvatarImage src={avatar} alt={name} />
                    ) : (
                      <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                        {getInitials(name)}
                      </AvatarFallback>
                    )}
                  </Avatar>

                  {/* Name + Last Message */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-0.5">
                      <h3 className="font-medium text-sm truncate">
                        {name}
                      </h3>
                      <span className="text-xs text-muted-foreground">
                        {formatTime(t.lastMessageAt)}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground truncate">
                      {getLastMessage(t)}
                    </p>
                  </div>

                  {/* ✅ UNREAD BADGE */}
                  {unread > 0 && (
                    <Badge
                      variant="secondary"
                      className="h-5 min-w-5 text-xs px-1.5 flex items-center justify-center rounded-full bg-primary text-primary-foreground shadow"
                    >
                      {unread > 99 ? "99+" : unread}
                    </Badge>
                  )}
                </motion.div>
              );
            })
          )}
        </div>
      </ScrollArea>
    </div>
  );
}
