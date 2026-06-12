"use client";

import { useState } from "react";
import { X } from "lucide-react";
import Image from "next/image";
import { Clock, Star, CalendarDays } from "lucide-react";
import StepCalendar from "./StepCalendar";
import StepLocation, { LocationData } from "./StepLocation";
import BookingSuccess from "./BookingSuccess";
import { createBooking } from "@/api/services/booking.service";

interface Service {
  _id: string;
  name: string;
  description: string;
  image: string;
  averageRating: number;
  category: { _id: string; name: string };
}

interface Props {
  service: Service;
  onClose: () => void;
}

const parseArabicTime = (timeStr: string): string => {
  const isAM = timeStr.includes("ص");
  const timePart = timeStr.replace("ص", "").replace("م", "").trim();
  const [hours] = timePart.split(":");
  let h = parseInt(hours);
  if (!isAM && h !== 12) h += 12;
  if (isAM && h === 12) h = 0;
  return `${String(h).padStart(2, "0")}:00`;
};

export default function BookingModal({ service, onClose }: Props) {
  const today = new Date();
  const todayStr = today.toISOString().split("T")[0];

  // "calendar" = اليوم active وبيظهر الكاليندر
  // "location" = تحديد موعد active وبيظهر فورم الموعد والعنوان
  // "success"  = تم الحجز
  const [view, setView] = useState<"calendar" | "location" | "success">(
    "calendar",
  );
  const [dateMode, setDateMode] = useState<"today" | "pick">("today");
  const [selectedDate, setSelectedDate] = useState(todayStr);
  const [selectedTime, setSelectedTime] = useState("");
  const [loading, setLoading] = useState(false);

  const handleTodayClick = () => {
    setDateMode("today");
    setSelectedDate(todayStr);
    setView("calendar");
  };

  const handlePickClick = () => {
    setDateMode("pick");
    setView("location");
  };

  const handleNext = () => {
    setView("location");
  };

  const handleLocationSubmit = async (locationData: LocationData) => {
    setLoading(true);
    try {
      await createBooking({
        categoryId: service.category._id,
        serviceId: service._id,
        address: {
          fullAddress: locationData.fullAddress,
          district: locationData.district,
          coordinates: { lat: 30.0444, lng: 31.2357 },
        },
        preferredDate: selectedDate,
        preferredTime: parseArabicTime(selectedTime),
        notes: locationData.notes,
      });
      setView("success");
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-3xl w-full max-w-4xl max-h-[90vh] overflow-y-auto mx-4"
        onClick={(e) => e.stopPropagation()}
      >
        {view === "success" ? (
          <BookingSuccess onClose={onClose} />
        ) : (
          <div className="p-8">
            {/* Header */}
            <div className="flex items-start justify-between mb-6">
              <button
                onClick={onClose}
                className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center hover:bg-gray-50"
              >
                <X size={16} className="text-gray-400" />
              </button>
              <div className="text-right">
                <h2 className="text-2xl font-bold text-[var(--primary-color)]">
                  تحديد موعد لحجز
                </h2>
                <p className="text-gray-400 text-sm">{service.name}</p>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-6">
              {/* الخدمة المطلوبة — ثابت دايماً */}
              <div className="col-span-1" dir="rtl">
                <h3 className="font-bold text-[var(--primary-color)] mb-3 text-right">
                  الخدمة المطلوبة
                </h3>
                <div className="border border-gray-200 rounded-2xl overflow-hidden">
                  <div className="relative w-full h-44">
                    <Image
                      src={service.image}
                      alt={service.name}
                      fill
                      className="object-cover"
                      unoptimized
                    />
                    <div className="absolute top-3 right-3 bg-white/80 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-semibold text-[var(--primary-color)]">
                      {service.category.name}
                    </div>
                  </div>
                  <div className="p-3">
                    <div className="flex items-center justify-between mb-1">
                      <p className="font-bold text-sm text-[var(--primary-color)]">
                        {service.name}
                      </p>
                      <div className="flex items-center gap-1">
                        <Star
                          size={12}
                          className="text-yellow-400 fill-yellow-400"
                        />
                        <span className="text-xs text-gray-500">4.5</span>
                      </div>
                    </div>
                    <p className="text-xs text-[#545454] leading-relaxed text-right line-clamp-2 mb-2">
                      {service.description}
                    </p>
                    <div className="flex items-center gap-1 bg-[var(--secondary-color)] px-2 py-1 w-fit rounded-xl">
                      <Clock size={12} className="text-gray-400" />
                      <span className="text-xs text-gray-400">
                        30 - 45 دقيقة
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* الفورم */}
              <div className="col-span-2" dir="rtl">
                {/* الزرارين — ثابتين دايماً */}
                <h3 className="font-bold text-[var(--primary-color)] text-right mb-3">
                  موعد تنفيذ الخدمة
                </h3>
                <div className="grid grid-cols-2 gap-3 mb-6">
                  <button
                    onClick={handleTodayClick}
                    className={`py-3 px-4 rounded-2xl border-2 text-sm transition-all
                      ${
                        dateMode === "today"
                          ? "border-[var(--accent-color)] bg-[var(--accent-color)] text-[var(--primary-color)] font-bold"
                          : "border-[var(--primary-color)] text-[var(--primary-color)]"
                      }`}
                  >
                    اليوم
                  </button>
                  <button
                    onClick={handlePickClick}
                    className={`py-3 px-4 rounded-2xl border-2 text-sm flex items-center justify-center gap-2 transition-all
                      ${
                        dateMode === "pick"
                          ? "border-[var(--accent-color)] bg-[var(--accent-color)] text-[var(--primary-color)] font-bold"
                          : "border-[var(--primary-color)] text-[var(--primary-color)]"
                      }`}
                  >
                    تحديد موعد
                    <CalendarDays size={15} />
                  </button>
                </div>

                {/* المحتوى المتغير */}
                {view === "calendar" && (
                  <StepCalendar
                    selectedDate={selectedDate}
                    onDateChange={setSelectedDate}
                    onNext={handleNext}
                  />
                )}
                {view === "location" && (
                  <StepLocation
                    selectedDate={selectedDate}
                    selectedTime={selectedTime}
                    onTimeChange={setSelectedTime}
                    onSubmit={handleLocationSubmit}
                    loading={loading}
                  />
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
