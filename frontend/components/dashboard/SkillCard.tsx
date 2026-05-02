'use client';

import { ChevronRight } from 'lucide-react';
import Link from 'next/link';
import ProgressBar from '../ui/ProgressBar';

export type SkillStatus = 'Matched' | 'Partial' | 'Gap';

interface SkillCardProps {
  name: string;
  status: SkillStatus;
  score: number;
  description?: string;
}

export default function SkillCard({ name, status, score, description }: SkillCardProps) {
  const statusColors = {
    Matched: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400',
    Partial: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
    Gap: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
  };

  const progressColors = {
    Matched: 'bg-emerald-500',
    Partial: 'bg-amber-500',
    Gap: 'bg-red-500',
  };

  return (
    <div className="group rounded-xl border border-zinc-200 bg-white p-5 shadow-sm transition-all hover:shadow-md dark:border-zinc-800 dark:bg-zinc-950">
      <div className="mb-4 flex items-start justify-between">
        <div className="flex-1 pr-4">
          <h3 className="font-semibold text-zinc-900 dark:text-zinc-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
            {name}
          </h3>
          {description && <p className="mt-1 text-xs text-zinc-500 leading-relaxed">{description}</p>}
        </div>
        <span className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${statusColors[status]}`}>
          {status}
        </span>
      </div>

      <div className="mt-4">
        <ProgressBar
          value={score}
          label="Proficiency"
          color={progressColors[status]}
          className="mb-4"
        />
      </div>

      <div className="mt-4 flex items-center justify-between border-t border-zinc-100 pt-4 dark:border-zinc-800">
        <Link
          href="/dashboard/roadmap"
          className="flex items-center text-xs font-medium text-blue-600 transition-colors hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
        >
          View Roadmap
          <ChevronRight className="ml-1 h-3 w-3 transition-transform group-hover:translate-x-0.5" />
        </Link>
      </div>
    </div>
  );
}
