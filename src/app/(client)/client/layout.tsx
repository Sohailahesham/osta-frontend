import Footer from '@/components/layout/Footer';
import ChatFloatingButton from '@/components/sections/client/ai-chat/chat-floating-button';
import "@/styles/sectionsLayout.css";

export default function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <main>
        {children}
      </main>
      <ChatFloatingButton/>
      <Footer />
    </>
  );
}