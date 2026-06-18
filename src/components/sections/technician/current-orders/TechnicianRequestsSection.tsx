"use client";

import { useEffect, useState } from "react";
import { MapPin, Calendar, Filter, ChevronDown } from "lucide-react";
import { api } from "@/api/axios";

// ─── Types ────────────────────────────────────────────────────────────────────

interface PendingRequest {
  _id: string;
  userId: { _id: string; fullName: string; phone?: string } | null;
  categoryId: { _id: string; name: string };
  serviceId: { _id: string; name: string };
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
    <div className="bg-white rounded-2xl border border-gray-100 p-5 mb-4 shadow-sm">
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2">
          {request.proposals && request.proposals.count > 0 && (
            <span className="text-xs text-gray-400 flex items-center gap-1">
              <span>👥</span>
              {request.proposals.count} عروض مقدمة
            </span>
          )}
        </div>
        <div className="text-right">
          <h3 className="font-bold text-[var(--primary-color)] text-base mb-0.5">
            {request.serviceId?.name}
          </h3>
          <p className="text-xs text-gray-400">{request.categoryId?.name}</p>
        </div>
      </div>

      {/* Description / Notes */}
      {request.notes && (
        <p className="text-sm text-[var(--primary-color)] text-right mb-3 leading-relaxed line-clamp-2">
          ملاحظة : {" "}
          <span className="text-gray-600">{request.notes} </span>
        </p>
      )}

      {/* Client info */}
      {request.userId && (
        <div className="flex items-center justify-end gap-2 mb-3">
          <div className="text-right">
            <p className="text-sm font-semibold text-[var(--primary-color)]">
              {request.userId.fullName}
            </p>
            <p className="text-xs text-gray-400">عميل موثق</p>
          </div>
          <div className="w-8 h-8 rounded-full bg-[var(--primary-color)] flex items-center justify-center text-white text-xs font-bold">
            {request.userId.fullName?.charAt(0) ?? "؟"}
          </div>
        </div>
      )}

      {/* Meta */}
      <div className="flex flex-wrap items-center gap-3 mb-4 justify-end">
        <div className="flex items-center gap-1 text-xs text-gray-500">
          <span>{formatDate(request.preferredDate)}</span>
          <Calendar size={12} className="text-[var(--accent-color)]" />
        </div>
        <div className="flex items-center gap-1 text-xs text-gray-500">
          <span>{request.address?.district}</span>
          <MapPin size={12} className="text-[var(--accent-color)]" />
        </div>
      </div>

      {/* Accept button */}
      <button
        onClick={() => onAccept(request._id)}
        disabled={accepting === request._id}
        className={`w-full py-2.5 rounded-full text-sm font-bold transition-all
          ${accepting === request._id
            ? "bg-gray-100 text-gray-400 cursor-not-allowed"
            : "bg-[var(--accent-color)] text-[var(--primary-color)] hover:opacity-90"
          }`}
      >
        {accepting === request._id ? "جاري التقديم..." : "تقديم"}
      </button>
    </div>
  );
}

// ─── Sidebar tip ──────────────────────────────────────────────────────────────

function TipCard() {
  return (
    <div
      className="rounded-2xl p-5 text-white h-fit"
      style={{ background: "linear-gradient(to bottom, #1C4B41, #112D27)" }}
    >
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs bg-white/20 px-2 py-1 rounded-full">نصيحة احترافية</span>
      </div>
      <h3 className="font-bold text-lg mb-2 text-right leading-snug">
        عروض مفضلة = فرص قبول أعلى
      </h3>
      <p className="text-sm text-white/80 text-right leading-relaxed mb-4">
        اكتب عرضاً واضحاً يوضح خطوات العمل، الوقت المتوقع، والمواد المستخدمة لزيادة ثقة العميل.
      </p>
      <button className="flex items-center gap-1 bg-[var(--accent-color)] text-[var(--primary-color)] text-sm font-bold px-4 py-2 rounded-full">
        <span>اعرف المزيد</span>
        <span>↗</span>
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
  const [city, setCity] = useState("القاهرة");

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
      // شيل الريكوست من القائمة بعد القبول
      setRequests((prev) => prev.filter((r) => r._id !== requestId));
    } catch (err) {
      console.error(err);
    } finally {
      setAccepting(null);
    }
  };

  return (
    <div className="min-h-screen bg-[#f5f5f0] p-6" dir="ltr">
      {/* Tabs + Filter */}
      <div className="flex items-center justify-between mb-6">
        <button className="flex items-center gap-1 text-sm text-gray-500 border border-gray-200 bg-white px-3 py-2 rounded-full">
          <Filter size={14} />
          <span>{city}</span>
          <ChevronDown size={14} />
        </button>

        <div className="flex bg-white rounded-full p-1 border border-gray-100 gap-1">
          <button
            onClick={() => setActiveTab("popular")}
            className={`px-5 py-2 rounded-full text-sm font-semibold transition-all
              ${activeTab === "popular"
                ? "bg-[var(--primary-color)] text-white"
                : "text-gray-500 hover:text-gray-700"
              }`}
          >
            الخدمات الشائعة
          </button>
          <button
            onClick={() => setActiveTab("custom")}
            className={`px-5 py-2 rounded-full text-sm font-semibold transition-all
              ${activeTab === "custom"
                ? "bg-[var(--primary-color)] text-white"
                : "text-gray-500 hover:text-gray-700"
              }`}
          >
            الخدمات المخصصة
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar */}
        <div className="lg:col-span-1">
          <TipCard />
        </div>

        {/* Content */}
        <div className="lg:col-span-3">
          {activeTab === "popular" ? (
            <>
              {/* Count */}
              {!loading && (
                <p className="text-sm text-gray-400 text-left mb-4">
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
      </div>
    </div>
  );
}