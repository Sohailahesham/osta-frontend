import LandingNavbar from "@/components/sections/landing-page/Navbar";
import HeroSection from "@/components/sections/landing-page/HeroSection";
import HowItWorks from "@/components/sections/landing-page/HowItWorks";
import PopularServices from "@/components/sections/landing-page/PopularServices";
import TechnicianCTA from "@/components/sections/landing-page/TechnicianCTA";
import FeaturesSection from "@/components/sections/landing-page/FeaturesSection";
import FAQSection from "@/components/sections/landing-page/FAQSection";
import Footer from "@/components/sections/landing-page/Footer";
import AIDiagnosis from "@/components/sections/landing-page/AIdiagnosis";
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