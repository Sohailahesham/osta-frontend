'use client';

import { useRouter } from 'next/navigation';
import Button from '@/components/ui/Button';

export default function Home() {
  const router = useRouter();

  const handleLogin = () => {
    localStorage.removeItem('token');
    router.push('/login');
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <Button onClick={handleLogin}>
        تسجيل الدخول
      </Button>
    </div>
  );
}