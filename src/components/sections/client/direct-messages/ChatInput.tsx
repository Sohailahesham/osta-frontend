"use client";

import { useState, useRef, KeyboardEvent } from "react";
import Image from "next/image";

interface Props {
  onSend: (content: string) => void;
  onAttachImage?: () => void;
  disabled?: boolean;
  placeholder?: string;
}

export default function ChatInput({
  onSend,
  onAttachImage,
  disabled = false,
  placeholder = "صف مشكلتك هنا...",
}: Props) {
  const [text, setText] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSend = () => {
    const trimmed = text.trim();
    if (!trimmed || disabled) return;
    onSend(trimmed);
    setText("");
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleInput = () => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${Math.min(el.scrollHeight, 120)}px`;
  };

  return (
    <div className="flex items-center gap-2 px-4 py-3 border-t border-[#EEF1EF] bg-white flex-shrink-0">
      {/* Attach Image */}
      <button
        onClick={onAttachImage}
        disabled={disabled}
        aria-label="إرفاق صورة"
        className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 transition-all hover:bg-[#F4F6F4] disabled:opacity-40 disabled:cursor-not-allowed"
      >
        <svg
          width="25"
          height="21"
          viewBox="0 0 25 21"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M20.0212 20.02H4.60375C3.58167 20.02 2.60146 19.614 1.87874 18.8913C1.15602 18.1685 0.75 17.1883 0.75 16.1663V7.17375C0.749836 6.66756 0.849395 6.1663 1.04299 5.6986C1.23659 5.2309 1.52043 4.80592 1.8783 4.44793C2.23617 4.08994 2.66106 3.80597 3.1287 3.61222C3.59634 3.41847 4.09756 3.31875 4.60375 3.31875H6.3775C6.8875 3.31875 7.3775 3.11625 7.74 2.75375L9.1775 1.315C9.54 0.95375 10.0275 0.75 10.54 0.75H14.085C14.3381 0.749982 14.5887 0.799875 14.8225 0.896825C15.0563 0.993774 15.2687 1.13588 15.4475 1.315L16.885 2.75375C17.2475 3.115 17.7375 3.31875 18.2475 3.31875H20.0212C20.5274 3.31875 21.0287 3.41847 21.4963 3.61222C21.9639 3.80597 22.3888 4.08994 22.7467 4.44793C23.1046 4.80592 23.3884 5.2309 23.582 5.6986C23.7756 6.1663 23.8752 6.66756 23.875 7.17375V16.1663C23.875 17.1883 23.469 18.1685 22.7463 18.8913C22.0235 19.614 21.0433 20.02 20.0212 20.02Z"
            stroke="#1C4B41"
            stroke-width="1.5"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
          <path
            d="M15.9462 14.6612C14.9825 15.6249 13.6755 16.1663 12.3126 16.1663C10.9497 16.1663 9.64264 15.6249 8.67893 14.6612C7.71523 13.6975 7.17383 12.3904 7.17383 11.0275C7.17383 9.66466 7.71523 8.3576 8.67893 7.3939C9.64264 6.4302 10.9497 5.88879 12.3126 5.88879C13.6755 5.88879 14.9825 6.4302 15.9462 7.3939C16.9099 8.3576 17.4513 9.66466 17.4513 11.0275C17.4513 12.3904 16.9099 13.6975 15.9462 14.6612Z"
            stroke="#1C4B41"
            stroke-width="1.5"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>
      </button>

      {/* Textarea */}
      <textarea
        ref={textareaRef}
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={handleKeyDown}
        onInput={handleInput}
        placeholder={placeholder}
        disabled={disabled}
        rows={1}
        dir="rtl"
        className="flex-1 resize-none rounded-full border border-[#E0DED9] px-4 py-2.5 text-sm text-[#1F2D28] placeholder-[#BBBBBB] outline-none focus:border-[#7CB342] transition-colors bg-[#FAFBFA] disabled:opacity-50 disabled:cursor-not-allowed leading-relaxed overflow-hidden"
      />

      {/* Send Button — على اليمين زي الصورة */}
      <button
        onClick={handleSend}
        disabled={disabled || !text.trim()}
        aria-label="إرسال"
        className="w-9 h-9 rounded-full bg-[#B3E718] flex items-center justify-center flex-shrink-0 transition-all hover:bg-[#6a9e32] active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed"
      >
        <svg
          width="20"
          height="20"
          viewBox="0 0 20 20"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M7.8865 18.0716C7.85484 18.1505 7.79981 18.2179 7.72878 18.2646C7.65775 18.3113 7.57413 18.3352 7.48914 18.333C7.40415 18.3308 7.32186 18.3027 7.25331 18.2524C7.18477 18.2021 7.13325 18.1321 7.10567 18.0516L1.689 2.2183C1.66233 2.14446 1.65724 2.06455 1.67433 1.98793C1.69142 1.9113 1.72997 1.84113 1.78549 1.78561C1.841 1.7301 1.91117 1.69154 1.9878 1.67446C2.06442 1.65737 2.14433 1.66246 2.21817 1.68913L18.0515 7.1058C18.1319 7.13338 18.202 7.1849 18.2523 7.25344C18.3026 7.32199 18.3307 7.40428 18.3329 7.48926C18.335 7.57425 18.3112 7.65787 18.2645 7.7289C18.2177 7.79993 18.1504 7.85497 18.0715 7.88663L11.4632 10.5366C11.2543 10.6203 11.0645 10.7453 10.9052 10.9043C10.7459 11.0633 10.6205 11.2529 10.5365 11.4616L7.8865 18.0716Z"
            stroke="#1C4B41"
            stroke-width="1.66667"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
          <path
            d="M1.78812 1.78918L10.9048 10.905"
            stroke="#1C4B41"
            stroke-width="1.66667"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>
      </button>
    </div>
  );
}
