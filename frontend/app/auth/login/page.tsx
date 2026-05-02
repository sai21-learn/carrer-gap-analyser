'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/sign-in');
  }, [router]);

  return (
    <div className="flex min-h-screen bg-black text-white items-center justify-center">
      <p className="text-muted-foreground uppercase tracking-widest text-xs">Redirecting to Secure Access...</p>
    </div>
  );
}
