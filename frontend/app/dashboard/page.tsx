'use client';

import {
  TrendingUp,
  Briefcase,
  Target,
  ChevronRight,
  BrainCircuit,
  ArrowUpRight
} from 'lucide-react';
import { useSession } from 'next-auth/react';

const stats = [
  {
    name: 'Current Match Score',
    value: '72%',
    change: '+5.4%',
    trend: 'up',
    icon: Target,
    color: 'text-blue-600',
    bg: 'bg-blue-100/50 dark:bg-blue-900/20',
  },
  {
    name: 'Analyzed Jobs',
    value: '24',
    change: '+12',
    trend: 'up',
    icon: Briefcase,
    color: 'text-purple-600',
    bg: 'bg-purple-100/50 dark:bg-purple-900/20',
  },
  {
    name: 'Top Skill Gaps',
    value: '4',
    change: '-2',
    trend: 'down',
    icon: BrainCircuit,
    color: 'text-amber-600',
    bg: 'bg-amber-100/50 dark:bg-amber-900/20',
  },
];

export default function DashboardPage() {
  const { data: session } = useSession();

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">
          Welcome back, {session?.user?.name?.split(' ')[0] || 'User'}!
        </h1>
        <p className="text-zinc-500 dark:text-zinc-400">
          Here's what's happening with your career progress today.
        </p>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {stats.map((stat) => (
          <div key={stat.name} className="rounded-xl border bg-white p-6 shadow-sm dark:bg-zinc-950">
            <div className="flex items-center justify-between">
              <div className={`rounded-lg ${stat.bg} p-2.5`}>
                <stat.icon className={`h-6 w-6 ${stat.color}`} />
              </div>
              <span className={`flex items-center text-sm font-medium ${
                stat.trend === 'up' ? 'text-emerald-600' : 'text-zinc-500'
              }`}>
                {stat.change}
                {stat.trend === 'up' && <TrendingUp className="ml-1 h-4 w-4" />}
              </span>
            </div>
            <div className="mt-4">
              <p className="text-sm font-medium text-zinc-500 dark:text-zinc-400">{stat.name}</p>
              <p className="text-3xl font-bold">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-xl border bg-white p-6 shadow-sm dark:bg-zinc-950">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-lg font-semibold">Recommended Focus</h2>
            <button className="text-sm font-medium text-blue-600 hover:underline dark:text-blue-400">
              View all
            </button>
          </div>
          <div className="space-y-4">
            {[
              { skill: 'System Design', importance: 'Critical', source: 'Backend Engineer at Stripe' },
              { skill: 'GraphQL', importance: 'High', source: 'Fullstack Role at Vercel' },
              { skill: 'Docker', importance: 'Medium', source: 'SRE at Datadog' },
            ].map((item) => (
              <div key={item.skill} className="flex items-center justify-between rounded-lg border border-zinc-100 p-4 transition-colors hover:bg-zinc-50 dark:border-zinc-800 dark:hover:bg-zinc-900">
                <div>
                  <h3 className="font-medium">{item.skill}</h3>
                  <p className="text-xs text-zinc-500">Required for: {item.source}</p>
                </div>
                <div className="flex items-center space-x-3">
                  <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${
                    item.importance === 'Critical' ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' :
                    item.importance === 'High' ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400' :
                    'bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-400'
                  }`}>
                    {item.importance}
                  </span>
                  <ChevronRight className="h-4 w-4 text-zinc-400" />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-xl border bg-white p-6 shadow-sm dark:bg-zinc-950">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-lg font-semibold">Learning Path Progress</h2>
            <button className="text-sm font-medium text-blue-600 hover:underline dark:text-blue-400">
              Continue
            </button>
          </div>
          <div className="space-y-6">
            <div>
              <div className="mb-2 flex items-center justify-between text-sm">
                <span className="font-medium">React Performance</span>
                <span className="text-zinc-500">65%</span>
              </div>
              <div className="h-2 w-full overflow-hidden rounded-full bg-zinc-100 dark:bg-zinc-800">
                <div className="h-full bg-blue-600 transition-all" style={{ width: '65%' }}></div>
              </div>
            </div>
            <div>
              <div className="mb-2 flex items-center justify-between text-sm">
                <span className="font-medium">TypeScript Advanced Types</span>
                <span className="text-zinc-500">30%</span>
              </div>
              <div className="h-2 w-full overflow-hidden rounded-full bg-zinc-100 dark:bg-zinc-800">
                <div className="h-full bg-blue-600 transition-all" style={{ width: '30%' }}></div>
              </div>
            </div>
            <div className="rounded-lg bg-zinc-50 p-4 dark:bg-zinc-900">
              <div className="flex items-start space-x-3">
                <div className="mt-1 rounded-md bg-white p-1 shadow-sm dark:bg-zinc-800">
                  <ArrowUpRight className="h-4 w-4 text-blue-600" />
                </div>
                <div>
                  <h4 className="text-sm font-semibold">New Resource Available</h4>
                  <p className="text-xs text-zinc-500">"Mastering Distributed Systems" - Added based on your analysis.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
