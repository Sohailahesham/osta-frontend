import Footer from '@/components/layout/Footer';
import VerificationGate from '@/components/auth/VerificationGate';
import "@/styles/sectionsLayout.css";

export default function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <VerificationGate allowedRoles={["technician"]}>
      <>
        <main>
          {children}
        </main>
        <Footer />
      </>
    </VerificationGate>
  );
}
