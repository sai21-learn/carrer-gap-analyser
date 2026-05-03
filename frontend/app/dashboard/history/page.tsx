"use client";

import { useEffect, useState } from "react";
import { History as HistoryIcon, Clock, ChevronRight, Loader2, BarChart3 } from "lucide-react";
import Link from "next/link";

interface AnalysisHistory {
  id: number;
  target_role: string;
  status: string;
  created_at: string;
}

export default function HistoryPage() {
  const [history, setHistory] = useState<AnalysisHistory[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const res = await fetch("/api/proxy/analysis/history");
        if (res.ok) {
          const data = await res.json();
          setHistory(data);
        }
      } catch (error) {
        console.error("Failed to fetch history:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchHistory();
  }, []);

  return (
    <div className="space-y-12">
      <div className="space-y-4">
        <p className="text-minimal text-white/40">TEMPORAL_LOGS</p>
        <h1 className="text-5xl md:text-7xl font-tech font-bold tracking-tighter uppercase italic">
          HISTORY
        </h1>
      </div>

      <div className="h-px w-full bg-white/5" />

      <div className="space-y-1">
        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="h-6 w-6 animate-spin text-white/20" />
          </div>
        ) : history.length > 0 ? (
          history.map((item) => (
            <Link
              key={item.id}
              href={`/dashboard/analysis/${item.id}`}
              className="flex items-center justify-between p-8 border border-white/5 hover:border-white/20 bg-white/[0.02] hover:bg-white/[0.04] transition-all group"
            >
              <div className="flex items-center gap-8">
                <div className="w-12 h-12 border border-white/10 flex items-center justify-center group-hover:bg-white group-hover:text-black transition-all">
                  <BarChart3 className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-tech font-bold uppercase tracking-widest text-white mb-2">
                    {item.target_role}
                  </h3>
                  <div className="flex items-center gap-4 text-[10px] text-white/40 uppercase tracking-widest">
                    <div className="flex items-center gap-2">
                      <Clock className="w-3 h-3" />
                      {new Date(item.created_at).toLocaleDateString()}
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`w-1.5 h-1.5 rounded-full ${item.status === 'SUCCESS' ? 'bg-emerald-500' : 'bg-red-500'}`} />
                      {item.status}
                    </div>
                  </div>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-white/20 group-hover:text-white group-hover:translate-x-2 transition-all" />
            </Link>
          ))
        ) : (
          <div className="py-20 border border-dashed border-white/5 flex flex-col items-center justify-center opacity-20 text-center">
            <HistoryIcon className="h-12 w-12 mb-6" />
            <p className="text-minimal">NO_HISTORY_LOGS. SYSTEM_CLEAR.</p>
          </div>
        )}
      </div>
    </div>
  );
}
