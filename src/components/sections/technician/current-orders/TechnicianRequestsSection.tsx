"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { MapPin, Calendar, X, Check, Clock, Users, Eye } from "lucide-react";
import { api } from "@/api/axios";
import walletIcon from "@/assets/icons/wallet.svg";
import arrowIcon from "@/assets/icons/arrow.svg";
import Button from "@/components/ui/Button";
import Image from "next/image";

type Tab = "popular" | "custom";

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
  proposals?: { count: number };
}

interface CustomPost {
  _id: string;
  userId: { _id: string; fullName: string; phone?: string } | null;
  categoryId: { _id: string; name: string } | null;
  title?: string;
  description: string;
  address: { fullAddress: string; district: string };
  preferredDate: string;
  preferredTime: string;
  budget?: number | null;
  status: "open" | "accepted" | "cancelled";
  createdAt: string;
}

interface CustomPostWithCount extends CustomPost {
  proposalCount: number;
}

interface SuccessContent {
  title: string;
  description: string;
}

const formatDate = (dateStr: string) =>
  new Date(dateStr).toLocaleDateString("ar-EG", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

const formatTime = (timeStr: string): string => {
  const clean = timeStr.replace(/\s*(AM|PM)\s*/i, "").trim();
  const [hStr, mStr] = clean.split(":");
  let h = parseInt(hStr);
  const m = mStr ?? "00";
  const label = h >= 12 ? "مساءً" : "صباحاً";
  if (h > 12) h -= 12;
  if (h === 0) h = 12;
  return `${h}:${m} ${label}`;
};

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
          {title}
        </h2>
        <p className="text-gray-400 text-sm mb-8 leading-relaxed">
          {description}
        </p>
        <div className="w-20 h-20 rounded-full bg-[#F0F9E8] flex items-center justify-center mb-8">
          <div className="w-14 h-14 rounded-full bg-[var(--accent-color)] flex items-center justify-center">
            <Check
              size={28}
              className="text-[var(--primary-color)]"
              strokeWidth={3}
            />
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
    <div
      className="bg-white rounded-2xl border border-gray-100 p-5 mb-4"
      dir="rtl"
    >
      {request.serviceId?.priceRange && (
        <div className="flex justify-start mb-3">
          <span className="flex items-center gap-1 text-xs font-bold bg-[var(--secondary-color)] text-[var(--primary-color)] px-3 py-1.5 rounded-full">
            <Image src={walletIcon} alt="wallet" width={14} height={14} />
            {request.serviceId.priceRange.min}-
            {request.serviceId.priceRange.max} ج.م
          </span>
        </div>
      )}
      <h3 className="font-bold text-[var(--primary-color)] text-base mb-2 text-right">
        {request.serviceId?.name}
      </h3>
      {request.serviceId?.description && (
        <p className="text-sm text-gray-400 text-right mb-2 leading-relaxed">
          {request.serviceId.description}
        </p>
      )}
      {request.notes && (
        <p className="text-sm text-right mb-4 leading-relaxed">
          <span className="text-gray-400">ملاحظة : </span>
          <span className="text-gray-500">{request.notes}</span>
        </p>
      )}

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
            <div className="w-10 h-10 rounded-full bg-[#D9F06A] flex items-center justify-center shrink-0">
              <span className="font-bold text-[var(--primary-color)]">
                {request.userId.fullName?.charAt(0) ?? "؟"}
              </span>
            </div>
            <div className="text-right">
              <h3 className="font-bold text-[var(--primary-color)] text-base">
                {request.userId.fullName}
              </h3>
              <p className="text-xs text-gray-500 mb-2">عميل موثق</p>
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

// ─── CustomPostCard ───────────────────────────────────────────────────────────
function CustomPostCard({
  post,
  onSubmit,
  submitting,
}: {
  post: CustomPostWithCount;
  onSubmit: (id: string) => void;
  submitting: string | null;
}) {
  const router = useRouter();

  return (
    <div
      className="bg-white rounded-2xl border border-gray-100 p-5 mb-4"
      dir="rtl"
    >
      {/* Budget badge */}
      {post.budget != null && (
        <div className="flex justify-start mb-3">
          <span className="flex items-center gap-1 text-xs font-bold bg-[var(--secondary-color)] text-[var(--primary-color)] px-3 py-1.5 rounded-full">
            <Image src={walletIcon} alt="wallet" width={14} height={14} />
            {post.budget} ج.م
          </span>
        </div>
      )}

      {/* Title */}
      <h3 className="font-bold text-[var(--primary-color)] text-base mb-2 text-right">
        {post.title ?? post.categoryId?.name ?? "خدمة مخصصة"}
      </h3>

      {/* Description */}
      {post.description && (
        <p className="text-sm text-gray-400 text-right mb-4 leading-relaxed line-clamp-2">
          {post.description}
        </p>
      )}

      {/* Client + actions row */}
      {post.userId && (
        <div className="bg-[#F8FAF9] rounded-xl p-4">
          {/* Client info */}
          <div className="flex items-start gap-3 mb-4">
            <div className="w-10 h-10 rounded-full bg-[#D9F06A] flex items-center justify-center shrink-0">
              <span className="font-bold text-[var(--primary-color)]">
                {post.userId.fullName?.charAt(0) ?? "؟"}
              </span>
            </div>
            <div className="text-right flex-1">
              <h4 className="font-bold text-[var(--primary-color)] text-base">
                {post.userId.fullName}
              </h4>
              <p className="text-xs text-gray-500 mb-2">عميل موثق</p>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4 text-xs text-gray-400">
                  <div className="flex items-center gap-1">
                    <MapPin size={13} className="text-[var(--accent-color)]" />
                    <span>{post.address?.district}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Calendar
                      size={13}
                      className="text-[var(--accent-color)]"
                    />
                    <span>{formatDate(post.preferredDate)}</span>
                  </div>
                  {/* عدد العروض */}
                  <div className="flex items-center gap-1 text-xs text-gray-400">
                    <Users size={13} className="text-[var(--accent-color)]" />
                    <span>{post.proposalCount} عروض مقدمة</span>
                  </div>
                </div>

                {/* CTA buttons */}
                <div className="flex items-center justify-between gap-2">
                  {/* عرض التفاصيل */}
                  <button
                    onClick={() => router.push(`/posts/${post._id}`)}
                    className="flex items-center gap-1 px-4 h-10 rounded-full border border-gray-200 text-sm text-gray-600 font-bold hover:border-[var(--primary-color)] transition-all"
                  >
                    <Eye size={16} className="text-gray-400" />
                    عرض التفاصيل
                  </button>

                  {/* تقديم */}
                  <button
                    onClick={() => onSubmit(post._id)}
                    disabled={submitting === post._id}
                    className={`min-w-[90px] h-10 rounded-full font-bold text-sm transition-all ${
                      submitting === post._id
                        ? "bg-gray-200 text-gray-400"
                        : "bg-[var(--accent-color)] text-[var(--primary-color)]"
                    }`}
                  >
                    {submitting === post._id ? "جاري..." : "تقديم"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function TipCard() {
  return (
    <div
      className="rounded-2xl p-5 text-white h-fit"
      style={{ background: "linear-gradient(to bottom, #1C4B41, #112D27)" }}
      dir="rtl"
    >
      <div className="flex mb-3">
        <span className="text-xs bg-white/20 px-2 py-1 rounded-full">
          نصيحة احترافية
        </span>
      </div>
      <h3 className="font-bold text-lg mb-2 text-right leading-snug">
        عروض مفضلة = فرص قبول أعلى
      </h3>
      <p className="text-sm text-white/80 text-right leading-relaxed mb-4">
        اكتب عرضاً واضحاً يوضح خطوات العمل، الوقت المتوقع، والمواد المستخدمة
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
  const [loading, setLoading] = useState(true);
  const [accepting, setAccepting] = useState<string | null>(null);

  const [successContent, setSuccessContent] = useState<SuccessContent | null>(
    null,
  );

  const [customPosts, setCustomPosts] = useState<CustomPostWithCount[]>([]);
  const [loadingCustom, setLoadingCustom] = useState(false);
  const [submittingPost, setSubmittingPost] = useState<string | null>(null);

  useEffect(() => {
    if (activeTab !== "popular") return;

    const loadRequests = async () => {
      setLoading(true);
      try {
        const res = await api.get("/requests/pending");
        setPopularRequests(res.data.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadRequests();
  }, [activeTab]);

  useEffect(() => {
    if (activeTab !== "custom") return;

    setLoadingCustom(true);
    api
      .get("/posts")
      .then(async (res) => {
        const posts: CustomPost[] = res.data.data ?? [];

        // جيب عدد الـ proposals لكل post
        const withCounts = await Promise.all(
          posts.map(async (post) => {
            try {
              const pRes = await api.get(`/posts/${post._id}/proposals`);
              const proposals: { status: string }[] = pRes.data.data ?? [];
              return {
                ...post,
                proposalCount: proposals.filter((p) => p.status === "pending")
                  .length,
              };
            } catch {
              return { ...post, proposalCount: 0 };
            }
          }),
        );

        setCustomPosts(withCounts);
      })
      .catch(console.error)
      .finally(() => setLoadingCustom(false));
  }, [activeTab]);

  const handleAccept = async (requestId: string) => {
    setAccepting(requestId);

    try {
      await api.patch(`/requests/${requestId}/accept`);
      setPopularRequests((prev) =>
        prev.filter((request) => request._id !== requestId),
      );
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

  const handleSubmitPost = async (postId: string) => {
    setSubmittingPost(postId);
    try {
      // عدل الـ endpoint ده حسب الـ API بتاعك
      await api.post(`/posts/${postId}/proposals`, {
        price: 0, // أو اعمل modal لإدخال السعر
      });
      setCustomPosts((prev) => prev.filter((p) => p._id !== postId));
      setSuccessContent({
        title: "تم إرسال العرض بنجاح!",
        description: "تم إرسال عرضك للعميل، يمكنك متابعة حالته من صفحة العروض.",
      });
    } catch (err) {
      console.error(err);
    } finally {
      setSubmittingPost(null);
    }
  };

  return (
    <div className="min-h-screen bg-[#f7f7f5] p-6">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Content — ٣/٤ */}
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
                <p className="text-gray-400 text-sm text-center py-20">
                  لا توجد طلبات متاحة الآن
                </p>
              ) : (
                popularRequests.map((req) => (
                  <RequestCard
                    key={req._id}
                    request={req}
                    onAccept={handleAccept}
                    accepting={accepting}
                  />
                ))
              )}
            </>
          ) : activeTab === "custom" ? (
            <>
              {!loadingCustom && (
                <p className="text-sm text-gray-400 mb-4" dir="rtl">
                  عرض {customPosts.length} خدمة مخصصة متاحة
                </p>
              )}
              {loadingCustom ? (
                <div className="flex items-center justify-center py-20">
                  <div className="w-8 h-8 rounded-full border-4 border-[var(--accent-color)] border-t-transparent animate-spin" />
                </div>
              ) : customPosts.length === 0 ? (
                <p className="text-gray-400 text-sm text-center py-20">
                  لا توجد خدمات مخصصة متاحة الآن
                </p>
              ) : (
                customPosts.map((post) => (
                  <CustomPostCard
                    key={post._id}
                    post={post}
                    onSubmit={handleSubmitPost}
                    submitting={submittingPost}
                  />
                ))
              )}
            </>
          ) : null}
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
    </div>
  );
}
