"use client";

import { Star, ArrowUpLeft, ArrowLeft, Phone } from "lucide-react";
import Image from "next/image";
import electricIcon from "@/assets/icons/electricicon.svg";
import pin from "@/assets/icons/pin.svg";
import time from "@/assets/icons/time.svg";

// ─── Types (re-exported so other files can import from here) ─────────────────

export interface ServiceCard {
  _id: string;
  name: string;
  image: string;
  rating: number;
  category: string;
  priceRange?: { min: number; max: number };
  fixingSteps?: { includes: string[] };
}

export interface EmergencyContact {
  phone: string;
  name: string;
}

export interface EmergencyData {
  type: string;
  severity: string;
  contacts: {
    gas?: EmergencyContact;
    fire?: EmergencyContact;
    ambulance?: EmergencyContact;
  };
}

// ─── Constants ────────────────────────────────────────────────────────────────

export const QUICK_CHIPS = [
  "عطل في غسالة أو ثلاجة",
  "مشكلة في الكهرباء",
  "يوجد تسريب مياه",
  "باب أو نافذة معطلة",
  "جهاز التكييف لا يرد",
];

export const SIDEBAR_TIPS = [
  {
    icon: <Image src={electricIcon} alt="Electric" width={20} height={20} />,
    text: "اشرح المشكلة بالتفصيل لتتمكن من مساعدتك",
  },
  {
    icon: <Image src={pin} alt="Pin" width={20} height={20} />,
    text: "حدد مكان المشكلة في المنزل (مطبخ، حمام، صالة)",
  },
  {
    icon: <Image src={time} alt="Time" width={20} height={20} />,
    text: "أخبرنا متى بدأت المشكلة وهل تتكرر",
  },
];

export const COMMON_ISSUES = [
  "جهاز التكييف لا يرد",
  "يوجد تسريب مياه",
  "مشكلة في الكهرباء",
  "باب أو نافذة معطلة",
  "عطل في غسالة أو ثلاجة",
];

const NO_SERVICE_BULLETS = [
  "الوصول الي الفني المختص ",
  "سهوله التواصل و مناقشه التفاصيل",
  "الدقه و الامان في العمل",
];

const EMERGENCY_TIPS = [
  "لا تضغط على أي مفتاح كهرباء أو تشغل ولاعة",
  "افتح كل الشبابيك والأبواب فوراً",
  "أغلق صمام الغاز الرئيسي إن كان في متناولك",
  "اخرج من المكان وابتعد عن المبنى",
];

// ─── Sparkle SVG ──────────────────────────────────────────────────────────────

export function SparkleSvg({
  size = 22,
  color = "white",
}: {
  size?: number;
  color?: string;
}) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" >
      <path
        d="M12 2L13.5 8.5L20 10L13.5 11.5L12 18L10.5 11.5L4 10L10.5 8.5L12 2Z"
        fill={color}
      />
      <path
        d="M19 14L19.75 17.25L23 18L19.75 18.75L19 22L18.25 18.75L15 18L18.25 17.25L19 14Z"
        fill={color}
        opacity="0.8"
      />
      <path
        d="M5 3L5.5 5.5L8 6L5.5 6.5L5 9L4.5 6.5L2 6L4.5 5.5L5 3Z"
        fill={color}
        opacity="0.6"
      />
    </svg>
  );
}

// ─── AI row label ─────────────────────────────────────────────────────────────

export function AiLabel() {
  return (
    <div className="flex items-center justify-end gap-2 mb-2">
      <span className="text-[11px] font-bold text-[var(--primary-color)]">
    AI أسطى 
      </span>
      <div className="w-7 h-7 rounded-full bg-gradient-to-br from-[var(--primary-color)] to-[var(--accent-color)] flex items-center justify-center shrink-0">
        <SparkleSvg size={13} color="#B3E718" />
      </div>
    </div>
  );
}

// ─── Scenario 1: Service Card ─────────────────────────────────────────────────

