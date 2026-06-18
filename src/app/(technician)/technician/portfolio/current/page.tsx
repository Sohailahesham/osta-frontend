"use client";

import { useEffect, useState } from "react";
import { getAssignedRequests } from "@/api/services/request.service";
import ActiveServicesHero from "@/components/sections/technician/services/ActiveServicesHero";
import ActiveServicesSection from "@/components/sections/technician/services/ActiveServicesSection";
import type { AssignedRequest } from "@/types/request.types";

export default function CurrentServicesPage() {
  const [requests, setRequests] = useState<AssignedRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadAssignedRequests = async () => {
    try {
      setLoading(true);
      setError(null);

      const result = await getAssignedRequests();
      setRequests(result.data);
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
      <ActiveServicesHero />
      <ActiveServicesSection
        requests={requests}
        loading={loading}
        error={error}
        onRetry={loadAssignedRequests}
      />
    </div>
  );
}
