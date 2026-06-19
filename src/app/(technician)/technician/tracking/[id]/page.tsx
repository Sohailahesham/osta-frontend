"use client";

import { useState, use } from "react";
import { MapPin } from "lucide-react";
import { trackingApi } from "@/api/services/tracking.service";
import TrackingStepper from "@/components/sections/technician/tracking/trackingStepper";
import InvoiceModal from "@/components/sections/technician/tracking/invoiceModel";
import TrackingStepCards from "@/components/sections/technician/tracking/trackingStepCards"
import type { TechnicianRequest } from "@/types/tracking.types";
import TrackingNav from '@/components/layout/TrackingNav';



export default function TechnicianTrackingPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id: requestId } = use(params);

  const [request, setRequest] = useState<TechnicianRequest | null>(null);
  const [progress, setProgress] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showInvoiceModal, setShowInvoiceModal] = useState(false);

  const withLoading = async (fn: () => Promise<void>) => {
    setLoading(true);
    setError("");
    try {
      await fn();
    } catch (e) {
      setError(e instanceof Error ? e.message : "حصل خطأ، حاول تاني");
    } finally {
      setLoading(false);
    }
  };

  const handleStep = (index: number) => {
    if (index === 0) {
      withLoading(async () => {
        const data = await trackingApi.onTheWay(requestId);
        setRequest(data);
        setProgress(1);
      });
    } else if (index === 1) {
      withLoading(async () => {
        const data = await trackingApi.start(requestId);
        setRequest(data);
        setProgress(2);
      });
    } else if (index === 2) {
      setShowInvoiceModal(true);
    }
  };

  return (
    <div dir="rtl" className="min-h-screen bg-white">
        <TrackingNav />
      <div className="max-w-3xl mx-auto px-4 pt-16 sm:px-6 py-6">
        {/* Service Info Row */}
        <div className="flex items-center justify-between mb-8 py-4">
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold"
              style={{ backgroundColor: "var(--primary-color)", color: "#fff" }}
            >
              {request?.userId?.fullName?.charAt(0)}
            </div>
            <div>
              <p className="text-base font-bold text-[var(--primary-color)] text-left">
                {request?.serviceId?.name }
              </p>
            </div>
            
          </div>
          <div className="flex items-center gap-2 text-sm text-[var(--gray-color)]">
            <MapPin className="w-4 h-4 text-[var(--accent-color)]" />
            <span>{request?.address?.district}</span>
          </div>
        </div>

        {/* Stepper */}
        <TrackingStepper progress={progress} loading={loading} onStep={handleStep} />

        {error && (
          <p className="text-center text-red-500 text-sm my-4">{error}</p>
        )}
      </div>

      <div className="w-full bg-[#F8FAF9] py-8">
  <div className="max-w-3xl mx-auto px-4 sm:px-6">
    <TrackingStepCards progress={progress} request={request} />
  </div>
</div>

      {showInvoiceModal && request && (
        <InvoiceModal
          request={request}
          requestId={requestId}
          onClose={() => setShowInvoiceModal(false)}
          onSubmitted={(updated: TechnicianRequest) => {
            setRequest(updated);
            setProgress(3);
          }}
        />
      )}
    </div>
  );
}
