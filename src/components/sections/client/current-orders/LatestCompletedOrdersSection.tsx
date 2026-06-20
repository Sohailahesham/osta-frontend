"use client";

import { Star, ArrowLeft } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { Order } from "./OngoingOrdersSection";

// ─── Helpers ──────────────────────────────────────────────────────────────────

const formatDate = (dateStr: string) =>
  new Date(dateStr).toLocaleDateString("ar-EG", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

// ─── Completed Card ───────────────────────────────────────────────────────────

function CompletedOrderCard({ order }: { order: Order }) {
  const technicianRating = order.technicianRating ?? 0;
  const finalCost = order.priceMax ?? "—";
  const technicianName = order.assignedTechnician?.fullName ?? "—";
  const serviceImage = order.categoryId?.image ?? null;

  return (
    <div
      className="bg-white border border-gray-100 rounded-2xl p-4 shadow-sm flex gap-4"
      // dir="ltr"
    >

      {/* المحتوى — على اليمين */}
      <div className="flex-1 text-right">
        <h4 className="font-bold text-[var(--primary-color)] text-base mb-1">
          {order.serviceId?.name ?? order.title}
        </h4>
        <p className="text-sm text-gray-400 mb-3">{formatDate(order.createdAt)}</p>

        <div className="flex flex-col gap-1 mb-3">
          <p className="text-sm text-gray-400">الفني</p>
          <p className="font-bold text-[var(--primary-color)] text-sm">
            {technicianName}
          </p>
        </div>

        <div className="flex flex-col gap-1 mb-3">
          <p className="text-sm text-gray-400">التكلفة النهائية</p>
          <p className="font-bold text-[var(--primary-color)] text-lg">
            {finalCost} <span className="text-sm font-normal">جنية</span>
          </p>
        </div>

        {/* النجوم */}
        <div className="flex items-center gap-1 justify-end">
          <span className="text-xs text-gray-400 ml-1">تقييمك</span>
          {[1, 2, 3, 4, 5].map((star) => (
            <Star
              key={star}
              size={14}
              className={
                star <= Math.round(technicianRating)
                  ? "text-yellow-400 fill-yellow-400"
                  : "text-gray-200 fill-gray-200"
              }
            />
          ))}
        </div>
      </div>

      {/* صورة الخدمة — على الشمال */}
      <div className="w-28 h-28 rounded-xl overflow-hidden flex-shrink-0 bg-gray-100 relative">
        {serviceImage ? (
          <Image
            src={serviceImage}
            alt={order.serviceId?.name ?? order.title}
            fill
            className="object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <span className="text-gray-300 text-xs">صورة الخدمة</span>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Section ──────────────────────────────────────────────────────────────────

interface Props {
  orders: Order[];
}

export default function LatestCompletedOrdersSection({ orders }: Props) {
  const completedOrders = orders.filter((o) => o.status === "completed");

  return (
    <div className="section-wrapper">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-[var(--primary-color)] flex items-center gap-2">
          <span className="w-1 h-6 bg-[var(--primary-color)] rounded-full inline-block" />
          آخر الطلبات المكتملة
        </h2>
        <Link
          href="/requests/completed"
          className="flex items-center gap-1 text-sm text-[var(--primary-color)] font-medium hover:opacity-70 transition-opacity"
        >
          عرض الكل
          <ArrowLeft size={16} />
        </Link>
      </div>

      {completedOrders.length === 0 ? (
        <p className="text-gray-400 text-sm text-center py-10">
          لا توجد طلبات مكتملة
        </p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {completedOrders.map((order) => (
            <CompletedOrderCard key={order._id} order={order} />
          ))}
        </div>
      )}
    </div>
  );
}