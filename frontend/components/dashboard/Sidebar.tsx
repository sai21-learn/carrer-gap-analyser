'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  BarChart2,
  BookOpen,
  History,
  Settings,
  LogOut
} from 'lucide-react';
import { signOut } from 'next-auth/react';

const navigation = [
  { name: 'Overview', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Skill Analysis', href: '/dashboard/analysis', icon: BarChart2 },
  { name: 'Resources', href: '/dashboard/resources', icon: BookOpen },
  { name: 'History', href: '/dashboard/history', icon: History },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed left-0 top-0 z-40 h-screen w-64 border-r bg-white transition-transform dark:bg-zinc-950">
      <div className="flex h-full flex-col px-3 py-4">
        <div className="mb-8 flex items-center px-2 py-3">
          <span className="text-xl font-bold tracking-tight text-blue-600 dark:text-blue-500">
            CareerCompass AI
          </span>
        </div>

        <nav className="flex-1 space-y-1">
          {navigation.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400'
                    : 'text-zinc-600 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-zinc-800'
                }`}
              >
                <item.icon className="mr-3 h-5 w-5" />
                {item.name}
              </Link>
            );
          })}
        </nav>

        <div className="mt-auto border-t pt-4 dark:border-zinc-800">
          <Link
            href="/dashboard/settings"
            className={`flex items-center rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
              pathname === '/dashboard/settings'
                ? 'bg-zinc-100 text-zinc-900 dark:bg-zinc-800 dark:text-zinc-100'
                : 'text-zinc-600 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-zinc-800'
            }`}
          >
            <Settings className="mr-3 h-5 w-5" />
            Settings
          </Link>
          <button
            onClick={() => signOut({ callbackUrl: '/' })}
            className="mt-1 flex w-full items-center rounded-lg px-3 py-2 text-sm font-medium text-red-600 transition-colors hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20"
          >
            <LogOut className="mr-3 h-5 w-5" />
            Sign Out
          </button>
        </div>
      </div>
    </aside>
  );
}
