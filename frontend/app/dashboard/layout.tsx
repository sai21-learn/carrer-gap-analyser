'use client';

import Sidebar from '@/components/dashboard/Sidebar';
import { useUser, UserButton } from '@clerk/nextjs';
import { redirect } from 'next/navigation';
import { Search, Bell, Loader2 } from 'lucide-react';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, isLoaded, isSignedIn } = useUser();

  if (!isLoaded) {
    return (
      <div className="flex h-screen bg-black items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-white" />
      </div>
    );
  }

  if (!isSignedIn) {
    redirect('/sign-in');
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <Sidebar />
      <div className="pl-64">
        <header className="sticky top-0 z-30 flex h-20 w-full items-center justify-between border-b border-white/5 bg-black/50 px-8 backdrop-blur-xl">
          <div className="relative w-96 group">
            <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground group-focus-within:text-white transition-colors" />
            <input
              type="text"
              placeholder="SEARCH_SYSTEM..."
              className="w-full bg-white/5 border border-white/10 rounded-none py-2.5 pl-12 pr-4 text-xs tracking-widest uppercase outline-none transition-all focus:border-white/40 focus:bg-white/10"
            />
          </div>

          <div className="flex items-center space-x-6">
            <button className="text-muted-foreground hover:text-white transition-colors">
              <Bell className="h-5 w-5" />
            </button>
            <div className="flex items-center gap-4">
              <div className="text-right hidden sm:block">
                <p className="text-[10px] uppercase tracking-widest text-muted-foreground">Logged as</p>
                <p className="text-xs font-bold uppercase">{user?.fullName || user?.username || 'OPERATOR'}</p>
              </div>
              <UserButton />
            </div>
          </div>
        </header>

        <main className="p-10 max-w-7xl">
          {children}
        </main>
      </div>
    </div>
  );
}
