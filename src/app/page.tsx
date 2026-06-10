import LandingNavbar from "@/components/sections/landing-page/Navbar";
import HeroSection from "@/components/sections/landing-page/HeroSection";
import HowItWorks from "@/components/sections/landing-page/HowItWorks";
import TechnicianCTA from "@/components/sections/landing-page/TechnicianCTA";
import FeaturesSection from "@/components/sections/landing-page/FeaturesSection";
import FAQSection from "@/components/sections/home/FAQSection";
import Footer from "@/components/layout/Footer";
import AIDiagnosis from "@/components/sections/landing-page/AIdiagnosis";
import "@/styles/sectionsLayout.css";
import MainCategoriesSection from "@/components/sections/landing-page/MainCategoriesSection";
export default function Home() {
  return (
    <main>
      <LandingNavbar />
      <HeroSection />
      <HowItWorks />
      <MainCategoriesSection />
      <AIDiagnosis />
      <FeaturesSection />
      <TechnicianCTA />
      <FAQSection />
      <Footer />
    </main>
  );
}

// 'use client';

// import { useRouter } from 'next/navigation';
// import Button from '@/components/ui/Button';

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
