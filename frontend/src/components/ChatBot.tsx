"use client";
import React, { useState, useRef } from "react";

type Message = {
  id: string;
  who: "user" | "bot";
  text: string;
  time?: number;
  removable?: boolean;
};

const USER_PRESET_MESSAGES = [
  "How do I book a room?",
  "What documents are required?",
  "Show rooms under ₹6000",
  "Is there any curfew?",
  "Is food included?",
];

const OWNER_PRESET_MESSAGES = [
  "How do I add a room?",
  "How can I delete my listing?",
  "How do I update room price?",
  "How to manage bookings?",
  "How do I verify my owner account?",
];

export default function ChatBot({
  role,
}: {
  role?: "user" | "owner";
}) {
  const [open, setOpen] = useState(false);
  const [showPresets, setShowPresets] = useState(true); // ✅ NEW
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "bot-1",
      who: "bot",
      text: "Hi! I'm your RentAura Assistant 👋",
      time: Date.now(),
      removable: true,
    },
  ]);

  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const scrollRef = useRef<HTMLDivElement | null>(null);

  const append = (m: Message) => setMessages((s) => [...s, m]);

  const sendToServer = async (text: string) => {
    setSending(true);
    try {
      const res = await fetch("/api/chatbot", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: text, role }),
      });

      const data = await res.json();
      const reply = data?.reply ?? "Sorry, I couldn't respond right now.";

      append({
        id: `bot-${Date.now()}`,
        who: "bot",
        text: reply,
        time: Date.now(),
      });
    } catch (err) {
      append({
        id: `bot-${Date.now()}`,
        who: "bot",
        text: "Network error. Try again.",
        time: Date.now(),
      });
    } finally {
      setSending(false);
      setTimeout(
        () =>
          scrollRef.current?.scrollTo({
            top: scrollRef.current.scrollHeight,
            behavior: "smooth",
          }),
        50
      );
    }
  };

  const removeMessage = (id: string) => {
    setMessages((prev) => prev.filter((m) => m.id !== id));
  };

  const handleSend = async (text?: string) => {
    // ✅ Remove welcome message + hide presets after first message
    setMessages((prev) => prev.filter((m) => !m.removable));
    setShowPresets(false);

    const finalText = (text ?? input).trim();
    if (!finalText) return;

    append({
      id: `user-${Date.now()}`,
      who: "user",
      text: finalText,
      time: Date.now(),
    });

    setInput("");
    await sendToServer(finalText);
  };

  const presets = role === "owner" ? OWNER_PRESET_MESSAGES : USER_PRESET_MESSAGES;

  return (
  <div>
    {/* Chat Open Button */}
    <button
      onClick={() => setOpen((o) => !o)}
      className="fixed right-6 bottom-6 p-3 rounded-full shadow-lg bg-black text-white z-40"
    >
      💬
    </button>

    {open && (
      <div className="fixed right-6 bottom-20 w-80 md:w-96 h-96 bg-white text-black border border-gray-300 rounded-lg shadow-xl flex flex-col z-50">
        {/* Header */}
        <div className="px-4 py-3 border-b border-gray-300 flex items-center justify-between">
          <div>
            <div className="font-semibold text-black">
              RentAura Assistant
            </div>
            <div className="text-xs text-black/60">
              {role === "owner"
                ? "Ask how to manage rooms, bookings, and pricing"
                : "Ask about booking, documents, food, or curfew"}
            </div>
          </div>
          <button
            onClick={() => setOpen(false)}
            className="text-sm text-black/60 hover:text-black"
          >
            ✕
          </button>
        </div>

        {/* Messages */}
        <div
          ref={scrollRef}
          className="flex-1 overflow-y-auto p-3 space-y-3"
        >
          {messages.map((m) => (
            <div
              key={m.id}
              className={`flex ${
                m.who === "user" ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`relative max-w-[80%] max-h-40 overflow-y-auto px-3 py-2 rounded-md ${
                  m.who === "user"
                    ? "bg-black text-white"
                    : "bg-gray-100 text-black border border-gray-300"
                }`}
              >
                {/* Remove button for welcome message */}
                {m.removable && (
                  <button
                    onClick={() => removeMessage(m.id)}
                    className="absolute top-1 right-1 text-xs text-black/50 hover:text-red-500"
                  >
                    ✕
                  </button>
                )}

                <div className="text-sm whitespace-pre-wrap pr-4">
                  {m.text}
                </div>
              </div>
            </div>
          ))}

          {sending && (
            <div className="flex justify-start">
              <div className="max-w-[80%] px-3 py-2 rounded-md bg-gray-100 text-black border border-gray-300 text-sm">
                Typing...
              </div>
            </div>
          )}
        </div>

        {/* ✅ Presets (auto-hide after first message) */}
        {showPresets && (
          <div className="px-3 pb-2">
            <div className="flex flex-wrap gap-2">
              {presets.map((p) => (
                <button
                  key={p}
                  onClick={() => handleSend(p)}
                  className="text-xs px-2 py-1 rounded-md bg-gray-100 text-black border border-gray-300 hover:bg-gray-200"
                >
                  {p}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Input */}
        <div className="px-3 py-2 border-t border-gray-300 flex gap-2">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
            placeholder="Type a message..."
            className="flex-1 px-3 py-2 rounded-md bg-white text-black border border-gray-300 text-sm focus:outline-none"
            disabled={sending}
          />
          <button
            onClick={() => handleSend()}
            className="px-3 py-2 rounded-md bg-black text-white text-sm disabled:opacity-50"
            disabled={sending}
          >
            Send
          </button>
        </div>
      </div>
    )}
  </div>
);

}
