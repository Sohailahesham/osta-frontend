"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { MapPin, Calendar, X, Check } from "lucide-react";
import { api } from "@/api/axios";
import walletIcon from "@/assets/icons/wallet.svg";
import Image from "next/image";

// ─── Types ────────────────────────────────────────────────────────────────────

interface PendingRequest {
  _id: string;
  userId: { _id: string; fullName: string; phone?: string } | null;
  categoryId: { _id: string; name: string };
  serviceId: { _id: string; name: string; description?: string; priceRange?: { min: number; max: number } };
  preferredDate: string;
  preferredTime: string;
  status: string;
  depositAmount: number;
  address: {
    fullAddress: string;
    district: string;
    coordinates?: { lat: number; lng: number };
  };
  notes: string;
  createdAt: string;
  proposals?: { count: number };
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

const formatDate = (dateStr: string) =>
  new Date(dateStr).toLocaleDateString("ar-EG", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

// ─── Success Modal ────────────────────────────────────────────────────────────

function SuccessModal({ onClose }: { onClose: () => void }) {
  const router = useRouter();

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-3xl shadow-xl w-full max-w-sm p-8 flex flex-col items-center text-center relative"
        dir="rtl"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-5 left-5 w-7 h-7 rounded-full flex items-center justify-center text-gray-300 hover:text-gray-500 transition-colors"
        >
          <X size={18} />
        </button>

        <h2 className="text-xl font-bold text-[var(--primary-color)] mb-3">
          تم استلام الطلب بنجاح!
        </h2>
        <p className="text-gray-400 text-sm mb-8 leading-relaxed">
          تم إسناد الطلب إليك بنجاح. يمكنك الآن التواصل مع العميل ومتابعة
          تفاصيل الخدمة.
        </p>

        <div className="w-20 h-20 rounded-full bg-[#F0F9E8] flex items-center justify-center mb-8">
          <div className="w-14 h-14 rounded-full bg-[var(--accent-color)] flex items-center justify-center">
            <Check size={28} className="text-[var(--primary-color)]" strokeWidth={3} />
          </div>
        </div>

        <button
          onClick={() => router.push("/technician/portfolio/pending")}
          className="bg-[var(--accent-color)] text-[var(--primary-color)] font-bold text-sm px-8 py-3 rounded-full hover:opacity-90 transition-all w-full"
        >
          عرض العروض المرسلة
        </button>
      </div>
    </div>
  );
}

// ─── Request Card ─────────────────────────────────────────────────────────────

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
    <div className="bg-white rounded-2xl border border-gray-100 p-5 mb-4" dir="rtl">
      {/* Price tag */}
      {request.serviceId?.priceRange && (
        <div className="flex justify-start mb-3">
          <span className="flex items-center gap-1 text-xs font-bold bg-[var(--secondary-color)] text-[var(--primary-color)] px-3 py-1.5 rounded-full">
              <Image
                src={walletIcon}
                alt="wallet"
                width={14}
                height={14}
              />
            {request.serviceId.priceRange.min}-{request.serviceId.priceRange.max} ج.م
          </span>
        </div>
      )}

      {/* Service name */}
      <h3 className="font-bold text-[var(--primary-color)] text-base mb-2 text-right">
        {request.serviceId?.name}
      </h3>

      {/* Service description */}
      {request.serviceId?.description && (
        <p className="text-sm text-gray-400 text-right mb-2 leading-relaxed">
          {request.serviceId.description}
        </p>
      )}

      {/* Notes */}
      {request.notes && (
        <p className="text-sm text-right mb-4 leading-relaxed">
          <span className="text-gray-400">ملاحظة : </span>
          <span className="text-gray-500">{request.notes}</span>
        </p>
      )}

      {request.userId && (
  <div className="bg-[#F8FAF9] rounded-xl p-4 flex flex-row-reverse items-center justify-between"> 
    
    {/* Accept button */}
    <button
      onClick={() => onAccept(request._id)}
      disabled={accepting === request._id}
      className={`
        min-w-[110px]
        h-10
        rounded-full
        font-bold
        text-sm
        transition-all
        ${
          accepting === request._id
            ? "bg-gray-200 text-gray-400"
            : "bg-[var(--accent-color)] text-[var(--primary-color)]"
        }
      `}
    >
      {accepting === request._id ? "جاري التقديم..." : "تقديم"}
    </button>

    {/* Client Info */}
    <div className="flex items-start gap-3">
      
      {/* Avatar */}
      <div className="w-10 h-10 rounded-full bg-[#D9F06A] flex items-center justify-center shrink-0">
        <span className="font-bold text-[var(--primary-color)]">
          {request.userId.fullName?.charAt(0) ?? "؟"}
        </span>
      </div>

      <div className="text-right">
        <h3 className="font-bold text-[var(--primary-color)] text-base">
          {request.userId.fullName}
        </h3>

        <p className="text-xs text-gray-500 mb-2">
          عميل موثق
        </p>

        <div className="flex items-center justify-end gap-4 text-xs text-gray-400">
          
          <div className="flex items-center gap-1">
            <MapPin
              size={13}
              className="text-[var(--accent-color)]"
            />
            <span>
              {request.address?.city} {request.address?.district}
            </span>
          </div>

          <div className="flex items-center gap-1">
            <Calendar
              size={13}
              className="text-[var(--accent-color)]"
            />
            <span>{formatDate(request.preferredDate)}</span>
          </div>

        </div>
      </div>
    </div>
  </div>
)}


