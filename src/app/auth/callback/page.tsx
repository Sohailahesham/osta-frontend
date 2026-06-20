"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { getCurrentUser } from "@/services/auth.service";
import { getPostLoginRoute } from "@/lib/auth-redirect";

export default function AuthCallbackPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const accessToken = searchParams.get("access_token");
    const refreshToken = searchParams.get("refresh_token");

    const finalizeLogin = async () => {
      if (accessToken) {
        localStorage.setItem("access_token", accessToken);
      }

      if (refreshToken) {
        localStorage.setItem("refresh_token", refreshToken);
      }

      try {
        const { data } = await getCurrentUser();
        localStorage.setItem("user", JSON.stringify(data.data));
        router.replace(getPostLoginRoute(data.data));
      } catch {
        router.replace("/login");
      }
    };

    void finalizeLogin();
  }, [router, searchParams]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      جاري تسجيل الدخول...
    </div>
  );
}
