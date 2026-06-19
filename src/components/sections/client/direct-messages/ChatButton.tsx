"use client";

import { useEffect, useState } from "react";
import { chatService } from "@/api/services/chat.service";
import Button from "@/components/ui/Button";
import { useRouter } from "next/navigation";
import { MessageCircle } from "lucide-react";

interface Props {
  requestId: string;
  /** "client" أو "technician" — بيحدد الـ path */
  role: "client" | "technician";
}

export default function ChatButton({ requestId, role }: Props) {
  const [unread, setUnread] = useState(0);

  useEffect(() => {
    chatService
      .getUnreadCount(requestId)
      .then(setUnread)
      .catch(() => setUnread(0));
  }, [requestId]);
  const router = useRouter();

  const href = `/${role}/direct-messages?requestId=${requestId}`;

  return (
    // <Link
    //   href={href}
    //   className="relative inline-flex items-center gap-2 px-4 py-2 rounded-full border border-[#1C4B41] text-[#1C4B41] text-sm font-medium transition-all hover:bg-[#1C4B41] hover:text-white"
    // >
    //   {/* Chat icon */}
    //   <svg
    //     width="16"
    //     height="16"
    //     viewBox="0 0 24 24"
    //     fill="none"
    //     stroke="currentColor"
    //     strokeWidth="2"
    //     strokeLinecap="round"
    //     strokeLinejoin="round"
    //   >
    //     <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
    //   </svg>
    //   محادثة
    //   {/* Unread badge */}
    //   {unread > 0 && (
    //     <span className="absolute -top-1.5 -left-1.5 min-w-[18px] h-[18px] rounded-full bg-red-500 text-white text-[10px] font-bold flex items-center justify-center px-1">
    //       {unread > 9 ? "9+" : unread}
    //     </span>
    //   )}
    // </Link>

    <Button
      variant="outline"
      className="!relative !px-3 !text-xs !font-medium !text-[#636261] !border-[#EAE9E3] !hover:bg-[#F8FAF9]"
      onClick={() => router.push(href)}
    >
      <span className="inline-flex items-center gap-2">
        <MessageCircle size={12} className="text-[#8B908D]" />
        محادثة
        {/* Unread badge */}
        {unread > 0 && (
          <span className="absolute -top-1.5 -left-1.5 min-w-[18px] h-[18px] rounded-full bg-red-500 text-white text-[10px] font-bold flex items-center justify-center px-1">
            {unread > 9 ? "9+" : unread}
          </span>
        )}
      </span>
    </Button>
  );
}
