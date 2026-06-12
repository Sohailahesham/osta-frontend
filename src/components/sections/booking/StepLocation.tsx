'use client';

import { useState } from 'react';
import { MapPin, Camera } from 'lucide-react';
import vodafoneLogo from '@/assets/images/vodafone-cash.jpg';
import instapayLogo from '@/assets/images/instapay.jpg';
import visaLogo from '@/assets/images/visa.jpg';
import Image from 'next/image';

interface Props {
  selectedDate: string;
  selectedTime: string;
  onTimeChange: (time: string) => void;
  onSubmit: (locationData: LocationData) => void;
  loading: boolean;
}

export interface LocationData {
  district: string;
  fullAddress: string;
  notes: string;
  paymentMethod: string;
}

const PAYMENT_METHODS = [
  { id: 'vodafone', logo: vodafoneLogo, alt: 'Vodafone Cash', disabled: true },
  { id: 'instapay', logo: instapayLogo, alt: 'InstaPay', disabled: true },
  { id: 'visa', logo: visaLogo, alt: 'Visa', disabled: false },
];

const TIME_SLOTS = [
  '8:00 ص', '9:00 ص', '10:00 ص', '11:00 ص',
  '12:00 م', '1:00 م', '2:00 م', '3:00 م',
  '4:00 م', '5:00 م', '6:00 م', '7:00 م',
];

