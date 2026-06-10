"use client";

import { useState } from "react";

const faqs = [
  { question: "كيف تعمل منصة أسطى؟", answer: "منصة أسطى تربطك بالحرفيين المناسبين بخطوات بسيطة: اختر الخدمة، أضف تفاصيل المشكلة، واستقبل عروض الحرفيين القريبين منك." },
  { question: "كيف يتم تحديد السعر؟", answer: "يتم عرض سعر تقديري بناءً على نوع الخدمة وتفاصيل المشكلة." },
  { question: "هل يمكنني اختيار الحرفي؟", answer: "نعم، يمكنك الاختيار من بين الحرفيين المقترحين بناءً على التقييمات والموقع والسعر." },
  { question: "هل يمكن التواصل مع الحرفي؟", answer: "نعم، يمكنك التواصل مباشرة مع الحرفي عبر المنصة بعد قبول الطلب." },
  { question: "ماذا إذا احتاجت الخدمة لتكاليف إضافية؟", answer: "في حال احتاجت الخدمة لتكاليف إضافية، سيتم إبلاغك من قبل الحرفي قبل المتابعة." },
];

export default function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(1);

  return (
    <section className="bg-white py-16 px-6" dir="rtl">
      <div className="max-w-2xl mx-auto">
        {/* Title */}
        <h2 className="text-3xl font-black text-gray-900 text-center mb-10">
          الأسئلة الشائعة
        </h2>

        {/* Accordion */}
        <div className="flex flex-col gap-3">
          {faqs.map((faq, i) => {
            const isOpen = openIndex === i;
            return (
              <div
                key={i}
                className={`rounded-2xl transition-all duration-300 overflow-hidden ${
                  isOpen
                    ? "bg-[var(--accent-color)]"
                    : "bg-[#f0f5e8]"
                }`}
              >
                <button
                  onClick={() => setOpenIndex(isOpen ? null : i)}
                  className="w-full flex items-center justify-between px-5 py-4 text-right"
                >
                  <span
                    className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 transition-colors ${
                      isOpen
                        ? "bg-white text-gray-700"
                        : "bg-white text-gray-500"
                    }`}
                  >
                    {isOpen ? (
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M20 12H4" />
                      </svg>
                    ) : (
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
                      </svg>
                    )}
                  </span>
                  <h3 className={`font-bold text-sm sm:text-base ${isOpen ? "text-[var(--primary-color)]" : "text-gray-700"}`}>
                    {faq.question}
                  </h3>
                </button>

                {isOpen && (
                  <div className="px-5 pb-5">
                    <p className="text-[var(--primary-color)] text-sm leading-relaxed text-right">
                      {faq.answer}
                    </p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}