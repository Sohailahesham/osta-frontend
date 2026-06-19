"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Camera, Check, FileText, X } from "lucide-react";
import { COLORS } from "@/constants/tracking";
import { trackingApi } from "@/api/services/tracking.service";
import type { TechnicianRequest } from "@/types/tracking.types";

interface Props {
  request: TechnicianRequest;
  requestId: string;
  onClose: () => void;
  onSubmitted: (updated: TechnicianRequest) => void;
}

export default function InvoiceModal({
  request,
  requestId,
  onClose,
  onSubmitted,
}: Props) {
  const router = useRouter();
  const [price, setPrice] = useState("");
  const [hasSupplies, setHasSupplies] = useState(false);
  const [extraMaterialsPrice, setExtraMaterialsPrice] = useState("");
  const [notes, setNotes] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const servicePrice = Number(price) || 0;
  const materialsPrice = hasSupplies ? Number(extraMaterialsPrice) || 0 : 0;
  const total = servicePrice + materialsPrice;

  const handleSubmit = async () => {
    const parsedServicePrice = Number(price);

    if (
      !price.trim() ||
      Number.isNaN(parsedServicePrice) ||
      parsedServicePrice <= 0
    ) {
      setError("سعر الخدمة مطلوب");
      return;
    }

    setSubmitting(true);
    setError("");

    try {
      const body: {
        servicePrice: number;
        completionNote?: string;
        extraMaterialsPrice?: number;
      } = {
        servicePrice: parsedServicePrice,
      };

      if (notes.trim()) {
        body.completionNote = notes.trim();
      }

      if (hasSupplies && extraMaterialsPrice.trim()) {
        body.extraMaterialsPrice = Number(extraMaterialsPrice) || 0;
      }

      const updated = await trackingApi.complete(requestId, body);
      onSubmitted(updated);
      setSubmitted(true);
    } catch (e) {
      setError(e instanceof Error ? e.message : "حصل خطأ، حاول تاني");
    } finally {
      setSubmitting(false);
    }
  };

  const goToOrders = () => {
    router.push("/technician/orders");
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[rgba(32,71,52,0.72)] px-4">
      <div
        dir="rtl"
        className={`relative w-full rounded-[32px] bg-white p-8 shadow-2xl ${
          submitted ? "max-w-lg" : "max-w-4xl"
        }`}
      >
        <button
          onClick={onClose}
          className="absolute left-8 top-8 text-gray-700 transition-colors hover:text-[var(--primary-color)]"
          aria-label="إغلاق"
        >
          <X className="h-5 w-5" />
        </button>

        {submitted ? (
          <div className="flex flex-col items-center px-4 pb-2 pt-12 text-center">
            <h2 className="text-3xl font-extrabold text-[var(--primary-color)]">
              تم إرسال الفاتورة!
            </h2>
            <p className="mt-5 max-w-md text-sm leading-7 text-[var(--gray-color)]">
              تم إرسال الفاتورة إلى العميل لمراجعتها واعتمادها. سيتم إشعارك فور
              اتخاذ أي إجراء.
            </p>

            <div className="my-8 flex h-32 w-32 items-center justify-center rounded-full bg-[rgba(179,231,24,0.22)]">
              <div className="flex h-24 w-24 items-center justify-center rounded-full bg-[var(--accent-color)] text-[var(--primary-color)]">
                <Check className="h-10 w-10 stroke-[3]" />
              </div>
            </div>

            <button
              type="button"
              onClick={goToOrders}
              className="min-w-64 rounded-full bg-[var(--accent-color)] px-8 py-3 text-sm font-extrabold text-[var(--primary-color)] shadow-[0_12px_24px_rgba(179,231,24,0.24)]"
            >
              العودة إلى الطلبات الواردة
            </button>
          </div>
        ) : (
          <div>
              <div className="border-b border-gray-200">
                <div className="mb-1 flex items-center gap-2">
                  <h2
                    className="text-xl font-bold"
                    style={{ color: COLORS.primary }}
                  >
                    فاتورة الخدمة
                  </h2>
                  <FileText
                    className="h-4 w-4"
                    style={{ color: COLORS.primary }}
                  />
                </div>
                <p className="mb-6 text-sm text-gray-400">
                  {request.userId?.fullName}
                </p>
              </div>
              <div className="mx-auto max-w-2xl">
                <div className="flex flex-col gap-5 pt-5">
                  <div>
                    <label className="mb-2 block text-sm text-gray-500">
                      عنوان الخدمة
                    </label>
                    <div className="flex items-center justify-between rounded-lg px-4 py-3 bg-[#F8FAF9]">
                      <span
                        className="text-sm"
                        style={{ color: COLORS.primary }}
                      >
                        {request.serviceId?.name}
                      </span>
                      <span
                        className="h-2 w-2 rounded-full"
                        style={{ backgroundColor: COLORS.accent }}
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-between gap-3">
                    <label className="text-sm text-gray-500">
                      السعر النهائي للخدمة (جنيه)
                    </label>
                    <div className="flex w-40 items-center gap-2 rounded-lg border border-gray-200 px-2 py-1.5">
                      <button
                        type="button"
                        className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-gray-100"
                        title="إرفاق صورة"
                      >
                        <Camera className="h-3.5 w-3.5 text-gray-500" />
                      </button>
                      <input
                        type="number"
                        min="1"
                        value={price}
                        onChange={(e) => setPrice(e.target.value)}
                        placeholder="0"
                        className="w-full bg-transparent text-sm outline-none"
                      />
                    </div>
                  </div>

                  <div className="flex flex-col gap-3">
                    <div className="flex items-center justify-between">
                      <label className="text-sm text-gray-500">
                        مستلزمات إضافية (اختياري)
                      </label>
                      <button
                        type="button"
                        onClick={() => setHasSupplies((value) => !value)}
                        className="flex h-6 w-10 rounded-full p-0.5 transition-colors"
                        style={{
                          backgroundColor: hasSupplies
                            ? COLORS.accent
                            : "#E5E7EB",
                          justifyContent: hasSupplies
                            ? "flex-end"
                            : "flex-start",
                        }}
                      >
                        <span className="h-5 w-5 rounded-full bg-white shadow" />
                      </button>
                    </div>

                    {hasSupplies && (
                      <div className="flex flex-col gap-1.5">
                        <label className="text-sm text-gray-500 mt-3">
                          سعر المستلزمات الإضافية (جنيه)
                        </label>
                        <input
                          type="number"
                          min="0"
                          value={extraMaterialsPrice}
                          onChange={(e) =>
                            setExtraMaterialsPrice(e.target.value)
                          }
                          placeholder="0"
                          className="w-full rounded-lg border border-gray-200 px-3 py-1.5 text-sm outline-none"
                        />
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="mb-2 block text-sm text-gray-500">
                      ملاحظات إضافية (اختياري)
                    </label>
                    <textarea
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      placeholder="أي تفاصيل إضافية تود إضافتها..."
                      rows={3}
                      className="w-full resize-none rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none"
                    />
                  </div>

                  <div className="flex items-center justify-between border-t bg-[#F8FAF9] rounded-lg p-3 border-gray-100 pt-4">
                    <div className="flex items-baseline gap-1">
                      <span className="text-3xl font-bold ">{total}</span>
                      <span className="text-sm text-gray-500">جنيه</span>
                    </div>
                    <span className="text-sm text-gray-500">الإجمالي</span>
                  </div>

                  {error && (
                    <p className="text-center text-sm text-red-500">{error}</p>
                  )}
                </div>

                <button
                  onClick={handleSubmit}
                  disabled={submitting}
                  className="w-full rounded-full py-3 text-sm font-bold disabled:opacity-50"
                  style={{
                    backgroundColor: COLORS.accent,
                    color: COLORS.primary,
                  }}
                >
                  {submitting ? "بيتبعث..." : "إرسال الفاتورة"}
                </button>
              </div>
            </div>
        )}
      </div>
    </div>
  );
}
