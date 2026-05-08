"use client"

import {
  useRef,
  useEffect,
  useState,
  type ChangeEvent,
  type KeyboardEvent,
} from "react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu"
import {
  Send,
  MoreVertical,
  Reply,
  Trash2,
  X,
  Crown,
  Settings,
  Phone,
  Video,
  Search,
} from "lucide-react"
import type { Message, IMessageThread, User } from "@/types/message"

interface ChatWindowProps {
  thread: IMessageThread
  currentUser?: User | null
  newMessage: string
  setNewMessage: (msg: string) => void
  onSendMessage: (content: string, replyTo?: string, tempId?: string) => void
  onDeleteMessage: (messageId: string) => void
  typingUsers: { userId: string; userName: string }[]
}

export function ChatWindow({
  thread,
  currentUser,
  newMessage,
  setNewMessage,
  onSendMessage,
  onDeleteMessage,
  typingUsers,
}: ChatWindowProps) {
  const [replyingTo, setReplyingTo] = useState<Message | null>(null)
  const bottomRef = useRef<HTMLDivElement>(null)
  const isOwner = currentUser?.role === "owner"

  // Auto scroll
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [thread.messages])

  const handleSend = () => {
    if (!newMessage.trim()) return
    const tempId = crypto.randomUUID()
    onSendMessage(newMessage.trim(), replyingTo?._id, tempId)
    setNewMessage("")
    setReplyingTo(null)
  }

  const handleKey = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const formatTime = (val: string | Date) =>
    new Date(val).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })

  const formatDate = (val: string | Date) =>
    new Date(val).toLocaleDateString([], {
      month: "short",
      day: "numeric",
      year: "numeric",
    })

  // Group messages by day
  const groupByDate = () => {
    const groups: Record<string, Message[]> = {}

    thread.messages.forEach((msg) => {
      const date = new Date(msg.timestamp)
      if (isNaN(date.getTime())) return

      const key = date.toDateString()
      if (!groups[key]) groups[key] = []
      groups[key].push({ ...msg, timestamp: date.toISOString() })
    })

    return Object.entries(groups).map(([dateKey, msgs]) => ({
      date: new Date(dateKey),
      messages: msgs.sort(
        (a, b) =>
          new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
      ),
    }))
  }

  const groupedMessages = groupByDate()
  const otherAvatar = thread.user?.avatar

  return (
    <div className="flex flex-col h-full bg-background">
      {/* HEADER */}
      <div className="flex items-center justify-between p-4 border-b border-border bg-card/60 backdrop-blur-sm">
        <div className="flex items-center gap-3 min-w-0 flex-1">
          <div className="relative">
            <Avatar className="h-12 w-12">
              {otherAvatar ? (
                <AvatarImage src={otherAvatar} />
              ) : (
                <AvatarFallback className="uppercase">
                  {thread.user?.fullname?.[0] ?? "U"}
                </AvatarFallback>
              )}
            </Avatar>
            <span className="absolute -bottom-1 -right-1 h-3.5 w-3.5 rounded-full border-2 border-background bg-green-500" />
          </div>

          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <h2 className="font-semibold text-base truncate">
                {thread.title}
              </h2>

              {isOwner && (
                <Badge
                  variant="secondary"
                  className="text-[10px] px-1.5 flex items-center gap-1"
                >
                  <Crown className="h-3 w-3" /> Owner
                </Badge>
              )}
            </div>

            <p className="text-xs text-muted-foreground truncate">
              {thread.user?.fullname}
            </p>
          </div>
        </div>

        {/* HEADER ACTION BUTTONS */}
        <div className="flex items-center gap-1 sm:gap-2">
          <Button variant="ghost" size="icon">
            <Search className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" className="hidden sm:flex">
            <Phone className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" className="hidden sm:flex">
            <Video className="h-4 w-4" />
          </Button>
          {isOwner && (
            <Button variant="ghost" size="icon">
              <Settings className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>

      {/* MESSAGES LIST */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-8">
        {groupedMessages.map((group, idx) => (
          <div key={`${group.date}-${idx}`}>
            <div className="flex justify-center mb-3">
              <Badge variant="outline" className="text-[10px] py-0.5">
                {formatDate(group.date)}
              </Badge>
            </div>

            <div className="space-y-4">
              {group.messages.map((msg) => {
                const isOwn = msg.senderId === currentUser?._id
                const replied =
                  msg.replyTo &&
                  thread.messages.find((m) => m._id === msg.replyTo)

                return (
                  <div
                    key={msg._id}
                    className={cn(
                      "flex gap-2 group",
                      isOwn ? "justify-end" : "justify-start"
                    )}
                  >
                    {/* Avatar for other user */}
                    {!isOwn && (
                      <Avatar className="h-8 w-8 mt-auto">
                        {otherAvatar ? (
                          <AvatarImage src={otherAvatar} />
                        ) : (
                          <AvatarFallback>
                            {thread.user?.fullname?.[0]}
                          </AvatarFallback>
                        )}
                      </Avatar>
                    )}

                    {/* MESSAGE BUBBLE */}
                    <div
                      className={cn(
                        "relative p-3 rounded-xl text-sm max-w-[75%] sm:max-w-[65%] shadow-sm transition-colors",
                        isOwn
                          ? "bg-primary text-primary-foreground ml-auto"
                          : "bg-card border border-border"
                      )}
                    >
                      {/* Replied message preview */}
                      {replied && (
                        <div className="mb-2 text-xs border-l-2 border-muted-foreground/40 pl-2 opacity-75">
                          <strong>{replied.senderName}:</strong>{" "}
                          {replied.content.slice(0, 40)}
                          {replied.content.length > 40 && "..."}
                        </div>
                      )}

                      {/* Main content */}
                      <p
                        className={msg.isDeleted ? "italic opacity-60" : ""}
                      >
                        {msg.isDeleted ? "Message deleted" : msg.content}
                      </p>

                      {/* Time */}
                      <span className="block text-[10px] mt-1 opacity-70">
                        {formatTime(msg.timestamp)}
                      </span>

                      {/* OPTIONS MENU */}
                      {!msg.isDeleted && (
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant="secondary"
                              size="icon"
                              className={cn(
                                "absolute -top-2 right-2 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity",
                                isOwn
                                  ? "bg-primary-foreground/20"
                                  : "bg-muted"
                              )}
                            >
                              <MoreVertical className="h-3 w-3" />
                            </Button>
                          </DropdownMenuTrigger>

                          <DropdownMenuContent align="end">
                            <DropdownMenuItem
                              onClick={() => setReplyingTo(msg)}
                            >
                              <Reply className="h-3 w-3 mr-2" /> Reply
                            </DropdownMenuItem>

                            {(isOwn || isOwner) && (
                              <DropdownMenuItem
                                className="text-destructive"
                                onClick={() => onDeleteMessage(msg._id)}
                              >
                                <Trash2 className="h-3 w-3 mr-2" /> Delete
                              </DropdownMenuItem>
                            )}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        ))}

        <div ref={bottomRef} />
      </div>

      {/* TYPING INDICATOR */}
      {typingUsers.length > 0 && (
        <div className="px-4 pb-2 text-xs opacity-70 text-muted-foreground">
          {typingUsers.map((t) => t.userName).join(", ")} typing...
        </div>
      )}

      {/* REPLY BANNER */}
      {replyingTo && (
        <div className="px-4 py-2 bg-muted border-t border-border flex justify-between items-center">
          <div className="text-xs truncate">
            Replying to <strong>{replyingTo.senderName}</strong>:{" "}
            {replyingTo.content.slice(0, 40)}
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setReplyingTo(null)}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      )}

      {/* INPUT AREA */}
      <div className="p-4 border-t border-border bg-card">
        <div className="flex items-center gap-3">
          <Input
            placeholder="Type a message..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyDown={handleKey}
            className="flex-1"
          />

          <Button
            size="icon"
            onClick={handleSend}
            disabled={!newMessage.trim()}
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}
