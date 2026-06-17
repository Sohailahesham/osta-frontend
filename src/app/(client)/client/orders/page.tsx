"use client";

import { useEffect, useState } from "react";
import { getUserDashboard } from "@/api/services/Dashboard.service";
import OngoingOrdersSection, { Order } from "@/components/sections/client/current-orders/OngoingOrdersSection";
import LatestCompletedOrdersSection from "@/components/sections/client/current-orders/LatestCompletedOrdersSection";
import HeroSection from "@/components/sections/client/current-orders/HeroSection";

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(true);

  useEffect(() => {
    getUserDashboard()
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
          <OngoingOrdersSection orders={orders} />
          <LatestCompletedOrdersSection orders={orders} />
        </>
      )}
    </div>
  );
}