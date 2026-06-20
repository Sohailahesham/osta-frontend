"use client";

import { useEffect, useState } from "react";
import Navbar from "@/components/layout/client/Navbar";
import Footer from "@/components/layout/Footer";
import ProfileHeroSection from "@/components/sections/client/profile/ProfileHeroSection";
import ContactInfoSection from "@/components/sections/client/profile/ContactInfoSection";
import PasswordSection from "@/components/sections/client/profile/PasswordSection";
import { api } from "@/api/axios";

interface UserProfile {
  fullName: string;
  email: string;
  phone: string;
  isVerified: boolean;
  createdAt: string;
  governorate?: string;
  city?: string;
}

export default function ProfilePage() {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get<{ data: UserProfile }>("/users/me")
      .then((res) => {
        const u = res.data?.data ?? (res.data as unknown as UserProfile);
        setUser(u);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        {/* Skeleton hero */}
        <div className="primary-gradient w-full py-10 px-8 md:px-16 lg:px-24 flex items-center justify-end gap-6">
          <div className="text-right space-y-2">
            <div className="h-8 w-48 bg-white/10 rounded-xl animate-pulse ml-auto" />
            <div className="h-4 w-36 bg-white/10 rounded-xl animate-pulse ml-auto" />
            <div className="h-3 w-28 bg-white/10 rounded-xl animate-pulse ml-auto" />
          </div>
          <div className="w-20 h-20 rounded-full bg-white/10 animate-pulse flex-shrink-0" />
        </div>
        <div className="max-w-4xl mx-auto px-4 py-10 space-y-4">
          <div className="h-40 bg-white rounded-2xl animate-pulse" />
          <div className="h-24 bg-white rounded-2xl animate-pulse" />
        </div>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gray-50">

      <ProfileHeroSection
        fullName={user.fullName}
        email={user.email}
        isVerified={user.isVerified}
        createdAt={user.createdAt}
        onEditClick={() => {
          document
            .getElementById("contact-section")
            ?.scrollIntoView({ behavior: "smooth" });
        }}
      />

      <div
        id="contact-section"
        className="max-w-4xl mx-auto px-4 md:px-8 py-10 space-y-5"
      >
        <ContactInfoSection
          email={user.email}
          phone={user.phone ?? ""}
          onSaved={(newPhone) =>
            setUser((u) => (u ? { ...u, phone: newPhone } : u))
          }
        />

        <PasswordSection email={user.email} />
      </div>

      
    </div>
  );
}
