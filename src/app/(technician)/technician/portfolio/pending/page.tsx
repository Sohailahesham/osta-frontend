"use client";

import { useEffect, useState } from "react";
import { api } from "@/api/axios";
import { getAssignedRequests } from "@/api/services/request.service";
import PendingServicesHero from "@/components/sections/technician/pending-services/PendingServicesHero";
import PendingServicesSection from "@/components/sections/technician/pending-services/PendingServicesSection";
import type { AssignedRequest } from "@/types/request.types";

const mergeRequests = (...requestGroups: AssignedRequest[][]) => {
  const merged = new Map<string, AssignedRequest>();

  requestGroups.flat().forEach((request) => {
    if (!request?._id) return;
    merged.set(request._id, request);
  });

  return Array.from(merged.values()).sort((left, right) => {
    const leftTime = new Date(left.updatedAt ?? left.createdAt ?? 0).getTime();
    const rightTime = new Date(right.updatedAt ?? right.createdAt ?? 0).getTime();
    return rightTime - leftTime;
  });
};

export default function PendingServicesPage() {
  const [requests, setRequests] = useState<AssignedRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadAssignedRequests = async () => {
    try {
      setLoading(true);
      setError(null);

      const [assignedResult, customPendingResponse] = await Promise.all([
        getAssignedRequests(),
        api.get("/posts/technician/pending"),
      ]);

      const customPending = (customPendingResponse.data?.data ?? []) as AssignedRequest[];
      setRequests(mergeRequests(assignedResult.data, customPending));
    } catch (requestError) {
      console.error(requestError);
      setError("حدث خطأ أثناء تحميل البيانات. حاول مرة أخرى بعد قليل.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      void loadAssignedRequests();
    }, 0);

    return () => window.clearTimeout(timeoutId);
  }, []);

  return (
    <div className="min-h-screen bg-[#FCFCFA]">
      <PendingServicesHero />
      <PendingServicesSection
        requests={requests}
        loading={loading}
        error={error}
        onRetry={loadAssignedRequests}
      />
    </div>
  );
}
