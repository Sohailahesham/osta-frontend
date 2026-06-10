"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter, usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import logoImage from "@/assets/images/logo.svg";
import dmsIcon from "@/assets/icons/Dms.svg";
import bellIcon from "@/assets/icons/notification.svg";
import userIcon from "@/assets/icons/user.svg";

const NAV_LINKS = [
  { label: "الرئيسية", href: "/home" },
  { label: "الطلبات الحالية", href: "/orders" },
  { label: "الأقسام", href: "/categories" },
  { label: "الطلب الذكي", href: "/smart-request" },
  { label: "الدعم والمساعدة", href: "/support" },
];

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();

  const [menuOpen, setMenuOpen] = useState(false);
  
  return (
    <nav
      className="w-full lg:w-[90%] mx-auto bg-[#FEFEFE70]/50 backdrop-blur-md lg:rounded-full px-6 py-2 shadow-sm"
      dir="rtl"
    >
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* اللوجو */}
          <Link href="/home" className="flex-shrink-0">
            <Image
              src={logoImage}
              alt="أوسطي"
              width={100}
              height={40}
              className="h-10 w-auto"
            />
          </Link>

          {/* الروابط — desktop */}
          <div className="hidden md:flex items-center gap-1">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`px-4 py-2 text-sm rounded-full transition-all font-medium
                ${
                  pathname === link.href
                    ? "bg-[#F6F5F1] text-[var(--primary-color)]"
                    : "text-[#112D27] hover:text-[var(--primary-color)] hover:bg-[#F6F5F1]"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <button className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-gray-100 transition-all hover:text-[var(--primary-color)]">
              <Image src={dmsIcon} alt="DMs" width={24} height={24} />
            </button>
            <button className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-gray-100 transition-all hover:text-[var(--primary-color)]">
              <Image
                src={bellIcon}
                alt="Notifications"
                width={24}
                height={24}
              />
            </button>
            <button
              onClick={() => router.push("/profile")}
              className="w-9 h-9 flex items-center justify-center rounded-full text-[#112D27] hover:bg-gray-100 transition-all text-gray-500 hover:text-[var(--primary-color)]"
            >
              <Image src={userIcon} alt="Profile" width={24} height={24} />
            </button>

            {/* زرار الموبايل */}
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="md:hidden w-9 h-9 flex items-center justify-center rounded-full text-[#112D27] hover:bg-gray-100 transition-all text-gray-500 hover:text-[var(--primary-color)]"
            >
              {menuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden border-t border-gray-100 bg-white px-4 py-3 flex flex-col gap-1">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMenuOpen(false)}
              className="px-4 py-2.5 text-sm text-[#112D27] hover:text-[var(--primary-color)] rounded-xl hover:bg-gray-50 transition-all font-medium"
            >
              {link.label}
            </Link>
          ))}
        </div>
      )}
    </nav>
  );
}
