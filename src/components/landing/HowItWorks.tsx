const steps = [
  {
    number: 1,
    title: "اختر الخدمة",
    description: "تصفح الأقسام أو استخدم التشخيص الذكي.",
  },
  {
    number: 2,
    title: "أرسل تفاصيل المشكلة",
    description: "أضف وصفًا أو صورة للحصول على مطابقة أدق.",
  },
  {
    number: 3,
    title: "استقبل عروض الحرفيين",
    description: "سيتم اقتراح الحرفيين المناسبين لطلبك.",
  },
  {
    number: 4,
    title: "متابعة حتى انتهاء الخدمة",
    description: "تابع حالة الطلب والدردشة مع الحرفي عند الحاجة.",
  },
];

export default function HowItWorks() {
  return (
    <section className="bg-white py-20 px-6" dir="rtl">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-black text-gray-900 mb-3">
            كيف تعمل المنصة؟
          </h2>
          <p className="text-gray-400 text-sm">خطوات بسيطة للحصول على الخدمة</p>
        </div>

        {/* Steps Row */}
        <div className="relative flex items-start justify-between gap-0">
          {steps.map((step, i) => (
            <div key={step.number} className="relative flex flex-col items-center flex-1">

              {/* Dashed connector line (between circles) */}
              {i < steps.length - 1 && (
                <div className="absolute top-6 right-1/2 w-full h-0 z-0 pointer-events-none">
                  {/* SVG wavy dashed line */}
                  <svg
                    className="absolute top-[-1px] left-0 w-full"
                    height="12"
                    preserveAspectRatio="none"
                    viewBox="0 0 200 12"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M0,6 Q25,0 50,6 Q75,12 100,6 Q125,0 150,6 Q175,12 200,6"
                      fill="none"
                      stroke="#c8d8c8"
                      strokeWidth="1.5"
                      strokeDasharray="6 4"
                    />
                  </svg>
                </div>
              )}

              {/* Circle */}
              <div className="relative z-10 w-12 h-12 rounded-full bg-[var(--primary-color)] text-white font-black text-lg flex items-center justify-center shadow-md mb-6">
                {step.number}
              </div>

              {/* Text */}
              <div className="text-center px-3">
                <h3 className="font-black text-gray-900 text-sm sm:text-base mb-2 leading-snug">
                  {step.title}
                </h3>
                <p className="text-gray-500 text-xs sm:text-sm leading-relaxed">
                  {step.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}