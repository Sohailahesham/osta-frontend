"use client";

import { useRouter } from "next/navigation";
import { ArrowUpLeft } from "lucide-react";
import mailIcon from "@/assets/icons/mail.svg";
import phoneIcon from "@/assets/icons/phone.svg";
import Image from "next/image";
import logoImage from "@/assets/images/logo-light.svg";
import Button from "../ui/Button";

const QUICK_LINKS_COL1 = [
  { label: "من نحن", href: "/about" },
  { label: "كيف تعمل المنصة", href: "/how-it-works" },
  { label: "الأقسام", href: "/client/categories" },
];

const QUICK_LINKS_COL2 = [
  { label: "الخدمات الشائعة", href: "/services" },
  { label: "الأسئلة الشائعة", href: "/faq" },
  { label: "الإبلاغ عن مشكلة", href: "/report" },
];

export default function Footer() {
  const router = useRouter();

  return (
    <footer className="primary-gradient" dir="rtl">
      <div className="w-4/5 mx-auto py-16 grid grid-cols-1 md:grid-cols-3 gap-12">
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-2">
            <Image
              src={logoImage}
              alt="Logo"
              width={120}
              // height={60}
              className="h-auto"
            />
          </div>
          <p className="text-white/60 text-sm max-w-xs leading-relaxed">
            منصة ذكية تربط العملاء بالحرفيين المؤثوقين، لتوفير خدمات الصيانة
            والأعمال المنزلية بسهولة وسرعة وشفافية.
          </p>
        </div>

        {/* الوسط — روابط سريعة */}
        <div className="flex flex-col gap-4">
          <h3 className="text-white font-bold text-base">روابط سريعة</h3>
          <div className="grid grid-cols-2 gap-x-8 gap-y-3">
            {QUICK_LINKS_COL1.map((link) => (
              <button
                key={link.href}
                onClick={() => router.push(link.href)}
                className="text-white/60 text-sm hover:text-white transition-all text-right"
              >
                {link.label}
              </button>
            ))}
            {QUICK_LINKS_COL2.map((link) => (
              <button
                key={link.href}
                onClick={() => router.push(link.href)}
                className="text-white/60 text-sm hover:text-white transition-all text-right"
              >
                {link.label}
              </button>
            ))}
          </div>
        </div>

        {/* اليسار — تواصل معنا */}
        <div className="flex flex-col gap-4">
          <h3 className="text-white font-bold text-base">تواصل معنا</h3>

          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-3">
              <Image src={mailIcon} alt="mail" />
              <span className="text-[#FAFAF7] text-sm">info@gmail.com</span>
            </div>
            <div className="flex items-center gap-3">
              <Image src={phoneIcon} alt="phone" />
              <span className="text-[#FAFAF7] text-sm" dir="ltr">
                +01000000000
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 w-fit mt-2">
            <Button
              onClick={() => router.push("/client/emergency")}
              className="!text-white !bg-[#D5433E] hover:!bg-[#B83530]"
            >
              ارقام الطوارئ
            </Button>
            <div className="w-9 h-9 rounded-full border-[#D5433E] bg-[#D5433E] hover:bg-[#B83530] flex items-center justify-center">
              <ArrowUpLeft size={16} className="text-white" />
            </div>
          </div>
        </div>
      </div>

      <div className="w-4/5 mx-auto h-px bg-white/10" />

      <div
        className="w-4/5 mx-auto py-5 flex items-center justify-between"
        dir="ltr"
      >
        <div className="flex items-center gap-2 text-white/40 text-xs">
          <button className="hover:text-white/70 transition-all">
            Cookie Policy
          </button>
          <span>|</span>
          <button className="hover:text-white/70 transition-all">
            privacy policy
          </button>
        </div>
        <p className="text-white/40 text-xs">
          © 2026 أسطى . جميع الحقوق محفوظة
        </p>
      </div>
    </footer>
  );
}
