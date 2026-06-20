"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Calendar, Check, MapPin, X } from "lucide-react";
import Image from "next/image";
import { api } from "@/api/axios";
import walletIcon from "@/assets/icons/wallet.svg";
import arrowIcon from "@/assets/icons/arrow.svg";
import Button from "@/components/ui/Button";

interface PendingRequest {
  _id: string;
  userId: { _id: string; fullName: string; phone?: string } | null;
  categoryId: { _id: string; name: string };
  serviceId: {
    _id: string;
    name: string;
    description?: string;
    priceRange?: { min: number; max: number };
  };
  preferredDate: string;
  preferredTime: string;
  status: string;
  depositAmount: number;
  address: {
    fullAddress: string;
    district: string;
    city?: string;
    coordinates?: { lat: number; lng: number };
  };
  notes: string;
  createdAt: string;
}

interface CustomRequest {
  _id: string;
  title: string;
  description: string;
  budget: number | null;
  preferredDate: string;
  preferredTime: string;
  isEmergency?: boolean;
  image?: string | null;
  createdAt: string;
  userId: { _id: string; fullName: string } | null;
  categoryId: { _id: string; name: string } | null;
  address: {
    fullAddress: string;
    district: string;
    city?: string;
    coordinates?: { lat: number; lng: number };
  };
}

type Tab = "popular" | "custom";

