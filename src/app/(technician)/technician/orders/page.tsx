"use client";

import { useEffect, useState } from "react";
import { getTechnicianDashboard } from "@/api/services/Dashboard.service";
import OrdersNavbar from "@/components/layout/technician/OrdersNavbar";
import HeroSection from "@/components/sections/technician/current-orders/HeroSection";

type TechnicianOrder = {
  _id?: string;
  id?: string;
};

export default function OrdersPage() {
  const [orders, setOrders] = useState<TechnicianOrder[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(true);

  useEffect(() => {
    getTechnicianDashboard()
      .then((res) => setOrders(res.data.data.recentRequests ?? []))
      .catch(console.error)
      .finally(() => setLoadingOrders(false));
  }, []);

  return (
    <div className="min-h-screen">
      <OrdersNavbar />
      <HeroSection />

      <div className="mx-auto max-w-6xl px-4 py-6">
        <p className="text-sm text-gray-500">
          {loadingOrders
            ? "جاري تحميل الطلبات..."
            : `عدد الطلبات الواردة: ${orders.length}`}
        </p>
      </div>
    </div>
  );
}
