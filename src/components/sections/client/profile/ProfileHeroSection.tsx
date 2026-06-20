"use client";

import { Pencil } from "lucide-react";
import Navbar from "@/components/layout/client/Navbar";

interface Props {
  fullName: string;
  email: string;
  isVerified: boolean;
  createdAt: string;
  onEditClick: () => void;
}

export default function ProfileHeroSection({
  fullName,
  email,
  isVerified,
  createdAt,
  onEditClick,
}: Props) {
  const initials = fullName
    .split(" ")
    .slice(0, 2)
    .map((w) => w.charAt(0))
    .join("");

  const memberSince = new Date(createdAt).toLocaleDateString("ar-EG", {
    month: "long",
    year: "numeric",
  });

  return (
    <section className="primary-gradient w-full py-10 px-8 md:px-16 lg:px-24" >
        <div className="relative lg:p-5 z-20">
        <Navbar />
      </div>
  <div className="flex justify-end items-center gap-6" dir="ltr">

    <div className="text-right">
      <div className="flex items-center justify-end gap-2 mb-1">
        <button
          onClick={onEditClick}
          className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center"
        >
          <Pencil size={14} className="text-white" />
        </button>

        <h1 dir="ltr" className="text-3xl md:text-4xl font-bold text-white">
          {fullName}
        </h1>
      </div>

      <p dir="ltr" className="text-right text-white/70 text-sm mb-2">
        {email}
      </p>

      <div
        dir="rtl"
        className="flex justify-end items-center gap-3 text-sm"
      >
        {isVerified && (
          <span className="text-[var(--accent-color)]">
            ✓ عميل موثق
          </span>
        )}

        <span className="text-white/40">•</span>

        <span className="text-white/60">
          عضو منذ {memberSince}
        </span>
      </div>
    </div>

    <div className="w-20 h-20 rounded-full bg-[var(--accent-color)] flex items-center justify-center">
      <span className="text-[var(--primary-color)] text-2xl font-bold">
        {initials}
      </span>
    </div>

  </div>
</section>
  );
}
