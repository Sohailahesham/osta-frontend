"use client";

import { useState, useEffect, useCallback, use } from "react";
import { useRouter } from "next/navigation";
import {
  Check,
  Clock,
  CheckCircle2,
  MapPin,
  X,
  FileText,
  Star,
  CreditCard,
} from "lucide-react";

/* ============================================================
   Types
   - status القادم من السيرفر بقى 3 قيم بس: on_the_way / started / completed
   - الشكل ده مطابق لما بيرجعه GET /requests/my فعليًا
   ============================================================ */

interface AssignedTechnician {
  _id: string;
  fullName: string;
  phone?: string;
  averageRating?: number;
  yearsOfExperience?: number;
}

interface ClientRequest {
  _id: string;
  serviceId: { name: string; priceRange?: { min: number; max: number } };
  categoryId: { name: string };
  status: "on_the_way" | "started" | "completed";
  assignedTechnician: AssignedTechnician | null;
  address: { fullAddress: string; district?: string };
  preferredDate: string;
  preferredTime: string;
  notes: string | null;
  completionNote?: string | null;
  servicePrice?: number;
  extraMaterialsPrice?: number;
  totalPrice?: number;
  depositAmount?: number;
  depositStatus?: "paid" | "unpaid";
  isFullyPaid?: boolean;
}

// بيرجع تفاصيل الفاتورة جاهزة من بيانات الطلب (نفس الحقول اللي راجعة من /requests/my)
function getInvoiceAmounts(request: ClientRequest) {
  const servicePrice = request.servicePrice ?? 0;
  const materialsPrice = request.extraMaterialsPrice ?? 0;
  const total = request.totalPrice ?? servicePrice + materialsPrice;
  const prepaid = request.depositStatus === "paid" ? request.depositAmount ?? 0 : 0;
  const remaining = request.isFullyPaid ? 0 : Math.max(total - prepaid, 0);
  const completionNote =
    request.completionNote && request.completionNote.trim() !== "" && request.completionNote !== "لا يوجد"
      ? request.completionNote
      : null;
  return { servicePrice, materialsPrice, total, prepaid, remaining, completionNote };
}

const BASE_URL = "http://localhost:3000";

const COLORS = {
  primary: "#1C4B41",
  accent: "#B3E718",
  secondary: "#F1F7E7",
  warning: "#C2783C",
  gold: "#FBBF24",
};

const STEPS = [
  { key: "on_the_way", title: "في الطريق" },
  { key: "started", title: "العمل جار" },
  { key: "completed", title: "تم انجاز العمل" },
] as const;

// تحويل status السيرفر لعدد الخطوات المكتملة (نفس منطق صفحة الفني)
const STATUS_PROGRESS: Record<ClientRequest["status"], number> = {
  on_the_way: 1,
  started: 2,
  completed: 3,
};

// كل قد ايه نعمل polling لمتابعة تحديثات الفني (لحد ما يتوفر سوكيت/ريل تايم)
const POLL_INTERVAL_MS = 8000;

function getToken() {
  return localStorage.getItem("access_token") || null;
}