export default function StepLocation({
  selectedDate,
  selectedTime,
  onTimeChange,
  onSubmit,
  loading,
}: Props) {
  const [district, setDistrict] = useState('');
  const [fullAddress, setFullAddress] = useState('');
  const [notes, setNotes] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('');

  const displayDate = selectedDate
    ? new Date(selectedDate).toLocaleDateString('ar-EG', { weekday: 'long', day: 'numeric', month: 'long' })
    : '';

  const handleSubmit = () => {
    if (!district || !fullAddress || !paymentMethod) return;
    onSubmit({ district, fullAddress, notes, paymentMethod });
  };

  return (
    <div dir="rtl">
      {/* المواعيد المتاحة */}
      <h3 className="font-bold text-[var(--primary-color)] text-right mb-3">المواعيد المتاحة</h3>
      <div className="grid grid-cols-4 gap-2 mb-6">
        {TIME_SLOTS.map(slot => (
          <button
            key={slot}
            onClick={() => onTimeChange(slot)}
            className={`py-2.5 px-3 rounded-full border text-[var(--primary-color)] text-xs font-medium transition-all
              ${selectedTime === slot
                ? 'border-[var(--accent-color)] bg-[var(--accent-color)] text-[var(--primary-color)]'
                : 'border-gray-200 hover:border-gray-300'
              }`}
          >
            {slot}
          </button>
        ))}
      </div>

      {/* نطاق السعر */}
      <h3 className="font-bold text-[var(--primary-color)] text-right mb-3">نطاق السعر المتوقع (جنية)</h3>
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="flex flex-col gap-1">
          <label className="text-xs text-gray-400 text-right">الحد الأدنى</label>
          <div className="border border-gray-200 rounded-full px-4 py-3 text-center text-sm text-gray-500">200</div>
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-xs text-gray-400 text-right">الحد الأقصى</label>
          <div className="border border-gray-200 rounded-full px-4 py-3 text-center text-sm text-gray-500">450</div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4">
        {/* المنطقة */}
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-semibold text-[var(--primary-color)]">
            المنطقة <span className="text-red-500">*</span>
          </label>
          <input
            value={district}
            onChange={e => setDistrict(e.target.value)}
            placeholder="مثال: حي الزهرة"
            className="border border-gray-200 rounded-full px-4 py-3 text-sm text-right outline-none focus:border-[var(--accent-color)] placeholder:text-gray-300"
          />
        </div>

        {/* العنوان */}
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-semibold text-[var(--primary-color)]">
            العنوان <span className="text-red-500">*</span>
          </label>
          <input
            value={fullAddress}
            onChange={e => setFullAddress(e.target.value)}
            placeholder="مثال: شارع الملك فهد، البناية 12"
            className="border border-gray-200 rounded-full px-4 py-3 text-sm text-right outline-none focus:border-[var(--accent-color)] placeholder:text-gray-300"
          />
        </div>
      </div>

      {/* الموقع التفصيلي */}
      <div className="flex flex-col gap-1.5 mb-4">
        <label className="text-sm font-semibold text-[var(--primary-color)]">الموقع التفصيلي</label>
        <div className="border border-gray-200 rounded-full px-4 py-3 flex items-center gap-2">
          <MapPin size={16} className="text-gray-300 flex-shrink-0" />
          <input
            placeholder="ارفق الموقع هنا"
            className="flex-1 text-sm text-right outline-none placeholder:text-gray-300 bg-transparent"
          />
        </div>
      </div>

      {/* ملاحظات */}
      <div className="flex flex-col gap-1.5 mb-4">
        <label className="text-sm font-semibold text-[var(--primary-color)]">
          ملاحظات إضافية <span className="text-gray-400 font-normal">(اختياري)</span>
        </label>
        <textarea
          value={notes}
          onChange={e => setNotes(e.target.value)}
          placeholder="أي تفاصيل إضافية تود إخبار الحرفي بها..."
          rows={3}
          className="border border-gray-200 rounded-2xl px-4 py-3 text-sm text-right outline-none focus:border-[var(--accent-color)] placeholder:text-gray-300 resize-none"
        />
      </div>

      {/* قيمة العربون */}
      <div className="flex items-center justify-between mb-4">
        <label className="text-sm font-semibold text-[var(--primary-color)]">
          قيمة العربون <span className="text-gray-400 font-normal">(جنية)</span>
        </label>
        <div className="border border-gray-200 rounded-full px-6 py-3 flex items-center gap-2 w-52">
          <Camera size={16} className="text-gray-400" />
          <span className="text-sm text-gray-500">100</span>
        </div>
      </div>

      {/* طريقة الدفع */}
      <div className="flex flex-col gap-3 mb-4">
        <label className="text-sm font-semibold text-[var(--primary-color)]">
          طريقة الدفع <span className="text-red-500">*</span>
        </label>
        <div className="grid grid-cols-3 gap-3">
          {PAYMENT_METHODS.map(method => (
            <div key={method.id} className="relative">
              <button
                onClick={() => !method.disabled && setPaymentMethod(method.id)}
                className={`w-full border-2 rounded-2xl p-4 flex items-center justify-center transition-all
                  ${method.disabled
                    ? 'cursor-not-allowed border-gray-200'
                    : paymentMethod === method.id
                      ? 'border-[var(--primary-color)]'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
              >
                <Image
                  src={method.logo}
                  alt={method.alt}
                  width={100}
                  className={`object-contain ${method.disabled ? 'blur-sm opacity-40' : ''}`}
                />
              </button>
              {method.disabled && (
                <div className="absolute inset-0 rounded-2xl cursor-not-allowed" />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* ملخص الموعد + زرار الإرسال */}
      <div className="bg-[var(--secondary-color)] rounded-2xl p-4 flex items-center justify-between">
        <div className="text-right">
          <p className="font-bold text-[var(--primary-color)] text-sm">{displayDate}</p>
          <p className="text-gray-400 text-xs">الساعة {selectedTime}</p>
        </div>
        <button
          onClick={handleSubmit}
          disabled={!district || !fullAddress || !paymentMethod || loading}
          className={`px-8 py-3 rounded-full font-bold text-sm transition-all
            ${district && fullAddress && paymentMethod && !loading
              ? 'bg-[var(--accent-color)] text-[var(--primary-color)] hover:opacity-90'
              : 'bg-gray-200 text-gray-400 cursor-not-allowed'
            }`}
        >
          {loading ? 'جاري الإرسال...' : 'إرسال الطلب'}
        </button>
      </div>
    </div>
  );
}