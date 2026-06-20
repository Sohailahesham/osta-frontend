"use client";

import { useState } from "react";
import { Loader2, Eye, EyeOff } from "lucide-react";
import { api } from "@/api/axios";

interface Props {
  email: string;
}

export default function PasswordSection({ email }: Props) {
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState<"request" | "verify" | "reset" | "done">(
    "request",
  );
  const [otp, setOtp] = useState("");
  const [newPass, setNewPass] = useState("");
  const [confirmPass, setConfirmPass] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const resetState = () => {
    setStep("request");
    setOtp("");
    setNewPass("");
    setConfirmPass("");
    setError("");
    setOpen(false);
  };

  const sendOtp = async () => {
    setLoading(true);
    setError("");
    try {
      await api.post("/auth/forget-password", { email });
      setStep("verify");
    } catch {
      setError("حدث خطأ أثناء إرسال الرمز");
    } finally {
      setLoading(false);
    }
  };

  const verifyOtp = async () => {
    if (!otp.trim()) {
      setError("أدخل رمز التحقق");
      return;
    }
    setLoading(true);
    setError("");
    try {
      await api.post("/auth/verify-otp", { email, otp });
      setStep("reset");
    } catch {
      setError("رمز التحقق غير صحيح أو منتهي");
    } finally {
      setLoading(false);
    }
  };

  const resetPassword = async () => {
    if (newPass.length < 6) {
      setError("كلمة المرور يجب أن تكون 6 أحرف على الأقل");
      return;
    }
    if (newPass !== confirmPass) {
      setError("كلمتا المرور غير متطابقتين");
      return;
    }
    setLoading(true);
    setError("");
    try {
      await api.post("/auth/reset-password", {
        email,
        newPassword: newPass,
        confirmPassword: confirmPass,
      });
      setStep("done");
    } catch {
      setError("حدث خطأ أثناء تغيير كلمة المرور");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100"
      dir="rtl"
    >
      <h2 className="text-lg font-bold text-[var(--primary-color)] mb-4">
        كلمة المرور
      </h2>

      {!open ? (
        <div className="flex items-center justify-between">
          <button
            onClick={() => {
              setOpen(true);
              sendOtp();
            }}
            className="text-sm text-[var(--accent-color)] font-bold hover:underline"
          >
            تغيير كلمة المرور
          </button>
          <p className="text-sm text-gray-500 flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-gray-400 inline-block" />
            يمكن تغيير كلمة المرور مرة واحدة كل 30 يوماً
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {/* Step: verify OTP */}
          {step === "verify" && (
            <>
              <p className="text-sm text-gray-500">
                تم إرسال رمز التحقق إلى{" "}
                <span className="font-bold text-[var(--primary-color)]">
                  {email}
                </span>
              </p>
              <input
                type="text"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                placeholder="أدخل رمز التحقق"
                maxLength={6}
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-center text-lg font-bold tracking-widest text-[var(--primary-color)] outline-none focus:border-[var(--primary-color)]"
                dir="ltr"
              />
            </>
          )}

          {/* Step: new password */}
          {step === "reset" && (
            <>
              <div className="relative">
                <input
                  type={showPass ? "text" : "password"}
                  value={newPass}
                  onChange={(e) => setNewPass(e.target.value)}
                  placeholder="كلمة المرور الجديدة"
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-[var(--primary-color)] outline-none focus:border-[var(--primary-color)] pr-4 pl-10"
                  dir="rtl"
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                >
                  {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              <input
                type={showPass ? "text" : "password"}
                value={confirmPass}
                onChange={(e) => setConfirmPass(e.target.value)}
                placeholder="تأكيد كلمة المرور"
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-[var(--primary-color)] outline-none focus:border-[var(--primary-color)]"
                dir="rtl"
              />
            </>
          )}

          {/* Step: done */}
          {step === "done" && (
            <p className="text-sm text-green-600 font-medium">
              ✓ تم تغيير كلمة المرور بنجاح
            </p>
          )}

          {error && <p className="text-sm text-red-500">{error}</p>}

          <div className="flex items-center gap-3">
            {step === "verify" && (
              <button
                onClick={verifyOtp}
                disabled={loading}
                className="flex items-center gap-2 bg-[var(--accent-color)] text-[var(--primary-color)] font-bold text-sm px-5 py-2.5 rounded-xl hover:bg-[var(--accent-hover)] transition-all disabled:opacity-70"
              >
                {loading && <Loader2 size={14} className="animate-spin" />}
                تحقق من الرمز
              </button>
            )}
            {step === "reset" && (
              <button
                onClick={resetPassword}
                disabled={loading}
                className="flex items-center gap-2 bg-[var(--accent-color)] text-[var(--primary-color)] font-bold text-sm px-5 py-2.5 rounded-xl hover:bg-[var(--accent-hover)] transition-all disabled:opacity-70"
              >
                {loading && <Loader2 size={14} className="animate-spin" />}
                حفظ كلمة المرور
              </button>
            )}
            {step === "done" && (
              <button
                onClick={resetState}
                className="bg-[var(--accent-color)] text-[var(--primary-color)] font-bold text-sm px-5 py-2.5 rounded-xl hover:bg-[var(--accent-hover)] transition-all"
              >
                تم
              </button>
            )}
            {step !== "done" && (
              <button
                onClick={resetState}
                className="text-sm text-gray-400 hover:text-gray-600 transition-all"
              >
                إلغاء
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
