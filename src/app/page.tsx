"use client";

import { useRouter } from "next/navigation";
import Button from "@/components/ui/Button";

// export default function Home() {
//   const router = useRouter();

//   const handleLogin = () => {
//     localStorage.removeItem('token');
//     router.push('/login');
//   };

//   return (
//     <div className="min-h-screen flex items-center justify-center">
//       <Button onClick={handleLogin}>
//         تسجيل الدخول
//       </Button>
//     </div>
//   );
// }

import LandingNavbar from "@/components/landing/Navbar";
import HeroSection from "@/components/landing/HeroSection";
import HowItWorks from "@/components/landing/HowItWorks";
import PopularServices from "@/components/landing/PopularServices";
import TechnicianCTA from "@/components/landing/TechnicianCTA";
import FeaturesSection from "@/components/landing/FeaturesSection";
import FAQSection from "@/components/landing/FAQSection";
import Footer from "@/components/landing/Footer";
import AIDiagnosis from "@/components/landing/AIdiagnosis";
export default function Home() {
  return (
    <main>
      <LandingNavbar />
      <HeroSection />
      <HowItWorks />
      <PopularServices />
      <AIDiagnosis />
      <FeaturesSection />
      <TechnicianCTA />
      <FAQSection />
      <Footer />
    </main>
  );
}