    </div>
  );
}

// ─── Sidebar tip ──────────────────────────────────────────────────────────────

function TipCard() {
  return (
    <div
      className="rounded-2xl p-5 text-white h-fit"
      style={{ background: "linear-gradient(to bottom, #1C4B41, #112D27)" }}
      dir="rtl"
    >
      <div className="flex justify-end mb-3">
        <span className="text-xs bg-white/20 px-2 py-1 rounded-full">نصيحة احترافية</span>
      </div>
      <h3 className="font-bold text-lg mb-2 text-right leading-snug">
        عروض مفضلة = فرص قبول أعلى
      </h3>
      <p className="text-sm text-white/80 text-right leading-relaxed mb-4">
        اكتب عرضاً واضحاً يوضح خطوات العمل، الوقت المتوقع، والمواد المستخدمة لزيادة ثقة العميل.
      </p>
      <button className="flex items-center gap-1 bg-[var(--accent-color)] text-[var(--primary-color)] text-sm font-bold px-4 py-2 rounded-full">
        <span>↗</span>
        <span>اعرف المزيد</span>
      </button>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

type Tab = "popular" | "custom";

export default function TechnicianRequestsPage() {
  const [activeTab, setActiveTab] = useState<Tab>("popular");
  const [requests, setRequests] = useState<PendingRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [accepting, setAccepting] = useState<string | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    if (activeTab === "popular") {
      setLoading(true);
      api
        .get("/requests/pending")
        .then((res) => setRequests(res.data.data))
        .catch(console.error)
        .finally(() => setLoading(false));
    }
  }, [activeTab]);

  const handleAccept = async (requestId: string) => {
    setAccepting(requestId);
    try {
      await api.patch(`/requests/${requestId}/accept`);
      setRequests((prev) => prev.filter((r) => r._id !== requestId));
      setShowSuccess(true);
    } catch (err) {
      console.error(err);
    } finally {
      setAccepting(null);
    }
  };

  return (
    <div className="min-h-screen bg-[#f7f7f5] p-6">
      {/* Tabs */}
<div className="mb-6">
  <div className="flex w-full bg-[#E9EEEA] rounded-full p-1">

    <button
      onClick={() => setActiveTab("popular")}
      className={`flex-1 h-14 rounded-full font-bold text-xl transition-all
        ${
          activeTab === "popular"
            ? "bg-[var(--primary-color)] text-white border-2 border-[var(--accent-color)]"
            : "text-[var(--primary-color)]"
        }`}
    >
      الخدمات الشائعة
    </button>

        
    <button
      onClick={() => setActiveTab("custom")}
      className={`flex-1 h-14 rounded-full font-bold text-xl transition-all
        ${
          activeTab === "custom"
            ? "bg-[var(--primary-color)] text-white border-2 border-[var(--accent-color)]"
            : "text-[var(--primary-color)]"
        }`}
    >
      الخدمات المخصصة
    </button>

  </div>
</div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Content */}
        <div className="lg:col-span-3">
          {activeTab === "popular" ? (
            <>
              {/* Count */}
              {!loading && (
                <p className="text-sm text-gray-400 mb-4">
                  عرض {requests.length} طلب خدمة متاح
                </p>
              )}

              {loading ? (
                <div className="flex items-center justify-center py-20">
                  <div className="w-8 h-8 rounded-full border-4 border-[var(--accent-color)] border-t-transparent animate-spin" />
                </div>
              ) : requests.length === 0 ? (
                <p className="text-gray-400 text-sm text-center py-20">
                  لا توجد طلبات متاحة الآن
                </p>
              ) : (
                requests.map((req) => (
                  <RequestCard
                    key={req._id}
                    request={req}
                    onAccept={handleAccept}
                    accepting={accepting}
                  />
                ))
              )}
            </>
          ) : (
            <div className="flex items-center justify-center py-32">
              <div className="text-center">
                <p className="text-4xl mb-4">🔧</p>
                <p className="text-xl font-bold text-[var(--primary-color)] mb-2">
                  قريباً
                </p>
                <p className="text-sm text-gray-400">
                  الخدمات المخصصة ستكون متاحة قريباً
                </p>
              </div>
            </div>
          )}
        </div>
        {/* Sidebar */}
        <div className="lg:col-span-1">
          <TipCard />
        </div>
      </div>

      {showSuccess && <SuccessModal onClose={() => setShowSuccess(false)} />}
    </div>
  );
}