"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter, usePathname } from "next/navigation";
import { BriefcaseBusiness, Menu, WalletCards, X } from "lucide-react";
import logoImage from "@/assets/images/logo.svg";
import dmsIcon from "@/assets/icons/Dms.svg";
import bellIcon from "@/assets/icons/notification.svg";
import userIcon from "@/assets/icons/user.svg";

const NAV_LINKS = [
  { label: "الطلبات الواردة", href: "/technician/orders" },
  { label: "المحلات", href: "/technician/stores" },
  { label: "الدعم و المساعدة", href: "/technician/support" },
];

const WORK_LINKS = [
  {
    label: "العروض المعلقة",
    href: "/technician/portfolio/pending",
    icon: WalletCards,
  },
  {
    label: "العروض الحالية",
    href: "/technician/portfolio/current",
    icon: BriefcaseBusiness,
  },
];

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const [workMenuOpen, setWorkMenuOpen] = useState(false);
  const workMenuRef = useRef<HTMLDivElement | null>(null);

  const isWorkRoute = pathname.startsWith("/technician/portfolio");

  useEffect(() => {
    const handlePointerDown = (event: MouseEvent) => {
      if (
        workMenuRef.current
        && !workMenuRef.current.contains(event.target as Node)
      ) {
        setWorkMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handlePointerDown);
    return () => document.removeEventListener("mousedown", handlePointerDown);
  }, []);

  return (
    <nav
      className="relative z-40 mx-auto w-full bg-[#FEFEFE70]/50 px-6 py-2 shadow-sm backdrop-blur-md lg:w-[90%] lg:rounded-full"
      dir="rtl"
    >
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <Link href="/technician/orders" className="flex-shrink-0">
            <Image
              src={logoImage}
              alt="أُسطى"
              width={100}
              height={40}
              className="h-10 w-auto"
            />
          </Link>

          <div className="hidden items-center gap-1 md:flex">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`rounded-full px-4 py-2 text-sm font-medium transition-all ${
                  pathname === link.href
                    ? "bg-[#F6F5F1] text-[var(--primary-color)]"
                    : "text-[#112D27] hover:bg-[#F6F5F1] hover:text-[var(--primary-color)]"
                }`}
              >
                {link.label}
              </Link>
            ))}

            <div className="relative" ref={workMenuRef}>
              <button
                type="button"
                onClick={() => setWorkMenuOpen((open) => !open)}
                className={`rounded-full px-4 py-2 text-sm font-medium transition-all ${
                  isWorkRoute
                    ? "bg-[#F6F5F1] text-[var(--primary-color)]"
                    : "text-[#112D27] hover:bg-[#F6F5F1] hover:text-[var(--primary-color)]"
                }`}
              >
                الأعمال
              </button>

              {workMenuOpen ? (
                <div className="absolute right-0 top-[calc(100%+12px)] z-50 w-56 rounded-[24px] border border-[#EAECE8] bg-white p-3 shadow-[0_18px_42px_rgba(17,45,39,0.18)]">
                  <div className="flex flex-col gap-1" dir="rtl">
                    {WORK_LINKS.map((link) => {
                      const Icon = link.icon;
                      const active =
                        pathname === link.href
                        || (link.href === "/technician/portfolio/current"
                          && pathname === "/technician/portfolio");

                      return (
                        <Link
                          key={link.href}
                          href={link.href}
                          onClick={() => setWorkMenuOpen(false)}
                          className={`flex w-full items-center justify-between rounded-2xl px-4 py-3 text-right text-base transition-all ${
                            active
                              ? "bg-[#F7FAF2] text-[var(--primary-color)]"
                              : "text-[#31554B] hover:bg-[#F8FAF9]"
                          }`}
                        >
                          <span>{link.label}</span>
                          <Icon size={18} className="text-[#31554B]" />
                        </Link>
                      );
                    })}
                  </div>
                </div>
              ) : null}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => router.push("/technician/direct-messages")}
              className="flex h-9 w-9 items-center justify-center rounded-full transition-all hover:bg-gray-100 hover:text-[var(--primary-color)]"
            >
              <Image src={dmsIcon} alt="DMs" width={24} height={24} />
            </button>
            <button
              onClick={() => router.push("")}
              className="flex h-9 w-9 items-center justify-center rounded-full transition-all hover:bg-gray-100 hover:text-[var(--primary-color)]"
            >
              <Image
                src={bellIcon}
                alt="Notifications"
                width={24}
                height={24}
              />
            </button>
            <button
              onClick={() => router.push("/technician/profile")}
              className="flex h-9 w-9 items-center justify-center rounded-full text-[#112D27] transition-all hover:bg-gray-100 hover:text-[var(--primary-color)]"
            >
              <Image src={userIcon} alt="Profile" width={24} height={24} />
            </button>

            <button
              onClick={() => setMenuOpen((open) => !open)}
              className="flex h-9 w-9 items-center justify-center rounded-full text-[#112D27] transition-all hover:bg-gray-100 hover:text-[var(--primary-color)] md:hidden"
            >
              {menuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </div>

      {menuOpen ? (
        <div className="flex flex-col gap-2 border-t border-gray-100 bg-white px-4 py-3 md:hidden">
          <div className="rounded-2xl border border-[#EEF1EF] p-2">
            <button
              type="button"
              onClick={() => setWorkMenuOpen((open) => !open)}
              className={`w-full rounded-xl px-4 py-2.5 text-right text-sm font-medium transition-all ${
                isWorkRoute
                  ? "bg-[#F6F5F1] text-[var(--primary-color)]"
                  : "text-[#112D27] hover:bg-gray-50 hover:text-[var(--primary-color)]"
              }`}
            >
              الأعمال
            </button>

            {workMenuOpen ? (
              <div className="mt-2 flex flex-col gap-1">
                {WORK_LINKS.map((link) => {
                  const Icon = link.icon;
                  return (
                    <Link
                      key={link.href}
                      href={link.href}
                      onClick={() => {
                        setWorkMenuOpen(false);
                        setMenuOpen(false);
                      }}
                      className="flex w-full items-center justify-between rounded-xl px-4 py-2.5 text-sm text-[#31554B] hover:bg-[#F8FAF9]"
                    >
                      <span>{link.label}</span>
                      <Icon size={16} />
                    </Link>
                  );
                })}
              </div>
            ) : null}
          </div>

          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMenuOpen(false)}
              className="rounded-xl px-4 py-2.5 text-sm font-medium text-[#112D27] transition-all hover:bg-gray-50 hover:text-[var(--primary-color)]"
            >
              {link.label}
            </Link>
          ))}
        </div>
      ) : null}
    </nav>
  );
}
