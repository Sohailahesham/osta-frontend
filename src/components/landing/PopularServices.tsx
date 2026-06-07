import Link from "next/link";
import Image from "next/image";
import elcimg from "@/assets/images/electric.jpg";
import plumimg from "@/assets/images/plumbing.jpg";
import carpentryimg from "@/assets/images/wood.jpg";
import acimg from "@/assets/images/aircond.jpg";
import CTAButton from "@/components/landing/CTAButton";
const services = [
  {
    id: 1,
    title: "كهرباء",
    description: "تركيب نجف، إصلاح قاطع كهربائي، تغيير مفاتيح وإنارة",
    image:elcimg,
    icon: (
      <svg
        className="w-4 h-4"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M13 10V3L4 14h7v7l9-11h-7z"
        />
      </svg>
    ),
  },
  {
    id: 2,
    title: "سباكة",
    description: "تغيير مواتير مياه، تركيب خلاط، إصلاح تسريب",
    image:
      plumimg,
    icon: (
      <svg
        className="w-4 h-4"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"
        />
      </svg>
    ),
  },
  {
    id: 3,
    title: "نجارة",
    description: "تركيب رفوف، إصلاح أبواب، فك وتركيب أثاث",
    image:
      carpentryimg,
    icon: (
      <svg
        className="w-4 h-4"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
        />
      </svg>
    ),
  },
  {
    id: 4,
    title: "تكييف",
    description: "تنظيف تكييف، شحن فريون، صيانة أعطال",
    image:
      acimg,
    icon: (
      <svg
        className="w-4 h-4"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
        />
      </svg>
    ),
  },
];

// Arrow icon shared in each card
function ArrowIcon() {
  return (
    <div className="w-8 h-8 rounded-full bg-white border border-gray-200 flex items-center justify-center shadow-sm shrink-0">
      <svg
        className="w-3.5 h-3.5 text-gray-600"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M17 8l4 4m0 0l-4 4m4-4H3"
        />
      </svg>
    </div>
  );
}

export default function PopularServices() {
  return (
    <section className="bg-[#f7f9f3] py-20 px-6" dir="rtl">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-14">
          <h2 className="text-3xl sm:text-4xl font-black text-gray-900 mb-3">
            الخدمات الأكثر طلبا
          </h2>
          <p className="text-gray-400 text-sm">
            اختر من الخدمات الثابتة بأسعار واضحة وتنفيذ سريع.
          </p>
        </div>

        {/* Cards Grid — RTL: كهرباء first visually on right */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-12">
          {services.map((service) => (
            <div
              key={service.id}
              className="bg-[#eef5e0] rounded-2xl overflow-hidden flex flex-col hover:shadow-lg transition-shadow duration-300 group"
            >
              {/* Image */}
              <div className="relative h-48 w-full overflow-hidden">
                <Image
                  src={service.image}
                  alt={service.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                  unoptimized
                />
                {/* Top-left icon badge */}
                <div className="absolute top-3 left-3 w-8 h-8 rounded-full bg-[var(--accent-color)] flex items-center justify-center shadow-md text-[var(--primary-color)]">
                  {service.icon}
                </div>
              </div>

              {/* Card Body */}
              <div className="p-4 flex flex-col gap-2 flex-1">
                {/* Title row */}
                <div className="flex items-center justify-between">
                  <ArrowIcon />
                  <h3 className="font-black text-[var(--primary-color)] text-base">
                    {service.title}
                  </h3>
                </div>
                {/* Description */}
                <p className="text-gray-500 text-xs leading-relaxed text-right">
                  {service.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* CTA Button */}
        <div className="flex justify-center">
            <CTAButton href="/login" className="px-8 py-3"/>
        </div>
      </div>
    </section>
  );
}
