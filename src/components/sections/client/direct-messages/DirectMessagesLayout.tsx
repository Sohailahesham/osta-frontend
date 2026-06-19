"use client";

import { ReactNode } from "react";

interface Props {
  navbar: ReactNode;
  roomList: ReactNode;
  chatWindow: ReactNode;
}

/**
 * الـ layout الموحد لصفحة الرسائل (client + technician).
 * النافبار فوق، وتحته container واحد فيه:
 * - عمود الشات على الشمال (الأكبر)
 * - عمود قائمة المحادثات على اليمين ("الرسائل")
 */
export default function DirectMessagesLayout({
  navbar,
  roomList,
  chatWindow,
}: Props) {
  return (
    <div className="min-h-screen bg-[#F4F6F4] flex flex-col" dir="rtl">
      {navbar}

      <div className="flex-1 px-4 py-4 md:px-6">
        <div className="mx-auto max-w-7xl h-[calc(100vh-110px)] rounded-3xl border border-[#EAECE8] bg-white shadow-[0_8px_30px_rgba(17,45,39,0.06)] overflow-hidden flex">
          {/* عمود قائمة المحادثات — على اليمين */}
          <div className="w-full max-w-[360px] flex-shrink-0 flex flex-col">
            {roomList}
          </div>

          {/* عمود الشات — على الشمال */}
          <div className="flex-1 min-w-0 flex flex-col border-l border-[#EEF1EF]">
            {chatWindow}
          </div>
        </div>
      </div>
    </div>
  );
}