function authHeaders() {
  const token = getToken();
  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

type Flow = "tracking" | "invoice" | "rate" | "rateSuccess";

export default function ClientTrackingPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const router = useRouter();
  const { id: requestId } = use(params);

  const [request, setRequest] = useState<ClientRequest | null>(null);
  const [loadingInitial, setLoadingInitial] = useState(true);
  const [error, setError] = useState("");

  const [flow, setFlow] = useState<Flow>("tracking");
  const [givenRating, setGivenRating] = useState(0);

  const [paying, setPaying] = useState(false);
  const [payError, setPayError] = useState("");

  const [ratingSubmitting, setRatingSubmitting] = useState(false);
  const [ratingError, setRatingError] = useState("");

  // ===== تحميل الطلب =====
  const fetchRequest = useCallback(
    async (showLoader: boolean) => {
      if (showLoader) setLoadingInitial(true);
      try {
        // مفيش endpoint لسه لجلب طلب واحد بالـ id، فبنجيب قايمة طلبات الكلاينت
        // ونلاقي الطلب المطلوب فيها. لو فيه صفحات كتير (meta.totalPages) والطلب
        // مش في الصفحة الأولى، هنا المكان اللي تحتاج تضيف فيه ?page=.. أو endpoint مخصص.
        const res = await fetch(`${BASE_URL}/requests/my`, {
          headers: authHeaders(),
        });
        const json = await res.json();
        if (!res.ok || !json.success) {
          throw new Error(json.message || "حصل خطأ في تحميل الطلب");
        }

        const list = Array.isArray(json.data) ? (json.data as ClientRequest[]) : [];
        const found = list.find((r) => r._id === requestId);
        if (!found) {
          throw new Error("الطلب غير موجود");
        }

        setRequest(found);
        setError("");

        // أول ما الطلب يخلص، نفتح شاشة الفاتورة تلقائيًا
        if (found.status === "completed") {
          setFlow((prev) => (prev === "tracking" ? "invoice" : prev));
        }
      } catch (e) {
        setError(e instanceof Error ? e.message : "حصل خطأ في تحميل الطلب");
      } finally {
        setLoadingInitial(false);
      }
    },
    [requestId]
  );

  useEffect(() => {
    fetchRequest(true);
  }, [fetchRequest]);

  // polling لحد ما الطلب يكتمل (التحديثات بتيجي من تحركات الفني)
  useEffect(() => {
    if (!request || request.status === "completed") return;
    const interval = setInterval(() => fetchRequest(false), POLL_INTERVAL_MS);
    return () => clearInterval(interval);
  }, [request, fetchRequest]);

  // ===== دفع الفاتورة =====
const handlePay = async () => {
  if (!request) return;

  const { remaining } = getInvoiceAmounts(request);
  if (remaining <= 0) {
    setFlow("rate");
    return;
  }

  setPaying(true);
  setPayError("");
  try {
    const res = await fetch(`${BASE_URL}/payment/remaining/${requestId}`, {
      method: "POST",
      headers: authHeaders(),
    });
    const json = await res.json();
    if (!res.ok || !json.success) {
      throw new Error(json.message || "حصل خطأ في الدفع");
    }

    // الـ response بيرجع paymentUrl زي عملية العربون بالظبط
    const paymentUrl = json.data?.paymentUrl;
    if (paymentUrl) {
      window.location.href = paymentUrl;
      return;
    }

    throw new Error("لم يتم الحصول على رابط الدفع");
  } catch (e) {
    setPayError(e instanceof Error ? e.message : "حصل خطأ، حاول تاني");
  } finally {
    setPaying(false);
  }
};

  // ===== إرسال التقييم =====
  const handleSubmitRating = async (rating: number, comment: string) => {
    setRatingSubmitting(true);
    setRatingError("");
    try {
      const res = await fetch(`${BASE_URL}/requests/${requestId}/rate`, {
        method: "POST",
        headers: authHeaders(),
        body: JSON.stringify({
          rating,
          ...(comment.trim() ? { comment: comment.trim() } : {}),
        }),
      });
      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.message || "حصل خطأ في إرسال التقييم");
      }
      setGivenRating(rating);
      setFlow("rateSuccess");
    } catch (e) {
      setRatingError(e instanceof Error ? e.message : "حصل خطأ، حاول تاني");
    } finally {
      setRatingSubmitting(false);
    }
  };

  const progress = request ? STATUS_PROGRESS[request.status] : 0;
  const isFullyCompleted = request?.status === "completed";

  return (
    <>
      <div dir="rtl" className="max-w-2xl mx-auto px-4 py-10">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-lg font-bold" style={{ color: COLORS.primary }}>
            {request?.serviceId?.name ?? "تتبع الطلب"}
          </h1>
          <button className="text-sm font-medium text-gray-500">الطلبات</button>
        </div>

        {loadingInitial && !request && (
          <p className="text-center text-sm text-gray-400 py-10">
            بنحمّل تفاصيل الطلب...
          </p>
        )}

        {error && (
          <p className="text-center text-red-500 text-sm mb-6">{error}</p>
        )}

        {request && (
          <>
            {/* ===== Stepper ===== */}
            <div className="relative mb-10">
              <div className="absolute top-7 left-0 right-0 h-0.5 bg-gray-200" />
              <div
                className="absolute top-7 h-0.5 transition-all"
                style={{
                  right: 0,
                  width: `${(progress / STEPS.length) * 100}%`,
                  backgroundColor: COLORS.primary,
                }}
              />
              <div className="relative flex justify-between">
                {STEPS.map((step, i) => {
                  const isDone = isFullyCompleted || i < progress - 1;
                  const isCurrent = !isFullyCompleted && i === progress - 1;
                  const isFilled = isDone || isCurrent;

                  return (
                    <div
                      key={step.key}
                      className="flex flex-col items-center gap-2 w-1/3 px-1"
                    >
                      <div
                        className="w-12 h-12 sm:w-14 sm:h-14 rounded-full flex items-center justify-center"
                        style={{
                          backgroundColor: isFilled ? COLORS.primary : "#fff",
                          border: isFilled ? "none" : "2px solid #E5E7EB",
                        }}
                      >
                        {i === 0 ? (
                          <Clock
                            className="w-5 h-5 sm:w-6 sm:h-6"
                            style={{ color: isFilled ? "#fff" : "#9CA3AF" }}
                          />
                        ) : (
                          <CheckCircle2
                            className="w-5 h-5 sm:w-6 sm:h-6"
                            style={{ color: isFilled ? "#fff" : "#9CA3AF" }}
                          />
                        )}
                      </div>
                      <span
                        className="text-xs sm:text-sm font-semibold text-center"
                        style={{ color: COLORS.primary }}
                      >
                        {step.title}
                      </span>
                      {/* بادج حالة للقراءة فقط - مفيش أكشن من جهة الكلاينت */}
                      <span
                        className="text-[11px] sm:text-xs font-bold px-3 sm:px-4 py-1.5 rounded-full"
                        style={{
                          backgroundColor: isDone
                            ? `${COLORS.accent}55`
                            : isCurrent
                              ? COLORS.accent
                              : "#F3F4F6",
                          color: isDone || isCurrent ? COLORS.primary : "#9CA3AF",
                        }}
                      >
                        {isDone ? "تم" : isCurrent ? "جاري الآن" : "قريبًا"}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* ===== كروت تفاصيل كل خطوة ===== */}
            <div className="flex flex-col gap-3">
              {STEPS.map((step, i) => {
                const isLive = !isFullyCompleted && i === progress - 1;
                const isDoneStep = isFullyCompleted || i < progress - 1;
                const isFuture = !isDoneStep && !isLive;

                return (
                  <div
                    key={step.key}
                    className="rounded-xl border overflow-hidden transition-all"
                    style={{
                      borderColor: isLive ? COLORS.accent : "#E5E7EB",
                      backgroundColor: isLive ? "#fff" : "#FAFAFA",
                    }}
                  >
                    <div className="flex items-center justify-between px-4 py-3.5">
                      <div className="flex items-center gap-2">
                        <span
                          className="text-sm font-bold"
                          style={{ color: isFuture ? "#9CA3AF" : COLORS.primary }}
                        >
                          {step.title}
                        </span>
                        <span
                          className="flex items-center justify-center w-6 h-6 rounded-full text-xs font-bold"
                          style={{
                            backgroundColor: isFuture ? "#F3F4F6" : COLORS.primary,
                            color: isFuture ? "#9CA3AF" : "#fff",
                          }}
                        >
                          {i + 1}
                        </span>
                      </div>

                      {isLive ? (
                        <span
                          className="flex items-center gap-1.5 text-xs font-bold px-3 py-1 rounded-full"
                          style={{
                            backgroundColor: COLORS.secondary,
                            color: COLORS.primary,
                          }}
                        >
                          <span
                            className="w-1.5 h-1.5 rounded-full"
                            style={{ backgroundColor: COLORS.accent }}
                          />
                          جار الآن
                        </span>
                      ) : (
                        <span />
                      )}
                    </div>

                    {/* في الكارد المباشر بتاع الكلاينت بنعرض اسم الفني وتقييمه، مش اسم الكلاينت */}
                    {isLive && (
                      <div className="px-4 pb-4 flex flex-col gap-3">
                        <div className="flex items-center justify-between flex-wrap gap-2">
                          <div className="flex items-center gap-2">
                            <span
                              className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold"
                              style={{
                                backgroundColor: COLORS.accent,
                                color: COLORS.primary,
                              }}
                            >
                              {request.assignedTechnician?.fullName?.charAt(0) ?? "؟"}
                            </span>
                            <div className="flex flex-col">
                              <span
                                className="text-sm font-semibold"
                                style={{ color: COLORS.primary }}
                              >
                                {request.assignedTechnician?.fullName ??
                                  "لسه مفيش فني متعين"}
                              </span>
                              {typeof request.assignedTechnician
                                ?.averageRating === "number" &&
                                request.assignedTechnician.averageRating > 0 && (
                                  <span
                                    className="flex items-center gap-1 text-xs font-bold"
                                    style={{ color: COLORS.primary }}
                                  >
                                    <Star
                                      className="w-3.5 h-3.5"
                                      style={{ color: COLORS.gold }}
                                      fill={COLORS.gold}
                                    />
                                    {request.assignedTechnician.averageRating.toFixed(
                                      1
                                    )}
                                  </span>
                                )}
                            </div>
                          </div>
                          <div className="flex items-center gap-1.5 text-sm text-gray-500">
                            <span>{request.address.fullAddress}</span>
                            <MapPin
                              className="w-4 h-4"
                              style={{ color: COLORS.accent }}
                            />
                          </div>
                        </div>

                        <div
                          className="flex items-center justify-between rounded-lg px-3 py-2"
                          style={{ backgroundColor: "#F5F5F4" }}
                        >
                          <span
                            className="text-xs font-medium"
                            style={{ color: COLORS.primary }}
                          >
                            {step.title}
                          </span>
                          <span className="flex items-center gap-1">
                            <span
                              className="w-1.5 h-1.5 rounded-full animate-pulse"
                              style={{ backgroundColor: COLORS.accent }}
                            />
                            <span
                              className="w-6 h-1.5 rounded-full"
                              style={{ backgroundColor: COLORS.primary }}
                            />
                            <span
                              className="w-1.5 h-1.5 rounded-full"
                              style={{ backgroundColor: COLORS.accent }}
                            />
                            <span
                              className="w-1.5 h-1.5 rounded-full"
                              style={{ backgroundColor: COLORS.accent }}
                            />
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </>
        )}
      </div>

      {flow === "invoice" && request && (
        <InvoiceScreen
          request={request}
          onPay={handlePay}
          paying={paying}
          error={payError}
        />
      )}

      {flow === "rate" && request && (
        <RateScreen
          technicianName={request.assignedTechnician?.fullName ?? "الفني"}
          onSubmit={handleSubmitRating}
          submitting={ratingSubmitting}
          error={ratingError}
        />
      )}

      {flow === "rateSuccess" && (
        <RateSuccessScreen
          rating={givenRating}
          onBackToHome={() => router.push("/client/orders")}
        />
      )}
    </>
  );
}

/* ============================================================
   شاشة الفاتورة (Bill)
   ============================================================ */
function InvoiceScreen({
  request,
  onPay,
  paying,
  error,
}: {
  request: ClientRequest;
  onPay: () => void;
  paying: boolean;
  error: string;
}) {
  const { servicePrice, materialsPrice, total, prepaid, remaining, completionNote } =
    getInvoiceAmounts(request);

  return (
    <div
      dir="rtl"
      className="fixed inset-0 z-50 flex items-center justify-center px-4"
      style={{ backgroundColor: "rgba(28, 75, 65, 0.68)" }}
    >
      <div className="relative w-full max-w-md rounded-[28px] bg-white p-6 shadow-xl sm:p-8">
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-bold" style={{ color: COLORS.primary }}>
              فاتورة الخدمة
            </h2>
            <FileText className="w-4 h-4" style={{ color: COLORS.primary }} />
          </div>
          <span className="text-sm text-gray-400">
            من الفني {request.assignedTechnician?.fullName ?? "-"}
          </span>
        </div>

        <div className="flex flex-col gap-3">
          <div
            className="rounded-lg px-4 py-3 text-sm"
            style={{ backgroundColor: COLORS.secondary, color: COLORS.primary }}
          >
            {request.serviceId?.name}
          </div>

          <div className="flex items-center justify-between text-sm text-gray-500">
            <span>أجرة الفني</span>
            <span>{servicePrice} جنيه</span>
          </div>

          {materialsPrice > 0 && (
            <div className="flex items-center justify-between text-sm text-gray-500">
              <span>مواد ومستلزمات</span>
              <span>{materialsPrice} جنيه</span>
            </div>
          )}

          <div
            className="flex items-center justify-between border-t border-gray-100 pt-3 text-sm font-bold"
            style={{ color: COLORS.primary }}
          >
            <span>الإجمالي</span>
            <span>{total} جنيه</span>
          </div>

          {completionNote && (
            <div
              className="rounded-lg px-3 py-2.5"
              style={{ backgroundColor: COLORS.secondary }}
            >
              <p
                className="text-xs font-semibold mb-1"
                style={{ color: COLORS.primary }}
              >
                ملاحظة الفني
              </p>
              <p className="text-xs text-gray-600 leading-6">
                &quot;{completionNote}&quot;
              </p>
            </div>
          )}

          {prepaid > 0 && (
            <div
              className="flex items-center justify-between text-sm font-semibold"
              style={{ color: COLORS.warning }}
            >
              <span>{prepaid} جنيه (عربون مدفوع)</span>
              <span>-</span>
            </div>
          )}

          {remaining > 0 ? (
            <div
              className="flex items-center justify-between rounded-xl px-4 py-3"
              style={{ backgroundColor: COLORS.primary }}
            >
              <span className="text-sm font-bold text-white">
                المطلوب دفعه الآن
              </span>
              <span
                className="text-xl font-extrabold"
                style={{ color: COLORS.accent }}
              >
                {remaining} جنيه
              </span>
            </div>
          ) : (
            <div
              className="flex items-center justify-between rounded-xl px-4 py-3"
              style={{ backgroundColor: COLORS.secondary }}
            >
              <span className="text-sm font-bold" style={{ color: COLORS.primary }}>
                تم سداد الفاتورة بالكامل
              </span>
              <Check className="w-4 h-4" style={{ color: COLORS.primary }} />
            </div>
          )}

          {error && (
            <p className="text-red-500 text-sm text-center">{error}</p>
          )}

          <button
            onClick={onPay}
            disabled={paying}
            className="mt-1 flex w-full items-center justify-center gap-2 rounded-full py-3 text-sm font-bold disabled:opacity-50"
            style={{ backgroundColor: COLORS.accent, color: COLORS.primary }}
          >
            {remaining > 0 ? (
              <>
                <CreditCard className="w-4 h-4" />
                {paying ? "بيتم الدفع..." : `ادفع ${remaining} جنيه`}
              </>
            ) : (
              "متابعة لتقييم الخدمة"
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ============================================================
   شاشة التقييم (Rate)
   ============================================================ */
function RateScreen({
  technicianName,
  onSubmit,
  submitting,
  error,
}: {
  technicianName: string;
  onSubmit: (rating: number, comment: string) => void;
  submitting: boolean;
  error: string;
}) {
  const [rating, setRating] = useState(0);
  const [hovered, setHovered] = useState(0);
  const [comment, setComment] = useState("");

  return (
    <div
      dir="rtl"
      className="fixed inset-0 z-50 flex items-center justify-center px-4"
      style={{ backgroundColor: "rgba(28, 75, 65, 0.68)" }}
    >
      <div className="relative w-full max-w-md overflow-hidden rounded-[28px] bg-white shadow-xl">
        <div
          className="px-8 py-7 text-center"
          style={{ backgroundColor: COLORS.primary }}
        >
          <p className="text-xs font-medium text-white/70">قيّم تجربتك</p>
          <h2 className="mt-1 text-xl font-extrabold text-white sm:text-2xl">
            كيف كانت الخدمة؟
          </h2>
        </div>

        <div className="flex flex-col items-center gap-4 px-8 py-7">
          <span
            className="flex h-14 w-14 items-center justify-center rounded-full text-lg font-bold"
            style={{ backgroundColor: COLORS.accent, color: COLORS.primary }}
          >
            {technicianName.charAt(0) || "؟"}
          </span>
          <span className="text-sm font-semibold" style={{ color: COLORS.primary }}>
            {technicianName}
          </span>

          <div className="flex items-center gap-2">
            {[1, 2, 3, 4, 5].map((value) => {
              const filled = value <= (hovered || rating);
              return (
                <button
                  key={value}
                  type="button"
                  onClick={() => setRating(value)}
                  onMouseEnter={() => setHovered(value)}
                  onMouseLeave={() => setHovered(0)}
                  aria-label={`${value} نجوم`}
                >
                  <Star
                    className="w-7 h-7 transition"
                    style={{ color: filled ? COLORS.gold : "#E5E7EB" }}
                    fill={filled ? COLORS.gold : "transparent"}
                  />
                </button>
              );
            })}
          </div>

          <div className="w-full">
            <label className="text-sm text-gray-500 block mb-2">
              تعليق (اختياري)
            </label>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="اكتب تعليقك هنا..."
              rows={3}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none resize-none"
            />
          </div>

          {error && <p className="text-red-500 text-sm">{error}</p>}

          <button
            onClick={() => onSubmit(rating, comment)}
            disabled={submitting || rating === 0}
            className="w-full py-3 rounded-full font-bold text-sm disabled:opacity-50"
            style={{ backgroundColor: COLORS.accent, color: COLORS.primary }}
          >
            {submitting ? "بيتبعت..." : "نشر التقييم"}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ============================================================
   شاشة نجاح التقييم (Rate Success)
   ============================================================ */
function RateSuccessScreen({
  rating,
  onBackToHome,
}: {
  rating: number;
  onBackToHome: () => void;
}) {
  return (
    <div
      dir="rtl"
      className="fixed inset-0 z-50 flex items-center justify-center px-4"
      style={{ backgroundColor: "rgba(28, 75, 65, 0.68)" }}
    >
      <div className="relative w-full max-w-[442px] rounded-[32px] bg-white px-8 py-10 text-center shadow-xl sm:px-12">
        <button
          type="button"
          onClick={onBackToHome}
          className="absolute left-8 top-8 text-gray-900 transition hover:opacity-70"
          aria-label="إغلاق"
        >
          <X className="h-5 w-5" />
        </button>

        <h2
          className="mt-8 flex items-center justify-center gap-2 text-2xl font-extrabold sm:text-3xl"
          style={{ color: COLORS.primary }}
        >
          تم نشر تقييمك!
          <Star className="h-6 w-6" style={{ color: COLORS.gold }} fill={COLORS.gold} />
        </h2>

        <p className="mx-auto mt-5 max-w-[310px] text-sm leading-7 text-gray-500">
          شكراً لثقتك في أسطى
        </p>

        <div className="mt-5 flex items-center justify-center gap-1.5">
          {[1, 2, 3, 4, 5].map((value) => (
            <Star
              key={value}
              className="h-5 w-5"
              style={{ color: value <= rating ? COLORS.gold : "#E5E7EB" }}
              fill={value <= rating ? COLORS.gold : "transparent"}
            />
          ))}
        </div>

        <div
          className="mx-auto mt-8 flex h-[124px] w-[124px] items-center justify-center rounded-full"
          style={{ backgroundColor: `${COLORS.accent}26` }}
        >
          <div
            className="flex h-[82px] w-[82px] items-center justify-center rounded-full"
            style={{ backgroundColor: COLORS.accent }}
          >
            <Check
              className="h-9 w-9"
              style={{ color: COLORS.primary }}
              strokeWidth={2.5}
            />
          </div>
        </div>

        <button
          type="button"
          onClick={onBackToHome}
          className="mt-10 h-[43px] min-w-[196px] rounded-full px-8 text-sm font-bold transition hover:brightness-95"
          style={{ backgroundColor: COLORS.accent, color: COLORS.primary }}
        >
          العودة للرئيسية
        </button>
      </div>
    </div>
  );
}