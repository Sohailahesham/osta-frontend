"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { User, Star } from "lucide-react";
import DepositModal from "./DepositModal";
import { getClientOrderStatusBadge, Order } from "./OngoingOrdersSection";
import ChatButton from "../direct-messages/ChatButton";

export default function ActiveOrderCard({ order }: { order: Order }) {
  const router = useRouter();
  const [showDepositModal, setShowDepositModal] = useState(false);
  const technicianInitial = order.assignedTechnician?.fullName?.charAt(0) ?? "?";
  const badge = getClientOrderStatusBadge(order);
  const canPayDeposit = order.status === "accepted" && order.depositStatus === "unpaid";
  const canTrackOrder =
    order.status === "in_progress" || order.status === "on_the_way" || order.status === "started";

  return (
    <>
      <div
        className="border-2 border-[var(--accent-color)] rounded-2xl p-5 bg-white"
        dir="rtl"
      >
        <div className="flex items-start justify-between mb-4">
          <div>
            <h3 className="font-bold text-[var(--primary-color)] text-base">
              {order.serviceId?.name}
            </h3>
            {order.categoryId?.name && (
              <span className="text-xs text-gray-400">{order.categoryId.name}</span>
            )}
          </div>
          <div className="flex items-center gap-2">
            <span className={`text-xs font-bold px-3 py-1 rounded-full ${badge.className}`}>
              {badge.label}
            </span>
            <button className="text-gray-300 hover:text-gray-500">⋮</button>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="bg-[#F8FAF9] rounded-xl p-2">
            <p className="text-xs text-gray-400 mb-1">نطاق السعر</p>
            {order.serviceId?.priceRange ? (
              <p className="font-bold text-[var(--primary-color)] text-sm">
                {order.serviceId.priceRange.min} - {order.serviceId.priceRange.max}{" "}
                <span className="font-normal text-xs">جنية</span>
              </p>
            ) : (
              <p className="text-xs text-gray-400">—</p>
            )}
          </div>
          <div className="bg-[#F8FAF9] rounded-xl p-2">
            <p className="text-xs text-gray-400 mb-1">تاريخ الطلب</p>
            <p className="font-bold text-[var(--primary-color)] text-sm">
              {new Date(order.preferredDate).toLocaleDateString("ar-EG", {
                day: "numeric",
                month: "long",
              })}
            </p>
          </div>
        </div>

        <div>
          <p className="text-sm font-bold text-[var(--primary-color)] mb-3">عروض الفنيين</p>

          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-full bg-[var(--secondary-color)] flex items-center justify-center text-[var(--primary-color)] text-sm font-bold flex-shrink-0">
                {technicianInitial}
              </div>
              <div className="text-right">
                <p className="font-bold text-sm text-[var(--primary-color)]">
                  {order.assignedTechnician?.fullName ?? "—"}
                </p>
                <div className="flex items-center gap-1">
                  <span className="text-xs text-gray-400">
                    {order.assignedTechnician?.averageRating ?? "0"}
                  </span>
                  <Star size={12} className="text-yellow-400 fill-yellow-400" />
                </div>
              </div>
            </div>

            {canPayDeposit ? (
              <button
                onClick={() => setShowDepositModal(true)}
                className="bg-[var(--accent-color)] text-[var(--primary-color)] text-xs font-bold px-4 py-2.5 rounded-full whitespace-nowrap hover:opacity-90 transition-all"
              >
                دفع العربون
              </button>
            ) : canTrackOrder ? (
              <button
                onClick={() => router.push(`/client/tracking/${order._id}`)}
                className="bg-[var(--accent-color)] text-[var(--primary-color)] text-xs font-bold px-4 py-2.5 rounded-full whitespace-nowrap hover:opacity-90 transition-all"
              >
                تتبع الطلب
              </button>
            ) : (
              <span className="text-xs text-gray-400 whitespace-nowrap">
                {order.depositStatus === "pending" ? "جاري تأكيد الدفع" : "تم دفع العربون"}
              </span>
            )}
          </div>

          <div className="flex justify-end gap-1 mb-3">
            <ChatButton requestId={order._id} role="client" />
            <button className="flex items-center gap-1.5 text-xs text-gray-500 border border-gray-200 px-3 py-2 rounded-full hover:bg-gray-50 transition-all">
              <User size={14} />
            </button>
          </div>

          <p className="text-sm text-gray-500 text-right">
            خبرة {order.assignedTechnician?.yearsOfExperience ?? "0"} سنوات في أعمال{" "}
            {order.categoryId.name}
          </p>
        </div>
      </div>

      {showDepositModal && (
        <DepositModal
          requestId={order._id}
          serviceName={order.serviceId?.name ?? ""}
          categoryName={order.categoryId?.name ?? ""}
          technicianName={order.assignedTechnician?.fullName ?? "—"}
          technicianRating={order.assignedTechnician?.averageRating}
          priceMin={order.serviceId?.priceRange?.min}
          priceMax={order.serviceId?.priceRange?.max}
          depositAmount={order.depositAmount}
          onClose={() => setShowDepositModal(false)}
        />
      )}
    </>
  );
}
