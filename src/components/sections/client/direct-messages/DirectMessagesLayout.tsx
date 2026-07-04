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

      <div className="flex-1 px-3 py-3 sm:px-4 md:px-6 md:py-4">
        <div className="mx-auto flex h-[calc(100vh-110px)] max-w-7xl flex-col overflow-hidden rounded-3xl border border-[#EAECE8] bg-white shadow-[0_8px_30px_rgba(17,45,39,0.06)] lg:flex-row">
          {/* عمود قائمة المحادثات — على اليمين */}
          <div className="w-full flex-shrink-0 flex-col border-b border-[#EEF1EF] lg:max-w-[360px] lg:border-b-0 lg:border-l">
            {roomList}
          </div>

          {/* عمود الشات — على الشمال */}
          <div className="flex min-w-0 flex-1 flex-col border-t border-[#EEF1EF] lg:border-t-0 lg:border-l">
            {chatWindow}
          </div>
        </div>
      </div>
    </div>
  );
}
