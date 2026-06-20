"use client";

import { useCallback, useEffect, useState } from "react";
import { api } from "@/api/axios";
import OngoingOrdersSection, {
  Order,
} from "@/components/sections/client/current-orders/OngoingOrdersSection";
import LatestCompletedOrdersSection from "@/components/sections/client/current-orders/LatestCompletedOrdersSection";
import HeroSection from "@/components/sections/client/current-orders/HeroSection";

function getOrdersFromPayload(payload: unknown): Order[] {
  if (
    payload &&
    typeof payload === "object" &&
    "data" in payload &&
    Array.isArray((payload as { data?: unknown }).data)
  ) {
    return (payload as { data: Order[] }).data;
  }

  return [];
}

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(true);

  const fetchOrders = useCallback(async (showLoader: boolean) => {
    if (showLoader) {
      setLoadingOrders(true);
    }

    try {
      const response = await api.get("/requests/my");
      setOrders(getOrdersFromPayload(response.data));
    } catch (error) {
      console.error(error);
    } finally {
      if (showLoader) {
        setLoadingOrders(false);
      }
    }
  }, []);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      void fetchOrders(true);
    }, 0);

    return () => window.clearTimeout(timeoutId);
  }, [fetchOrders]);

  useEffect(() => {
    const pendingRequestId = sessionStorage.getItem("pendingDepositRequestId");
    if (!pendingRequestId) return;

    let attempts = 0;
    const intervalId = window.setInterval(() => {
      attempts += 1;
      void fetchOrders(false);

      if (attempts >= 6) {
        window.clearInterval(intervalId);
        sessionStorage.removeItem("pendingDepositRequestId");
      }
    }, 5000);

    return () => window.clearInterval(intervalId);
  }, [fetchOrders]);

  useEffect(() => {
    const pendingRequestId = sessionStorage.getItem("pendingDepositRequestId");
    if (!pendingRequestId) return;

    const currentRequest = orders.find((order) => order._id === pendingRequestId);
    const isDepositConfirmed =
      currentRequest?.depositStatus === "paid" || currentRequest?.status === "in_progress";

    if (isDepositConfirmed) {
      sessionStorage.removeItem("pendingDepositRequestId");
    }
  }, [orders]);

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
