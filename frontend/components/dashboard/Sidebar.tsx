'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  BarChart2,
  BookOpen,
  History,
  Settings,
  LogOut,
  Terminal,
  ShieldCheck
} from 'lucide-react';
import { useClerk, UserButton } from '@clerk/nextjs';
import { dark } from '@clerk/themes';

const navigation = [
  { name: 'OVERVIEW', href: '/dashboard', icon: LayoutDashboard },
  { name: 'SKILL_ANALYSIS', href: '/dashboard/analysis', icon: BarChart2 },
  { name: 'RESOURCES', href: '/dashboard/resources', icon: BookOpen },
  { name: 'HISTORY', href: '/dashboard/history', icon: History },
];

export default function Sidebar() {
  const pathname = usePathname();
  const { signOut } = useClerk();

  return (
    <aside className="fixed left-0 top-0 z-40 h-screen w-64 border-r border-white/5 bg-black">
      <div className="flex h-full flex-col p-6">
        <div className="mb-12 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-white flex items-center justify-center">
               <Terminal className="w-5 h-5 text-black" />
            </div>
            <span className="text-sm font-tech font-bold tracking-widest text-white uppercase">
              Analyzer.v1
            </span>
          </div>
          <ShieldCheck className="w-4 h-4 text-white/20" />
        </div>

        <nav className="flex-1 space-y-2">
          {navigation.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center gap-4 px-3 py-3 text-[10px] font-bold tracking-[0.2em] transition-all relative group ${
                  isActive
                    ? 'text-white'
                    : 'text-muted-foreground hover:text-white'
                }`}
              >
                {isActive && (
                  <span className="absolute left-0 w-[2px] h-4 bg-white" />
                )}
                <item.icon className={`h-4 w-4 transition-colors ${isActive ? 'text-white' : 'text-muted-foreground group-hover:text-white'}`} />
                {item.name}
              </Link>
            );
          })}
        </nav>

        <div className="mt-auto space-y-4 pt-8 border-t border-white/5">
          <div className="flex items-center gap-4 px-3 py-2">
            <UserButton 
              appearance={{
                baseTheme: dark,
                elements: {
                  userButtonAvatarBox: "h-8 w-8 rounded-none border border-white/10",
                  userButtonTrigger: "focus:shadow-none"
                }
              }}
            />
            <div className="flex flex-col">
              <span className="text-[10px] font-bold uppercase tracking-widest text-white">Active_Session</span>
              <span className="text-[8px] uppercase tracking-widest text-muted-foreground">Secure_Link_Established</span>
            </div>
          </div>

          <div className="space-y-1">
            <Link
              href="/dashboard/settings"
              className={`flex items-center gap-4 px-3 py-3 text-[10px] font-bold tracking-[0.2em] transition-all ${
                pathname === '/dashboard/settings'
                  ? 'text-white'
                  : 'text-muted-foreground hover:text-white'
              }`}
            >
              <Settings className="h-4 w-4" />
              SETTINGS
            </Link>
            <button
              onClick={() => signOut({ redirectUrl: '/' })}
              className="flex w-full items-center gap-4 px-3 py-3 text-[10px] font-bold tracking-[0.2em] text-red-500/70 transition-all hover:text-red-500 hover:bg-red-500/5"
            >
              <LogOut className="h-4 w-4" />
              LOG_OUT
            </button>
          </div>
        </div>
      </div>
    </aside>
  );
}
