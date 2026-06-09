import HeroSection from "@/components/sections/home/HeroSection";
import MainCategoriesSection from "@/components/sections/home/MainCategoriesSection";
import CommonServicesSection from "@/components/sections/home/CommonServicesSection";
import HowItWorksSection from "@/components/sections/home/HowItWorksSection";
import TestimonialsSection from "@/components/sections/home/TestimonialsSection";
import FAQSection from "@/components/sections/home/FAQSection";

export default function HomePage() {
  return (
    <div className="min-h-screen">
      <HeroSection />
      <MainCategoriesSection />
      <CommonServicesSection />
      <HowItWorksSection />
      <TestimonialsSection />
      <FAQSection />
    </div>
  );
}