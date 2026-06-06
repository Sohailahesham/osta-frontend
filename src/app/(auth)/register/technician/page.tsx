"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Phone } from "lucide-react";
import authBg from "@/assets/images/auth-bg.jpg";
import AuthInput from "@/components/auth/AuthInput";
import AuthSelect from "@/components/auth/AuthSelect";
import Button from "@/components/ui/Button";
import { registerTechnician } from "@/services/auth.service";
import logoImage from '@/assets/images/logo.png';


// الـ steps بتاعة الـ stepper
const STEPS = [
  "المعلومات الأساسية",
  "التخصصات والخدمات",
  "منطقة العمل",
  "التحقق من الهوية",
  "مراجعة الطلب",
];

const GOVERNORATES = [
  { label: "القاهرة", value: "القاهرة" },
  { label: "الإسكندرية", value: "الإسكندرية" },
  { label: "الجيزة", value: "الجيزة" },
  { label: "الشرقية", value: "الشرقية" },
  { label: "الدقهلية", value: "الدقهلية" },
  { label: "الإسماعيلية", value: "الإسماعيلية" },
  { label: "الغربية", value: "الغربية" },
  { label: "المنوفية", value: "المنوفية" },
  { label: "البحيرة", value: "البحيرة" },
  { label: "كفر الشيخ", value: "كفر الشيخ" },
  { label: "القليوبية", value: "القليوبية" },
  { label: "الفيوم", value: "الفيوم" },
  { label: "بني سويف", value: "بني سويف" },
  { label: "المنيا", value: "المنيا" },
  { label: "أسيوط", value: "أسيوط" },
  { label: "سوهاج", value: "سوهاج" },
  { label: "قنا", value: "قنا" },
  { label: "الأقصر", value: "الأقصر" },
  { label: "أسوان", value: "أسوان" },
  { label: "البحر الأحمر", value: "البحر الأحمر" },
  { label: "بورسعيد", value: "بورسعيد" },
  { label: "السويس", value: "السويس" },
  { label: "دمياط", value: "دمياط" },
  { label: "شمال سيناء", value: "شمال سيناء" },
  { label: "جنوب سيناء", value: "جنوب سيناء" },
  { label: "الوادي الجديد", value: "الوادي الجديد" },
  { label: "مطروح", value: "مطروح" },
];

interface BasicInfoForm {
  fullName: string;
  email: string;
  phone: string;
  governorate: string;
  city: string;
  password: string;
  confirmPassword: string;
}

