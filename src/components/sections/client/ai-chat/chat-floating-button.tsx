"use client";

import { useState, useEffect, useRef } from "react";
import { api } from "@/api/axios";
import { SparkleSvg, QUICK_CHIPS } from "./ChatBubbles";
import { ChatMessage } from "./ChatMessages";
import ChatModal from "./ChatModal";

export default function ChatFloatingButton() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 1,
      role: "ai",
      text: "أهلًا بك في أُوسطى! 👋 أنا مساعدك الذكي، أخبرني عن مشكلتك وسأساعدك في إيجاد الأوسطى المناسب.",
      chips: QUICK_CHIPS,
    },
  ]);

  const msgId = useRef(2);

  // Lock body scroll when modal is open
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const addMsg = (msg: Omit<ChatMessage, "id">) =>
    setMessages((prev) => [...prev, { ...msg, id: msgId.current++ }]);

  const sendMessage = async (text: string) => {
    if (!text.trim() || loading) return;
    addMsg({ role: "user", text });
    setInput("");
    setLoading(true);

    try {
      const { data } = await api.post("/chat", { message: text });
      const res = data.data;

      if (res.isEmergency) {
        addMsg({
          role: "ai",
          emergencyData: {
            type: res.type,
            severity: res.severity ?? "عالية",
            contacts: res.contacts ?? {},
          },
        });
        return;
      }

      if (res.service) {
        addMsg({
          role: "ai",
          text: "وجدت الخدمة المناسبة لك:",
          serviceCard: {
            _id: res.service._id,
            name: res.service.name,
            image: res.service.image,
            rating: res.service.averageRating ?? 4.5,
            category: res.category,
            priceRange: res.service.priceRange,
            fixingSteps: res.service.fixingSteps,
          },
        });
        return;
      }

      if (res.category) {
        addMsg({ role: "ai", text: res.message, isNoService: true });
        return;
      }

      addMsg({
        role: "ai",
        text: res.message ?? "عذراً، لم أفهم طلبك. حاول وصف المشكلة بشكل أوضح.",
      });
    } catch {
      addMsg({ role: "ai", text: "حدث خطأ في الاتصال. حاول مجدداً." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* ── Floating Button ── */}
      <button
        onClick={() => setOpen(true)}
        aria-label="افتح المساعد الذكي"
        className="fixed bottom-10 right-8 z-40 w-14 h-14 rounded-full bg-gradient-to-br from-[var(--accent-color)] to-[var(--primary-color)] shadow-xl hover:scale-110 active:scale-95 transition-transform duration-200 flex items-center justify-center"
      >
        <span className="absolute inset-0 rounded-full bg-[var(--primary-color)] animate-ping opacity-25" />
        <span className="relative z-10">
          <SparkleSvg size={26} />
        </span>
      </button>

      {/* ── Modal ── */}
      {open && (
        <ChatModal
          messages={messages}
          loading={loading}
          input={input}
          onClose={() => setOpen(false)}
          onSendMessage={sendMessage}
          onInputChange={setInput}
        />
      )}
    </>
  );
}