export function ServiceCardBubble({
  card,
  onRequest,
}: {
  card: ServiceCard;
  onRequest: (id: string) => void;
}) {
  const bullets = card.fixingSteps?.includes ?? [];

  return (
    <div className="rounded-2xl border border-gray-100 overflow-hidden w-full max-w-[300px] shadow-sm bg-white">
      <div className="relative w-full h-[150px]">
        <img
          src={
            card.image ||
            `https://placehold.co/400x200/1C4B41/B3E718?text=${encodeURIComponent(card.name)}`
          }
          alt={card.name}
          className="w-full h-full object-cover"
        />
        {card.priceRange && (
          <span className="absolute bottom-2 right-2 bg-[var(--accent-color)] text-[var(--primary-color)] text-[11px] font-bold px-2.5 py-0.5 rounded-full">
            {card.priceRange.min} – {card.priceRange.max} جنيه
          </span>
        )}
        <span className="absolute top-2 left-2 bg-white/85 backdrop-blur-sm text-[var(--primary-color)] text-[11px] font-semibold px-2.5 py-1 rounded-full">
          {card.category}
        </span>
      </div>

      <div className="p-4" dir="rtl">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-1 shrink-0">
            <Star size={13} className="text-yellow-400 fill-yellow-400" />
            <span className="text-xs font-bold">{card.rating ?? 4.5}</span>
          </div>
          <p className="font-bold text-[var(--primary-color)] text-sm text-right leading-snug">
            {card.name}
          </p>
        </div>

        {bullets.length > 0 && (
          <ul className="space-y-1.5 mb-4" dir="ltr">
            {bullets.slice(0, 4).map((b, i) => (
              <li
                key={i}
                className="flex items-center justify-end gap-2 text-xs text-gray-600"
              >
                {b}
                <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent-color)] shrink-0" />
              </li>
            ))}
          </ul>
        )}

        <button
          onClick={() => onRequest(card._id)}
          className="w-full bg-[var(--accent-color)] text-[var(--primary-color)] font-bold rounded-xl py-2.5 text-sm flex items-center justify-center gap-2 hover:bg-[var(--accent-hover)] transition-colors"
        >
          <ArrowUpLeft size={15} />
          اطلب الخدمة الآن
        </button>
      </div>
    </div>
  );
}

// ─── Scenario 2: Emergency bubble ────────────────────────────────────────────

export function EmergencyBubble({ data }: { data: EmergencyData }) {
  const contacts = Object.entries(data.contacts).filter(([, v]) => v) as [
    string,
    EmergencyContact,
  ][];

  const contactIcon = (key: string) => {
    if (key === "ambulance")
      return (
        <svg
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          className="text-red-400"
        >
          <rect
            x="3"
            y="7"
            width="18"
            height="13"
            rx="2"
            stroke="currentColor"
            strokeWidth="2"
          />
          <path
            d="M8 7V5a4 4 0 0 1 8 0v2"
            stroke="currentColor"
            strokeWidth="2"
          />
          <path
            d="M12 12v4M10 14h4"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </svg>
      );
    return <Phone size={14} className="text-red-400" />;
  };

  return (
    <div
      className="w-full max-w-[320px] rounded-2xl bg-white border border-red-100 overflow-hidden"
      dir="rtl"
    >
      <div className="px-5 pt-4 pb-3">
        <p className="text-red-500 font-bold text-sm mb-3">
          🚨 حالة طارئة — تصرف فوراً!
        </p>

        <p className="text-red-500 font-bold text-xs mb-2">
          نصائح سريعة قبل وصول المساعدة:
        </p>
        <ul className="space-y-2 mb-4">
          {EMERGENCY_TIPS.map((tip, i) => (
            <li key={i} className="flex items-start gap-2 text-xs text-gray-700">
              <span className="mt-1 w-1.5 h-1.5 rounded-full bg-red-400 shrink-0" />
              {tip}
            </li>
          ))}
        </ul>

        <div className="border-t border-gray-100 mb-3" />

        <p className="text-gray-700 font-bold text-xs mb-2.5">
          اتصل بالطوارئ الآن:
        </p>
        <div className="space-y-2">
          {contacts.map(([key, c]) => (
            <a
              key={c.phone}
              href={`tel:${c.phone}`}
              className="flex items-center justify-between bg-red-50 border border-red-200 rounded-xl px-4 py-2.5 hover:bg-red-100 transition-colors"
            >
              <div className="flex items-center gap-2">
                {contactIcon(key)}
                <span className="text-red-500 font-bold text-sm">{c.phone}</span>
              </div>
              <span className="text-xs text-gray-600">{c.name} —</span>
            </a>
          ))}
        </div>

        <button className="mt-3 flex items-center gap-1.5 text-xs text-gray-500 hover:text-red-500 transition-colors">
          <ArrowLeft size={12} />
          الذهاب الى ارقام الطوارئ
        </button>
      </div>
    </div>
  );
}

// ─── Scenario 3: No-service bubble ───────────────────────────────────────────

export function NoServiceBubble({
  text,
  onBrowse,
}: {
  text: string;
  onBrowse: () => void;
}) {
  return (
    <div
      className="w-full max-w-[320px] rounded-2xl bg-white border border-gray-100 p-4 shadow-sm"
      dir="rtl"
    >
      <p className="text-sm text-gray-700 leading-7 mb-3 text-right">{text}</p>

      <p className="font-bold text-[var(--primary-color)] text-xs mb-2">
        تشمل الخدمات المتخصصه :
      </p>
      <ul className="space-y-2 mb-4" dir="ltr">
        {NO_SERVICE_BULLETS.map((b, i) => (
          <li
            key={i}
            className="flex items-center justify-end gap-2 text-xs text-gray-600"
          >
            {b}
            <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent-color)] shrink-0" />
          </li>
        ))}
      </ul>

      <button
        onClick={onBrowse}
        className="w-full bg-indigo-600 text-white font-bold rounded-xl py-2.5 text-sm flex items-center justify-center gap-2 hover:bg-indigo-700 transition-colors"
      >
        <ArrowUpLeft size={15} />
        اطلب خدمة مخصصة
      </button>
    </div>
  );
}