export default function TechnicianRegisterPage() {
  const router = useRouter();
  const currentStep = 0; // الخطوة الأولى

  const [form, setForm] = useState<BasicInfoForm>({
    fullName: "",
    email: "",
    phone: "",
    governorate: "",
    city: "",
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState<Partial<BasicInfoForm>>({});
  const [generalError, setGeneralError] = useState("");

  const update = (field: keyof BasicInfoForm) => (value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: "" }));
  };

  const validate = () => {
    const newErrors: Partial<BasicInfoForm> = {};
    if (!form.fullName.trim()) newErrors.fullName = "الاسم مطلوب";
    if (!form.email.trim()) newErrors.email = "البريد الإلكتروني مطلوب";
    if (!form.phone.trim()) newErrors.phone = "رقم الهاتف مطلوب";
    if (!form.governorate) newErrors.governorate = "اختر المحافظة";
    if (!form.city) newErrors.city = "اختر المدينة";
    if (!form.password) newErrors.password = "كلمة المرور مطلوبة";
    if (form.password !== form.confirmPassword)
      newErrors.confirmPassword = "كلمة المرور غير متطابقة";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = async () => {
    if (!validate()) return;

    try {
      const { data } = await registerTechnician({
        fullName: form.fullName,
        email: form.email,
        password: form.password,
        confirmPassword: form.confirmPassword,
        phone: form.phone,
        governorate: form.governorate,
        city: form.city,
      });

      localStorage.setItem("access_token", data.data.access_token);
      router.push("/register/technician/specializationsAndServices");
    } catch (error: any) {
      const message = error.response?.data?.message;
      setGeneralError(
        Array.isArray(message)
          ? message[0]
          : message || "حدث خطأ، حاول مرة أخرى",
      );
    }
  };

  const handleCancel = () => {
    router.push("/login");
  };

  return (
    <div className="min-h-screen flex relative overflow-hidden" dir="ltr">
      <Image
        src={authBg}
        alt="Background"
        fill
        priority
        className="object-cover object-right"
      />

      {/* overlay موبايل */}
      <div className="absolute inset-0 bg-black/25 lg:hidden" />

      {/* Logo */}
      <div className="absolute top-4 right-4 sm:top-6 sm:right-6 z-20">
        <div className="flex items-center gap-2">
          <Image
            src={logoImage}
            alt="Logo"
            width={120}
            // height={60}
            className="h-auto"
          />
        </div>
      </div>

      {/* الكارت */}
      <div
        className="
        flex items-center justify-center z-10
        w-full min-h-screen px-4 py-20
        lg:w-[55%] lg:px-12 lg:py-12
      "
      >
        <div
          className="
          bg-white rounded-3xl shadow-sm w-full
          p-7 max-w-sm
          sm:p-10 sm:max-w-md
          lg:p-12 lg:max-w-2xl
        "
          dir="rtl"
        >
          {/* العنوان */}
          <h1 className="text-2xl sm:text-3xl font-bold text-[var(--primary-color)] text-center mb-10">
            إنشاء حساب فني
          </h1>

          {/* Stepper */}
          <div className="mb-8">
            {/* Mobile + Tablet (Simple Step) */}
            <div className="flex lg:hidden items-center justify-between mb-3">
              <span className="text-xs text-gray-400">
                {currentStep + 1} / {STEPS.length}
              </span>

              <span className="text-sm font-semibold text-[var(--primary-color)]">
                {STEPS[currentStep]}
              </span>
            </div>

            {/* Desktop (Full Steps) */}
            <div className="hidden lg:flex items-center justify-between gap-1 pb-0">
              {STEPS.map((step, index) => (
                <div
                  key={step}
                  className="flex flex-col items-center flex-1 min-w-0"
                >
                  <span
                    className={`
                      text-xs whitespace-nowrap pb-3 transition-all text-center w-full
                      ${
                        index === currentStep
                          ? "text-[var(--primary-color)] font-semibold"
                          : "text-gray-300"
                      }
                    `}
                  >
                    {step}
                  </span>
                </div>
              ))}
            </div>

            {/* Progress Bar */}
            <div className="relative h-0.5 bg-gray-200 w-full">
              <div
                className="absolute top-0 h-0.5 bg-[var(--primary-color)] transition-all duration-300"
                style={{
                  width: `${((currentStep + 1) / STEPS.length) * 100}%`,
                }}
              />
            </div>
          </div>

          {/* الوصف */}
          <p className="text-gray-400 text-xs sm:text-sm text-right mb-6">
            أدخل بياناتك الأساسية للبدء في توثيق حسابك والانضمام إلى المنصة.
          </p>

          {/* الفورم */}
          <div className="flex flex-col gap-4">
            {/* الاسم بالكامل — full width */}
            <AuthInput
              label="الاسم بالكامل"
              placeholder="ادخل الاسم الرباعي"
              type="text"
              value={form.fullName}
              onChange={update("fullName")}
              error={errors.fullName}
            />

            {/* البريد ورقم الهاتف — جنب بعض */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <AuthInput
                label="البريد الإلكتروني"
                placeholder="Ex: user@example.com"
                type="email"
                value={form.email}
                onChange={update("email")}
                error={errors.email}
              />
              <AuthInput
                label="رقم الهاتف"
                placeholder="+00 0000 000000"
                type="tel"
                icon={Phone}
                value={form.phone}
                onChange={update("phone")}
                error={errors.phone}
              />
            </div>

            {/* المحافظة والمدينة */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <AuthSelect
                label="المحافظة"
                placeholder="اختر محافظتك"
                options={GOVERNORATES}
                value={form.governorate}
                onChange={(val) => {
                  setForm((prev) => ({ ...prev, governorate: val, city: "" }));
                  if (errors.governorate)
                    setErrors((prev) => ({ ...prev, governorate: "" }));
                }}
                error={errors.governorate}
              />
              <AuthInput
                label="المدينة"
                placeholder="اكتب مدينتك"
                value={form.city}
                onChange={update("city")}
                error={errors.city}
                disabled={!form.governorate}
              />
            </div>

            {/* كلمة المرور والتأكيد — جنب بعض */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <AuthInput
                label="كلمة المرور"
                placeholder="ادخل كلمة المرور"
                type="password"
                value={form.password}
                onChange={update("password")}
                error={errors.password}
              />
              <AuthInput
                label="تأكيد كلمة المرور"
                placeholder="أعد إدخال كلمة المرور"
                type="password"
                value={form.confirmPassword}
                onChange={update("confirmPassword")}
                error={errors.confirmPassword}
              />
            </div>
          </div>

          {generalError && (
            <p className="text-red-500 text-xs text-right mt-2">
              {generalError}
            </p>
          )}

          {/* divider */}
          <div className="h-px bg-gray-100 my-6 sm:my-8" />

          <div className="flex gap-2 justify-end">
            <Button variant="outline" onClick={handleCancel}>
              إلغاء
            </Button>
            <Button onClick={handleNext}>التالي</Button>
          </div>
        </div>
      </div>

      {/* الجانب الأيمن desktop only */}
      <div className="hidden lg:block lg:w-[45%]" />
    </div>
  );
}
