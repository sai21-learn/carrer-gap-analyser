'use client';

import Sidebar from '@/components/dashboard/Sidebar';
import { useSession } from 'next-auth/react';
import { redirect } from 'next/navigation';
import { Search, Bell, User } from 'lucide-react';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data: session, status } = useSession();

  if (status === 'loading') {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-t-transparent"></div>
      </div>
    );
  }

  if (status === 'unauthenticated') {
    redirect('/auth/login');
  }

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-900">
      <Sidebar />
      <div className="pl-64">
        <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b bg-white/80 px-8 backdrop-blur-md dark:bg-zinc-950/80">
          <div className="relative w-96">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
            <input
              type="text"
              placeholder="Search skills, jobs..."
              className="w-full rounded-full border bg-zinc-50 py-2 pl-10 pr-4 text-sm outline-none transition-all focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:border-zinc-800 dark:bg-zinc-900"
            />
          </div>

          <div className="flex items-center space-x-4">
            <button className="rounded-full p-2 text-zinc-600 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-zinc-800">
              <Bell className="h-5 w-5" />
            </button>
            <div className="h-8 w-8 overflow-hidden rounded-full bg-blue-100 dark:bg-blue-900/40">
              {session?.user?.image ? (
                <img src={session.user.image} alt={session.user.name || 'User'} className="h-full w-full object-cover" />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-sm font-semibold text-blue-600 dark:text-blue-400">
                  {session?.user?.name?.[0] || <User className="h-4 w-4" />}
                </div>
              )}
            </div>
          </div>
        </header>

        <main className="p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
