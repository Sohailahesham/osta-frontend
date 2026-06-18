"use client";

import ActiveOrderCard from "./ActiveOrderCard"
import { MapPin } from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface Order {
  _id: string;

  status:
    | "pending"
    | "accepted"
    | "in-progress"
    | "completed"
    | "cancelled";

  preferredDate: string;
  preferredTime: string;

  createdAt: string;
  updatedAt: string;

  depositAmount: number;
  depositStatus: "paid" | "unpaid";

  totalPrice: number;
  isFullyPaid: boolean;

  notes: string;

  address: {
    fullAddress: string;
    district: string;
    coordinates?: {
      lat: number;
      lng: number;
    };
  };

  categoryId: {
    _id: string;
    name: string;
    image?: string;
  };

  serviceId: {
    _id: string;
    name: string;
    priceRange?: {
      min: number;
      max: number;
    };
  };

  assignedTechnician?: {
    _id: string;
    fullName: string;
    phone: string;

    averageRating?: number;
    yearsOfExperience?: number;
  };
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

const STATUS_CONFIG = {
  pending: { label: "قيد الانتظار", className: "bg-amber-100 text-amber-700" },
  accepted: {
    label: "تمت المطابقة",
    className: "bg-[var(--accent-color)] text-[var(--primary-color)]",
  },
  "in-progress": {
    label: "تم الدفع",
    className: "bg-[var(--accent-color)] text-[var(--primary-color)]",
  },
  completed: { label: "مكتملة", className: "bg-gray-100 text-gray-500" },
  cancelled: { label: "ملغية", className: "bg-red-100 text-red-600" },
};

const formatDate = (dateStr: string) =>
  new Date(dateStr).toLocaleDateString("ar-EG", {
    day: "numeric",
    month: "long",
  });

// "10:00" → "10:00 صباحاً" / "14:00" → "2:00 مساءً"
const formatTime = (timeStr: string): string => {
  const [hStr, mStr] = timeStr.split(":");
  let h = parseInt(hStr);
  const m = mStr ?? "00";
  const label = h < 12 ? "صباحاً" : "مساءً";
  if (h > 12) h -= 12;
  if (h === 0) h = 12;
  return `${h}:${m} ${label}`;
};

function StatusBadge({ status }: { status: Order["status"] }) {
  const cfg = STATUS_CONFIG[status] ?? STATUS_CONFIG.pending;
  return (
    <span
      className={`text-xs font-bold px-3 py-1 rounded-full ${cfg.className}`}
    >
      {cfg.label}
    </span>
  );
}

// ─── Shared meta block ────────────────────────────────────────────────────────

function OrderMeta({ order }: { order: Order }) {
  return (
    <div className="grid grid-cols-2 gap-4 mb-4">
      <div className="bg-[#F8FAF9] rounded-xl p-2">
        <p className="text-xs text-gray-400 mb-1">نطاق السعر</p>
        {order.serviceId?.priceRange ? (
          <p className="font-bold text-[var(--primary-color)] text-sm">
            {order.serviceId?.priceRange?.min} -{" "}
            {order.serviceId?.priceRange?.max}{" "}
            <span className="font-normal text-xs">جنية</span>
          </p>
        ) : (
          <p className="text-xs text-gray-400">—</p>
        )}
      </div>
      <div className="bg-[#F8FAF9] rounded-xl p-2">
        <p className="text-xs text-gray-400 mb-1">تاريخ الطلب</p>
        <div className="flex justify-between items-center gap-1">
          <span className="font-bold text-[var(--primary-color)] text-sm">
            {formatDate(order.preferredDate)}
          </span>
          <span className="text-xs text-gray-400">
            {formatTime(order.preferredTime)}
          </span>
        </div>
      </div>
    </div>
  );
}

// ─── Active Card ──────────────────────────────────────────────────────────────
// function ActiveOrderCard({ order }: { order: Order }) {
//   const technicianInitial =
//     order.assignedTechnician?.fullName?.charAt(0) ?? "ه";

//   return (
//     <div
//       className="border-2 border-[var(--accent-color)] rounded-2xl p-5 bg-white"
//       dir="rtl"
//     >
//       {/* Header */}
//       <div className="flex items-start justify-between mb-4">
//         <div className="">
//           <h3 className="font-bold text-[var(--primary-color)] text-base">
//             {order.serviceId?.name}
//           </h3>
//           {order.categoryId?.name && (
//             <span className="text-xs text-gray-400">
//               {order.categoryId.name}
//             </span>
//           )}
//         </div>
//         <div className="flex items-center gap-2">
//           <StatusBadge status={order.status} />
//           <button className="text-gray-300 hover:text-gray-500">⋮</button>
//         </div>
//       </div>

//       <OrderMeta order={order} />

//       {/* عروض الفنيين */}
//       <div>
//         <p className="text-sm font-bold text-[var(--primary-color)] mb-3">
//           عروض الفنيين
//         </p>

//         {/* الصف الأول: دفع العربون + بيانات الفني */}
//         <div className="flex items-center justify-between mb-4">
//           <div className="flex items-center gap-2">
//             <div className="w-10 h-10 rounded-full bg-[var(--secondary-color)] flex items-center justify-center text-[var(--primary-color)] text-sm font-bold flex-shrink-0">
//               {technicianInitial}
//             </div>
//             <div className="text-right">
//               <p className="font-bold text-sm text-[var(--primary-color)]">
//                 {order.assignedTechnician?.fullName ?? "—"}
//               </p>
//               <div className="flex items-center gap-1">
//                 <span className="text-xs text-gray-400">
//                   {order.assignedTechnician?.averageRating ?? '0'}
//                 </span>
//                 <Star size={12} className="text-yellow-400 fill-yellow-400" />
//               </div>
//             </div>
//           </div>

//           <button className="bg-[var(--accent-color)] text-[var(--primary-color)] text-xs font-bold px-4 py-2.5 rounded-full whitespace-nowrap">
//             دفع العربون
//           </button>
//         </div>

//         {/* الصف الثاني: محادثة */}
//         <div className="flex justify-end gap-1 mb-4">
//           <button className="flex items-center gap-1.5 text-xs text-gray-500 border border-gray-200 px-4 py-2 rounded-full hover:bg-gray-50 transition-all">
//             <span>محادثة</span>
//           </button>
//           <button className="flex items-center gap-1.5 text-xs text-gray-500 border border-gray-200 px-4 py-2 rounded-full hover:bg-gray-50 transition-all">
//             <User size={16} className="text-[var-(--primary-color)]"/>
//           </button>
//         </div>

//         <p className="text-sm text-gray-500 text-right mb-3">
//           خبرة {order.assignedTechnician?.yearsOfExperience ?? "5"} سنوات في أعمال {order.categoryId.name}
//         </p>
//       </div>
//     </div>
//   );
// }

// ─── Pending Card ─────────────────────────────────────────────────────────────
function PendingOrderCard({ order }: { order: Order }) {
  return (
    <div className="border border-gray-200 rounded-2xl p-5 bg-white" dir="rtl">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="">
          <h3 className="font-bold text-[var(--primary-color)] text-base">
            {order.serviceId?.name ?? order.title}
          </h3>
          {order.categoryId?.name && (
            <span className="text-xs text-gray-400">
              {order.categoryId.name}
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          <StatusBadge status={order.status} />
          <button className="text-gray-300 hover:text-gray-500">⋮</button>
        </div>
      </div>

      <OrderMeta order={order} />

      {order.address?.fullAddress && (
        <div className="flex items-center gap-1 text-xs text-gray-500 mb-3">
          <MapPin size={12} className="text-[var(--accent-color)]" />
          <span>{order.address.fullAddress}</span>
        </div>
      )}

      <div className="bg-[var(--secondary-color)] rounded-xl px-4 py-3 text-center">
        <p className="text-xs text-[var(--primary-color)] font-medium">
          جاري البحث عن الفنيين المناسبين ...
        </p>
      </div>
    </div>
  );
}

// ─── Section ──────────────────────────────────────────────────────────────────

interface Props {
  orders: Order[];
}

export default function OngoingOrdersSection({ orders }: Props) {
  const ongoingOrders = orders.filter(
    (o) =>
      o.status === "accepted" ||
      o.status === "in-progress" ||
      o.status === "pending",
  );

  return (
    <div className="section-wrapper">
      <h2 className="text-xl font-bold text-[var(--primary-color)] mb-6 flex items-center gap-2">
        <span className="w-1 h-6 bg-[var(--primary-color)] rounded-full inline-block" />
        الطلبات الجارية
      </h2>

      {ongoingOrders.length === 0 ? (
        <p className="text-gray-400 text-sm text-center py-10">
          لا توجد طلبات جارية
        </p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {ongoingOrders.map((order) =>
            order.status === "accepted" || order.status === "in-progress" ? (
              <ActiveOrderCard key={order._id} order={order} />
            ) : (
              <PendingOrderCard key={order._id} order={order} />
            ),
          )}
        </div>
      )}
    </div>
  );
}
