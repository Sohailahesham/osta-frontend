"use client";

import { useEffect, useState } from "react";
import { getTechnicianDashboard } from "@/api/services/Dashboard.service";
import HeroSection from "@/components/sections/technician/current-orders/HeroSection";

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(true);

  useEffect(() => {
    getTechnicianDashboard()
      .then((res) => setOrders(res.data.data.recentRequests))
      .catch(console.error)
      .finally(() => setLoadingOrders(false));
  }, []);

  return (
    <div className="min-h-screen">
      <HeroSection />

      {loadingOrders ? (
        <div className="flex items-center justify-center py-10">
          <div className="w-8 h-8 rounded-full border-4 border-[var(--accent-color)] border-t-transparent animate-spin" />
        </div>
      ) : (
        <>
          {/* Sections */}
        </>
      )}
    </div>
  );
}