"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export default function AuthCallbackPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const accessToken = searchParams.get("access_token");

    const refreshToken = searchParams.get("refresh_token");

    if (accessToken) {
      localStorage.setItem("access_token", accessToken);
    }

    if (refreshToken) {
      localStorage.setItem("refresh_token", refreshToken);
    }

    router.replace("/home");
  }, [router, searchParams]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      جاري تسجيل الدخول...
    </div>
  );
}