const formatDate = (dateStr: string) =>
  new Date(dateStr).toLocaleDateString("ar-EG", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

function SuccessModal({
  title,
  description,
  onClose,
}: {
  title: string;
  description: string;
  onClose: () => void;
}) {
  const router = useRouter();

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4"
      onClick={onClose}
    >
      <div
        className="relative flex w-full max-w-sm flex-col items-center rounded-3xl bg-white p-8 text-center shadow-xl"
        dir="rtl"
        onClick={(event) => event.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute left-5 top-5 flex h-7 w-7 items-center justify-center rounded-full text-gray-300 transition-colors hover:text-gray-500"
          aria-label="إغلاق"
        >
          <X size={18} />
        </button>
        <h2 className="mb-3 text-xl font-bold text-[var(--primary-color)]">
          {title}
        </h2>
        <p className="mb-8 text-sm leading-relaxed text-gray-400">
          {description}
        </p>
        <div className="mb-8 flex h-20 w-20 items-center justify-center rounded-full bg-[#F0F9E8]">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[var(--accent-color)]">
            <Check
              size={28}
              className="text-[var(--primary-color)]"
              strokeWidth={3}
            />
          </div>
        </div>
        <button
          onClick={() => router.push("/technician/portfolio/pending")}
          className="w-full rounded-full bg-[var(--accent-color)] px-8 py-3 text-sm font-bold text-[var(--primary-color)] transition-all hover:opacity-90"
        >
          عرض الطلبات المسندة
        </button>
      </div>
    </div>
  );
}

function ProposalModal({
  request,
  submitting,
  onClose,
  onSubmit,
}: {
  request: CustomRequest;
  submitting: boolean;
  onClose: () => void;
  onSubmit: (payload: {
    price: number;
    estimatedTime: string;
    description: string;
  }) => Promise<void>;
}) {
  const [price, setPrice] = useState("");
  const [estimatedTime, setEstimatedTime] = useState("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async () => {
    const parsedPrice = Number(price);

    if (!Number.isFinite(parsedPrice) || parsedPrice <= 0) {
      setError("من فضلك أدخل سعراً صحيحاً.");
      return;
    }

    if (!estimatedTime.trim()) {
      setError("من فضلك أدخل الوقت المتوقع.");
      return;
    }

    setError(null);
    await onSubmit({
      price: parsedPrice,
      estimatedTime: estimatedTime.trim(),
      description: description.trim(),
    });
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/45 px-4"
      onClick={onClose}
    >
      <div
        dir="rtl"
        className="w-full max-w-xl rounded-[28px] bg-white p-6 shadow-2xl"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-4">
          <button
            type="button"
            onClick={onClose}
            className="rounded-full p-2 text-[#A7B2AF] transition hover:bg-[#F6F8F7] hover:text-[#526661]"
            aria-label="إغلاق"
          >
            <X size={18} />
          </button>
          <div className="text-right">
            <h3 className="text-xl font-bold text-[var(--primary-color)]">
              تقديم عرض على خدمة مخصصة
            </h3>
            <p className="mt-2 text-sm leading-7 text-[#73837E]">
              {request.title}
            </p>
          </div>
        </div>

        <div className="mt-5 grid grid-cols-1 gap-4 md:grid-cols-2">
          <label className="text-right">
            <span className="mb-2 block text-sm font-semibold text-[var(--primary-color)]">
              السعر المقترح
            </span>
            <input
              type="number"
              min="1"
              value={price}
              onChange={(event) => setPrice(event.target.value)}
              className="h-12 w-full rounded-2xl border border-[#DDE5E2] px-4 text-right outline-none transition focus:border-[var(--accent-color)]"
              placeholder="مثال: 350"
            />
          </label>

          <label className="text-right">
            <span className="mb-2 block text-sm font-semibold text-[var(--primary-color)]">
              الوقت المتوقع
            </span>
            <input
              type="text"
              value={estimatedTime}
              onChange={(event) => setEstimatedTime(event.target.value)}
              className="h-12 w-full rounded-2xl border border-[#DDE5E2] px-4 text-right outline-none transition focus:border-[var(--accent-color)]"
              placeholder="مثال: ساعتان"
            />
          </label>
        </div>

        <label className="mt-4 block text-right">
          <span className="mb-2 block text-sm font-semibold text-[var(--primary-color)]">
            تفاصيل العرض
          </span>
          <textarea
            value={description}
            onChange={(event) => setDescription(event.target.value)}
            rows={5}
            className="w-full rounded-2xl border border-[#DDE5E2] px-4 py-3 text-right outline-none transition focus:border-[var(--accent-color)]"
            placeholder="اكتب للعميل خطوات التنفيذ والمواد المطلوبة وما الذي يميز عرضك."
          />
        </label>

        {error ? <p className="mt-3 text-sm text-red-500">{error}</p> : null}

        <div className="mt-6 flex flex-col-reverse gap-3 md:flex-row md:justify-start">
          <button
            type="button"
            onClick={onClose}
            className="h-12 rounded-full border border-[#DDE5E2] px-6 font-bold text-[var(--primary-color)] transition hover:bg-[#F7F9F8]"
          >
            إلغاء
          </button>
          <button
            type="button"
            onClick={() => void handleSubmit()}
            disabled={submitting}
            className="h-12 rounded-full bg-[var(--accent-color)] px-6 font-bold text-[var(--primary-color)] transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {submitting ? "جارٍ إرسال العرض..." : "إرسال العرض"}
          </button>
        </div>
      </div>
    </div>
  );
}

function RequestCard({
  request,
  onAccept,
  accepting,
}: {
  request: PendingRequest;
  onAccept: (id: string) => void;
  accepting: string | null;
}) {
  return (
    <div className="mb-4 rounded-2xl border border-gray-100 bg-white p-5" dir="rtl">
      {request.serviceId?.priceRange ? (
        <div className="mb-3 flex justify-start">
          <span className="flex items-center gap-1 rounded-full bg-[var(--secondary-color)] px-3 py-1.5 text-xs font-bold text-[var(--primary-color)]">
            <Image src={walletIcon} alt="wallet" width={14} height={14} />
            {request.serviceId.priceRange.min}-{request.serviceId.priceRange.max} ج.م
          </span>
        </div>
      ) : null}

      <h3 className="mb-2 text-right text-base font-bold text-[var(--primary-color)]">
        {request.serviceId?.name}
      </h3>

      {request.serviceId?.description ? (
        <p className="mb-2 text-right text-sm leading-relaxed text-gray-400">
          {request.serviceId.description}
        </p>
      ) : null}

      {request.notes ? (
        <p className="mb-4 text-right text-sm leading-relaxed">
          <span className="text-gray-400">ملاحظة: </span>
          <span className="text-gray-500">{request.notes}</span>
        </p>
      ) : null}

      {request.userId ? (
        <div className="flex flex-row-reverse items-center justify-between rounded-xl bg-[#F8FAF9] p-4">
          <button
            onClick={() => onAccept(request._id)}
            disabled={accepting === request._id}
            className={`h-10 min-w-[110px] rounded-full text-sm font-bold transition-all ${
              accepting === request._id
                ? "bg-gray-200 text-gray-400"
                : "bg-[var(--accent-color)] text-[var(--primary-color)]"
            }`}
          >
            {accepting === request._id ? "جارٍ التقديم..." : "تقديم"}
          </button>

          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#D9F06A]">
              <span className="font-bold text-[var(--primary-color)]">
                {request.userId.fullName?.charAt(0) ?? "؟"}
              </span>
            </div>
            <div className="text-right">
              <h3 className="text-base font-bold text-[var(--primary-color)]">
                {request.userId.fullName}
              </h3>
              <p className="mb-2 text-xs text-gray-500">عميل موثق</p>
              <div className="flex items-center justify-end gap-4 text-xs text-gray-400">
                <div className="flex items-center gap-1">
                  <MapPin size={13} className="text-[var(--accent-color)]" />
                  <span>{request.address?.district}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Calendar size={13} className="text-[var(--accent-color)]" />
                  <span>{formatDate(request.preferredDate)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}

function CustomRequestCard({
  request,
  onApply,
  applying,
}: {
  request: CustomRequest;
  onApply: (request: CustomRequest) => void;
  applying: boolean;
}) {
  return (
    <div className="mb-4 rounded-2xl border border-gray-100 bg-white p-5" dir="rtl">
      <div className="mb-3 flex items-center justify-between gap-3">
        <span className="rounded-full bg-[#F1F7E7] px-3 py-1.5 text-xs font-bold text-[var(--primary-color)]">
          {request.categoryId?.name ?? "خدمة مخصصة"}
        </span>
        {typeof request.budget === "number" ? (
          <span className="flex items-center gap-1 rounded-full bg-[var(--secondary-color)] px-3 py-1.5 text-xs font-bold text-[var(--primary-color)]">
            <Image src={walletIcon} alt="wallet" width={14} height={14} />
            {request.budget} ج.م
          </span>
        ) : null}
      </div>

      <h3 className="text-right text-base font-bold text-[var(--primary-color)]">
        {request.title}
      </h3>
      <p className="mt-2 text-right text-sm leading-relaxed text-gray-500">
        {request.description}
      </p>

      <div className="mt-4 flex flex-wrap items-center justify-end gap-4 text-xs text-gray-400">
        <div className="flex items-center gap-1">
          <MapPin size={13} className="text-[var(--accent-color)]" />
          <span>{request.address?.district ?? request.address?.fullAddress}</span>
        </div>
        <div className="flex items-center gap-1">
          <Calendar size={13} className="text-[var(--accent-color)]" />
          <span>{formatDate(request.preferredDate)}</span>
        </div>
      </div>

      <div className="mt-4 rounded-xl bg-[#F8FAF9] p-4">
        <div className="flex flex-row-reverse items-center justify-between gap-4">
          <button
            type="button"
            onClick={() => onApply(request)}
            disabled={applying}
            className="min-w-[120px] rounded-full bg-[var(--accent-color)] px-4 py-2.5 text-sm font-bold text-[var(--primary-color)] transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {applying ? "جارٍ التجهيز..." : "تقديم عرض"}
          </button>

          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#D9F06A]">
              <span className="font-bold text-[var(--primary-color)]">
                {request.userId?.fullName?.charAt(0) ?? "؟"}
              </span>
            </div>
            <div className="text-right">
              <h3 className="text-base font-bold text-[var(--primary-color)]">
                {request.userId?.fullName ?? "عميل"}
              </h3>
              <p className="text-xs text-gray-500">
                {request.isEmergency ? "طلب طارئ" : "طلب مخصص"}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function TipCard() {
  return (
    <div
      className="h-fit rounded-2xl p-5 text-white"
      style={{ background: "linear-gradient(to bottom, #1C4B41, #112D27)" }}
      dir="rtl"
    >
      <div className="mb-3 flex">
        <span className="rounded-full bg-white/20 px-2 py-1 text-xs">
          نصيحة احترافية
        </span>
      </div>
      <h3 className="mb-2 text-right text-lg font-bold leading-snug">
        عروض مفضلة = فرص قبول أعلى
      </h3>
      <p className="mb-4 text-right text-sm leading-relaxed text-white/80">
        اكتب عرضاً واضحاً يوضح خطوات العمل والوقت المتوقع والمواد المستخدمة
        لزيادة ثقة العميل.
      </p>
      <Button fullWidth className="flex items-center justify-center gap-2">
        اعرف المزيد
        <Image src={arrowIcon} alt="other" width={14} height={14} />
      </Button>
    </div>
  );
}

export default function TechnicianRequestsPage() {
  const [activeTab, setActiveTab] = useState<Tab>("popular");
  const [popularRequests, setPopularRequests] = useState<PendingRequest[]>([]);
  const [customRequests, setCustomRequests] = useState<CustomRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [accepting, setAccepting] = useState<string | null>(null);
  const [selectedCustomRequest, setSelectedCustomRequest] =
    useState<CustomRequest | null>(null);
  const [submittingProposal, setSubmittingProposal] = useState(false);
  const [successContent, setSuccessContent] = useState<{
    title: string;
    description: string;
  } | null>(null);

  useEffect(() => {
    const loadRequests = async () => {
      setLoading(true);

      try {
        if (activeTab === "popular") {
          const response = await api.get("/requests/pending");
          setPopularRequests(response.data.data ?? []);
        } else {
          const response = await api.get("/posts");
          setCustomRequests(response.data.data ?? []);
        }
      } catch (error) {
        console.error(error);
        if (activeTab === "popular") {
          setPopularRequests([]);
        } else {
          setCustomRequests([]);
        }
      } finally {
        setLoading(false);
      }
    };

    void loadRequests();
  }, [activeTab]);

  const handleAccept = async (requestId: string) => {
    setAccepting(requestId);

    try {
      await api.patch(`/requests/${requestId}/accept`);
      setPopularRequests((prev) => prev.filter((request) => request._id !== requestId));
      setSuccessContent({
        title: "تم استلام الطلب بنجاح!",
        description:
          "تم إسناد الطلب إليك بنجاح. يمكنك الآن التواصل مع العميل ومتابعة تفاصيل الخدمة.",
      });
    } catch (error) {
      console.error(error);
    } finally {
      setAccepting(null);
    }
  };

  const handleProposalSubmit = async (payload: {
    price: number;
    estimatedTime: string;
    description: string;
  }) => {
    if (!selectedCustomRequest) return;

    setSubmittingProposal(true);

    try {
      await api.post(`/posts/${selectedCustomRequest._id}/proposals`, payload);
      setCustomRequests((prev) =>
        prev.filter((request) => request._id !== selectedCustomRequest._id),
      );
      setSelectedCustomRequest(null);
      setSuccessContent({
        title: "تم إرسال العرض بنجاح!",
        description:
          "تم إرسال عرضك إلى العميل. ستظهر لك الخدمة في الطلبات المسندة إذا تم قبول العرض.",
      });
    } catch (error) {
      console.error(error);
    } finally {
      setSubmittingProposal(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f7f7f5] p-6">
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-4">
        <div className="lg:col-span-3">
          <div className="mb-6">
            <div className="flex w-full rounded-full bg-[#E9EEEA] p-1">
              <button
                onClick={() => setActiveTab("popular")}
                className={`h-12 flex-1 rounded-full text-base font-bold transition-all ${
                  activeTab === "popular"
                    ? "border-2 border-[var(--accent-color)] bg-[var(--primary-color)] text-white"
                    : "text-[var(--primary-color)]"
                }`}
              >
                الخدمات الشائعة
              </button>
              <button
                onClick={() => setActiveTab("custom")}
                className={`h-12 flex-1 rounded-full text-base font-bold transition-all ${
                  activeTab === "custom"
                    ? "border-2 border-[var(--accent-color)] bg-[var(--primary-color)] text-white"
                    : "text-[var(--primary-color)]"
                }`}
              >
                الخدمات المخصصة
              </button>
            </div>
          </div>

          {activeTab === "popular" ? (
            <>
              {!loading ? (
                <p className="mb-4 text-sm text-gray-400" dir="rtl">
                  عرض {popularRequests.length} طلب خدمة متاح
                </p>
              ) : null}

              {loading ? (
                <div className="flex items-center justify-center py-20">
                  <div className="h-8 w-8 animate-spin rounded-full border-4 border-[var(--accent-color)] border-t-transparent" />
                </div>
              ) : popularRequests.length === 0 ? (
                <p className="py-20 text-center text-sm text-gray-400">
                  لا توجد طلبات متاحة الآن
                </p>
              ) : (
                popularRequests.map((request) => (
                  <RequestCard
                    key={request._id}
                    request={request}
                    onAccept={handleAccept}
                    accepting={accepting}
                  />
                ))
              )}
            </>
          ) : (
            <>
              {!loading ? (
                <p className="mb-4 text-sm text-gray-400" dir="rtl">
                  عرض {customRequests.length} خدمة مخصصة متاحة
                </p>
              ) : null}

              {loading ? (
                <div className="flex items-center justify-center py-20">
                  <div className="h-8 w-8 animate-spin rounded-full border-4 border-[var(--accent-color)] border-t-transparent" />
                </div>
              ) : customRequests.length === 0 ? (
                <p className="py-20 text-center text-sm text-gray-400">
                  لا توجد خدمات مخصصة متاحة الآن
                </p>
              ) : (
                customRequests.map((request) => (
                  <CustomRequestCard
                    key={request._id}
                    request={request}
                    applying={
                      submittingProposal &&
                      selectedCustomRequest?._id === request._id
                    }
                    onApply={setSelectedCustomRequest}
                  />
                ))
              )}
            </>
          )}
        </div>

        <div className="lg:col-span-1">
          <TipCard />
        </div>
      </div>

      {successContent ? (
        <SuccessModal
          title={successContent.title}
          description={successContent.description}
          onClose={() => setSuccessContent(null)}
        />
      ) : null}

      {selectedCustomRequest ? (
        <ProposalModal
          request={selectedCustomRequest}
          submitting={submittingProposal}
          onClose={() => {
            if (submittingProposal) return;
            setSelectedCustomRequest(null);
          }}
          onSubmit={handleProposalSubmit}
        />
      ) : null}
    </div>
  );
}
