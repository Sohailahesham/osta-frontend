import Image from "next/image";
import Link from "next/link";
import logo from "@/assets/images/logo.svg";

const quickLinks = [
  { label: "من نحن", href: "/about" },
  { label: "كيف تعمل المنصة", href: "#how-it-works" },
  { label: "الأقسام", href: "/categories" },
];

const serviceLinks = [
  { label: "الخدمات الشائعة", href: "#services" },
  { label: "الأسئلة الشائعة", href: "#faq" },
  { label: "الإبلاغ عن مشكلة", href: "/report" },
];

export default function Footer() {
  return (
    <footer
      className="bg-[var(--primary-color)] px-6 py-12 text-white"
      dir="rtl"
    >
      <div className="mx-auto max-w-5xl">
        {/* Top grid */}
        <div className="grid grid-cols-1 gap-10 border-b border-white/10 pb-10 sm:grid-cols-3">
          {/* Col 1: Logo + description */}
          <div className="flex flex-col gap-4">
            <div className="w-fit rounded-2xl bg-white/10 p-3">
              <Image
                src={logo}
                alt="أسطى"
                width={80}
                height={32}
                className="object-contain"
              />
            </div>

            <p className="text-s leading-relaxed text-white/60">
              منصة ذكية تربط العملاء بالحرفيين الموثوقين،
              <br />
              تتوفر خدمات الصيانة والأعمال المنزلية
              <br />
              بسرعة وسعر واضح وشفافية.
            </p>
          </div>

          {/* Col 2: Quick links */}
          <div className="flex flex-col gap-3">
            <h4 className="mb-1 text-s font-black">روابط سريعة</h4>

            {quickLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className="text-xs text-white/60 transition-colors hover:text-[var(--accent-color)]"
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Col 3: Contact */}
          <div className="flex flex-col gap-3">
            <h4 className="mb-1 text-s font-black">تواصل معنا</h4>

            <a
              href="mailto:info@gmail.com"
              className="flex items-center gap-2 text-xs text-white/60 transition-colors hover:text-white"
            >
              <svg
                className="h-4 w-4 shrink-0"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.8}
                  d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                />
              </svg>
              info@gmail.com
            </a>

            <a
              href="tel:+97123043333"
              className="flex items-center gap-2 text-xs text-white/60 transition-colors hover:text-white"
            >
              <svg
                className="h-4 w-4 shrink-0"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.8}
                  d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                />
              </svg>
              +0100000000
            </a>

            {/* CTA Button */}
            <div className="mt-3 flex items-center gap-3">
              <Link
                href="/register"
                className="rounded-full bg-[var(--accent-color)] px-5 py-2.5 text-xs font-black text-[var(--primary-color)] transition-all hover:bg-[var(--accent-hover)]"
              >
                إنشاء حساب
              </Link>

              <div className="flex h-8 w-8 items-center justify-center rounded-full border border-[var(--accent-color)]">
                <svg
                  className="h-3.5 w-3.5 text-[var(--accent-color)]"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2.5}
                    d="M15 19l-7-7 7-7"
                  />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div
          className="flex flex-wrap items-center justify-between gap-3 pt-6"
          dir="ltr"
        >
          <div className="flex items-center gap-3 text-xs text-white/40">
            <Link
              href="/privacy"
              className="transition-colors hover:text-white/70"
            >
              Privacy Policy
            </Link>

            <span>|</span>

            <Link
              href="/cookies"
              className="transition-colors hover:text-white/70"
            >
              Cookie Policy
            </Link>
          </div>

          <p className="text-xs text-white/40">
            © 2026 أسطى . جميع الحقوق محفوظة
          </p>
        </div>
      </div>
    </footer>
  );
}
