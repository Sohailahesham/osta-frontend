import Footer from '@/components/layout/Footer';
import "@/styles/sectionsLayout.css";

export default function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <main>
        {children}
      </main>
      <Footer />
    </>
  );
}