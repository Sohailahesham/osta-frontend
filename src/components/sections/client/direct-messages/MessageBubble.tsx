"use client";

import { Message, SenderRole } from "@/types/chat.types";

interface Props {
  message: Message;
  currentUserId: string;
}

function getSenderId(senderId: Message["senderId"]): string {
  return typeof senderId === "string" ? senderId : senderId._id;
}

function formatTime(iso: string): string {
  const date = new Date(iso);
  const h = date.getHours();
  const m = String(date.getMinutes()).padStart(2, "0");
  const ampm = h >= 12 ? "م" : "ص";
  return `${h % 12 || 12}:${m} ${ampm}`;
}

export default function MessageBubble({ message, currentUserId }: Props) {
  const senderId = getSenderId(message.senderId);
  const isMine = senderId === currentUserId;
  const isAdmin = message.senderRole === SenderRole.ADMIN;

  if (isAdmin) {
    return (
      <div className="flex justify-center my-2">
        <div className="bg-gray-100 text-gray-500 text-xs px-4 py-2 rounded-full max-w-xs text-center">
          {message.content}
        </div>
      </div>
    );
  }

  return (
    <div className={`flex ${isMine ? "justify-start" : "justify-end"}`}>
      <div
        className={`flex flex-col gap-1 max-w-[68%] ${isMine ? "items-start" : "items-end"}`}
      >
        <div
          className={`px-4 py-2.5 rounded-2xl text-sm leading-relaxed break-words ${
            isMine
              ? "bg-[#1C4B41] text-white rounded-bl-sm"
              : "bg-[#FFFFFF] text-[#112D27] rounded-br-sm"
          }`}
        >
          {message.content}
        </div>

        <div
          className={`flex items-center gap-1 px-1 ${isMine ? "flex-row" : "flex-row-reverse"}`}
        >
          <span className="text-[10px] text-[#9AA6A1]">
            {formatTime(message.createdAt)}
          </span>
          {isMine && (
            <svg
              width="12"
              height="12"
              viewBox="0 0 24 24"
              fill="none"
              stroke={message.isRead ? "#7CB342" : "#9AA6A1"}
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="22" y1="2" x2="11" y2="13" />
              <polygon points="22 2 15 22 11 13 2 9 22 2" />
            </svg>
          )}
        </div>
      </div>
    </div>
  );
}
