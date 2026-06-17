"use client";

import { Star, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Order } from "./OngoingOrdersSection";

// ─── Helpers ──────────────────────────────────────────────────────────────────

const formatDate = (dateStr: string) =>
  new Date(dateStr).toLocaleDateString("ar-EG", { day: "numeric", month: "long" });

// ─── Completed Card ───────────────────────────────────────────────────────────

function CompletedOrderCard({ order }: { order: Order }) {
  return (
    <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm">
      <div className="w-full h-28 bg-gray-100 relative flex items-center justify-center">
        <span className="text-gray-300 text-xs">صورة الخدمة</span>
      </div>
      <div className="p-3" dir="rtl">
        <h4 className="font-bold text-[var(--primary-color)] text-sm mb-1">{order.title}</h4>
        <p className="text-xs text-gray-400 mb-2">{formatDate(order.createdAt)}</p>
        <div className="grid grid-cols-2 gap-1 text-xs mb-2">
          <div>
            <p className="text-gray-400">الفني</p>
            <p className="font-semibold text-[var(--primary-color)]">{order.technicianName ?? "الفني"}</p>
          </div>
          <div>
            <p className="text-gray-400">التكلفة</p>
            <p className="font-semibold text-[var(--primary-color)]">{order.priceMax ?? "التكلفة"} جنيه</p>
          </div>
          <div>
            <p className="text-gray-400">التخصص</p>
            <p className="font-semibold text-[var(--primary-color)]">{order.technicianSpecialty ?? "التخصص"}</p>
          </div>
          <div>
            <p className="text-gray-400">الفني</p>
            <p className="font-semibold text-[var(--primary-color)]">{order.technicianName ?? "الفني"}</p>
          </div>
        </div>
        <div className="flex items-center gap-1">
          {[1, 2, 3, 4].map((s) => (
            <Star key={s} size={12} className="text-yellow-400 fill-yellow-400" />
          ))}
          <Star size={12} className="text-gray-200 fill-gray-200" />
          <span className="text-xs text-gray-400 mr-1">تقييمك</span>
        </div>
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
        <p className="text-gray-400 text-sm text-center py-10">لا توجد طلبات مكتملة</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {completedOrders.map((order) => (
            <CompletedOrderCard key={order.id} order={order} />
          ))}
        </div>
      )}
    </div>
  );
}