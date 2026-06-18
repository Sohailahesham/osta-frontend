"use client";

import { useState, use, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Check,
  Clock,
  CheckCircle2,
  MapPin,
  X,
  Camera,
  FileText,
} from "lucide-react";

interface TechnicianRequest {
  _id: string;
  serviceId: { name: string };
  categoryId: { name: string };
  userId: { fullName: string };
  status: string;
  assignedTechnician: { fullName: string } | null;
  address: { fullAddress: string };
  preferredDate: string;
  preferredTime: string;
  notes: string | null;
}

const BASE_URL = "http://localhost:3000";

const COLORS = {
  primary: "#1C4B41",
  accent: "#B3E718",
  secondary: "#F1F7E7",
};

const STEPS = [
  { key: "on_the_way", title: "في الطريق" },
  { key: "started", title: "العمل جار" },
  { key: "completed", title: "تم انجاز العمل" },
] as const;

const STATUS_TO_PROGRESS: Record<string, number> = {
  in_progress: 0,
  on_the_way: 1,
  started: 2,
  completed: 3,
};

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

export default function TechnicianTrackingPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const router = useRouter();
  const { id: requestId } = use(params);

  const [request, setRequest] = useState<TechnicianRequest | null>(null);
  const [progress, setProgress] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showInvoiceModal, setShowInvoiceModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  // جيب بيانات الطلب عند الدخول
  useEffect(() => {
    const fetchRequest = async () => {
      setLoading(true);
      setError("");
      try {
        const res = await fetch(`${BASE_URL}/requests/${requestId}`, {
          headers: authHeaders(),
        });
        const json = await res.json();
        if (!res.ok) throw new Error(json.message || "حصل خطأ في تحميل الطلب");
        const data = json.data ?? json;
        setRequest(data);
        setProgress(STATUS_TO_PROGRESS[data.status] ?? 0);
      } catch (e) {
        setError(e instanceof Error ? e.message : "حصل خطأ، حاول تاني");
      } finally {
        setLoading(false);
      }
    };

    void fetchRequest();
  }, [requestId]);

  const handleOnTheWay = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`${BASE_URL}/requests/${requestId}/on-the-way`, {
        method: "PATCH",
        headers: authHeaders(),
      });
      const json = await res.json();
      if (!res.ok || !json.success) throw new Error(json.message || "حصل خطأ");
      setRequest(json.data);
      setProgress(1);
    } catch (e) {
      setError(e instanceof Error ? e.message : "حصل خطأ، حاول تاني");
    } finally {
      setLoading(false);
    }
  };

  const handleStartWork = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`${BASE_URL}/requests/${requestId}/start`, {
        method: "PATCH",
        headers: authHeaders(),
      });
      const json = await res.json();
      if (!res.ok || !json.success) throw new Error(json.message || "حصل خطأ");
      setRequest(json.data);
      setProgress(2);
    } catch (e) {
      setError(e instanceof Error ? e.message : "حصل خطأ، حاول تاني");
    } finally {
      setLoading(false);
    }
  };

  const handleOpenInvoice = () => setShowInvoiceModal(true);

  const handlers = [handleOnTheWay, handleStartWork, handleOpenInvoice];

  if (loading && !request) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div
          className="h-10 w-10 animate-spin rounded-full border-4 border-t-transparent"
          style={{ borderColor: COLORS.primary, borderTopColor: "transparent" }}
        />
      </div>
    );
  }

  if (error && !request) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 px-4 text-center">
        <p className="text-red-500 text-sm">{error}</p>
        <button
          onClick={() => router.back()}
          className="rounded-full px-6 py-2 text-sm font-bold text-white"
          style={{ backgroundColor: COLORS.primary }}
        >
          رجوع
        </button>
      </div>
    );
  }

  return (
    <>
      <div dir="rtl" className="max-w-2xl mx-auto px-4 py-10">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-lg font-bold" style={{ color: COLORS.primary }}>
            {request?.serviceId?.name ?? "تتبع الطلب"}
          </h1>
          <button
            className="text-sm font-medium text-gray-500"
            onClick={() => router.push("/technician/orders")}
          >
            الطلبات
          </button>
        </div>

        {/* Stepper */}
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
              const isDone = i < progress;
              const isNext = i === progress;
              return (
                <div
                  key={step.key}
                  className="flex flex-col items-center gap-2 w-1/3 px-1"
                >
                  <div
                    className="w-12 h-12 sm:w-14 sm:h-14 rounded-full flex items-center justify-center"
                    style={{
                      backgroundColor: isDone ? COLORS.primary : "#fff",
                      border: isDone ? "none" : "2px solid #E5E7EB",
                    }}
                  >
                    {i === 0 ? (
                      <Clock
                        className="w-5 h-5 sm:w-6 sm:h-6"
                        style={{ color: isDone ? "#fff" : "#9CA3AF" }}
                      />
                    ) : (
                      <CheckCircle2
                        className="w-5 h-5 sm:w-6 sm:h-6"
                        style={{ color: isDone ? "#fff" : "#9CA3AF" }}
                      />
                    )}
                  </div>
                  <span
                    className="text-xs sm:text-sm font-semibold text-center"
                    style={{ color: COLORS.primary }}
                  >
                    {step.title}
                  </span>
                  <button
                    onClick={() => isNext && !loading && handlers[i]()}
                    disabled={!isNext || loading}
                    className="text-[11px] sm:text-xs font-bold px-3 sm:px-4 py-1.5 rounded-full transition"
                    style={{
                      backgroundColor: isDone
                        ? `${COLORS.accent}55`
                        : isNext
                          ? COLORS.accent
                          : "#F3F4F6",
                      color: isDone || isNext ? COLORS.primary : "#9CA3AF",
                      cursor: isNext && !loading ? "pointer" : "default",
                    }}
                  >
                    {isDone ? "تم" : isNext && loading ? "..." : "ابدأ"}
                  </button>
                </div>
              );
            })}
          </div>
        </div>

        {error && (
          <p className="text-center text-red-500 text-sm mb-6">{error}</p>
        )}

        {/* كروت تفاصيل كل خطوة */}
        <div className="flex flex-col gap-3">
          {STEPS.map((step, i) => {
            const isLive = i === progress - 1;
            const isFuture = i >= progress;

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

                {isLive && request && (
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
                          {request.userId?.fullName?.charAt(0) ?? "؟"}
                        </span>
                        <span
                          className="text-sm font-semibold"
                          style={{ color: COLORS.primary }}
                        >
                          {request.userId?.fullName ?? "-"}
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5 text-sm text-gray-500">
                        <span>{request.address?.fullAddress}</span>
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

        {showInvoiceModal && request && (
          <InvoiceModal
            request={request}
            requestId={requestId}
            onClose={() => setShowInvoiceModal(false)}
            onSubmitted={(updated) => {
              setRequest(updated);
              setProgress(3);
              setShowInvoiceModal(false);
              setShowSuccessModal(true);
            }}
          />
        )}

        {showSuccessModal && (
          <SuccessModal
            onClose={() => setShowSuccessModal(false)}
            onBackToOrders={() => router.push("/technician/orders")}
          />
        )}
      </div>
    </>
  );
}

function SuccessModal({
  onClose,
  onBackToOrders,
}: {
  onClose: () => void;
  onBackToOrders: () => void;
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
          onClick={onClose}
          className="absolute left-8 top-8 text-gray-900 transition hover:opacity-70"
          aria-label="إغلاق"
        >
          <X className="h-5 w-5" />
        </button>

        <h2
          className="mt-8 text-2xl font-extrabold sm:text-3xl"
          style={{ color: COLORS.primary }}
        >
          تم إرسال الفاتورة!
        </h2>

        <p className="mx-auto mt-5 max-w-[310px] text-sm leading-7 text-gray-500">
          تم إرسال الفاتورة إلى العميل لمراجعتها واعتمادها. سيتم إشعارك فور
          اتخاذ أي إجراء.
        </p>

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
          onClick={onBackToOrders}
          className="mt-10 h-[43px] min-w-[196px] rounded-full px-8 text-sm font-bold transition hover:brightness-95"
          style={{ backgroundColor: COLORS.accent, color: COLORS.primary }}
        >
          العودة إلى الطلبات الواردة
        </button>
      </div>
    </div>
  );
}

function InvoiceModal({
  request,
  requestId,
  onClose,
  onSubmitted,
}: {
  request: TechnicianRequest;
  requestId: string;
  onClose: () => void;
  onSubmitted: (updated: TechnicianRequest) => void;
}) {
  const [price, setPrice] = useState("");
  const [hasSupplies, setHasSupplies] = useState(false);
  const [extraMaterialsPrice, setExtraMaterialsPrice] = useState("");
  const [notes, setNotes] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const servicePrice = Number(price) || 0;
  const materialsPrice = hasSupplies ? Number(extraMaterialsPrice) || 0 : 0;
  const total = servicePrice + materialsPrice;

  const handleSubmit = async () => {
    if (!price) {
      setError("من فضلك أدخل سعر الخدمة");
      return;
    }
    setSubmitting(true);
    setError("");
    try {
      const body: Record<string, unknown> = { servicePrice };
      if (notes.trim()) body.completionNote = notes;
      if (hasSupplies) body.extraMaterialsPrice = materialsPrice;

      const res = await fetch(`${BASE_URL}/requests/${requestId}/complete`, {
        method: "PATCH",
        headers: authHeaders(),
        body: JSON.stringify(body),
      });
      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.message || "حصل خطأ في إرسال الفاتورة");
      }
      onSubmitted(json.data);
    } catch (e) {
      setError(e instanceof Error ? e.message : "حصل خطأ، حاول تاني");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 px-4">
      <div dir="rtl" className="bg-white rounded-2xl w-full max-w-md p-6 relative">
        <button
          onClick={onClose}
          className="absolute top-5 left-5 text-gray-400 hover:text-gray-600"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2 mb-1">
          <h2 className="text-lg font-bold" style={{ color: COLORS.primary }}>
            فاتورة الخدمة
          </h2>
          <FileText className="w-4 h-4" style={{ color: COLORS.primary }} />
        </div>
        <p className="text-sm text-gray-400 mb-6">{request.userId?.fullName}</p>

        <div className="flex flex-col gap-5">
          {/* عنوان الخدمة */}
          <div>
            <label className="text-sm text-gray-500 block mb-2">عنوان الخدمة</label>
            <div
              className="flex items-center justify-between rounded-lg px-4 py-3"
              style={{ backgroundColor: COLORS.secondary }}
            >
              <span className="text-sm" style={{ color: COLORS.primary }}>
                {request.serviceId?.name}
              </span>
              <span
                className="w-2 h-2 rounded-full"
                style={{ backgroundColor: COLORS.accent }}
              />
            </div>
          </div>

          {/* السعر النهائي */}
          <div className="flex items-center justify-between gap-3">
            <label className="text-sm text-gray-500 whitespace-nowrap">
              السعر النهائي للخدمة (جنيه)
            </label>
            <div className="flex items-center gap-2 border border-gray-200 rounded-lg px-2 py-1.5 w-32">
              <button
                type="button"
                className="w-7 h-7 rounded-full bg-gray-100 flex items-center justify-center shrink-0"
                title="إرفاق صورة (قريبًا)"
              >
                <Camera className="w-3.5 h-3.5 text-gray-500" />
              </button>
              <input
                type="number"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="0"
                className="w-full text-sm outline-none bg-transparent"
              />
            </div>
          </div>

          {/* مستلزمات اضافية */}
          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <label className="text-sm text-gray-500">مستلزمات اضافية (اختياري)</label>
              <button
                type="button"
                onClick={() => setHasSupplies((v) => !v)}
                className="w-10 h-6 rounded-full p-0.5 flex transition-colors"
                style={{
                  backgroundColor: hasSupplies ? COLORS.accent : "#E5E7EB",
                  justifyContent: hasSupplies ? "flex-end" : "flex-start",
                }}
              >
                <span className="w-5 h-5 rounded-full bg-white shadow" />
              </button>
            </div>

            {hasSupplies && (
              <div className="flex items-center justify-between gap-3">
                <label className="text-sm text-gray-500 whitespace-nowrap">
                  سعر المستلزمات الإضافية (جنيه)
                </label>
                <input
                  type="number"
                  value={extraMaterialsPrice}
                  onChange={(e) => setExtraMaterialsPrice(e.target.value)}
                  placeholder="0"
                  className="w-32 border border-gray-200 rounded-lg px-3 py-1.5 text-sm outline-none"
                />
              </div>
            )}
          </div>

          {/* ملاحظات */}
          <div>
            <label className="text-sm text-gray-500 block mb-2">
              ملاحظات اضافية (اختياري)
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="أي تفاصيل اضافية تود إضافتها..."
              rows={3}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none resize-none"
            />
          </div>

          {/* الإجمالي */}
          <div className="flex items-center justify-between border-t border-gray-100 pt-4">
            <div className="flex items-baseline gap-1">
              <span className="text-2xl font-bold" style={{ color: COLORS.primary }}>
                {total}
              </span>
              <span className="text-sm text-gray-500">جنيه</span>
            </div>
            <span className="text-sm text-gray-500">الإجمالي</span>
          </div>

          {error && <p className="text-red-500 text-sm text-center">{error}</p>}

          <button
            onClick={handleSubmit}
            disabled={submitting}
            className="w-full py-3 rounded-full font-bold text-sm disabled:opacity-50"
            style={{ backgroundColor: COLORS.accent, color: COLORS.primary }}
          >
            {submitting ? "بيتبعت..." : "إرسال الفاتورة"}
          </button>
        </div>
      </div>
    </div>
  );
}