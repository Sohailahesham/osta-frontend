import HeroSection from "@/components/sections/categories/HeroSection";
import CategoriesSection from "@/components/sections/categories/CategoriesSection";

export default function HomePage() {
  return (
    <div className="min-h-screen">
      <HeroSection />
      <CategoriesSection />
    </div>
  );
}