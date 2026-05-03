"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Clock, ChevronRight, Activity, XCircle, CheckCircle2 } from "lucide-react";

interface AnalysisHistory {
  id: number;
  target_role: string;
  status: string;
  created_at: string;
  result: any;
}

export default function AnalysisHistoryPage() {
  const router = useRouter();
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

  if (isLoading) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <div className="flex flex-col items-center gap-6">
          <Loader2 className="h-8 w-8 animate-spin text-white/20" />
          <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-white/20">LOADING_HISTORY...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-1000">
      <div>
        <h1 className="text-2xl font-light tracking-widest uppercase text-white/80">Scan_History</h1>
        <p className="text-xs text-white/40 font-mono mt-2 uppercase">Past gap analysis reports</p>
      </div>

      {history.length === 0 ? (
        <div className="card-minimal flex flex-col items-center justify-center py-16 text-center">
          <Activity className="h-8 w-8 text-white/20 mb-4" />
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/40">NO_RECORDS_FOUND</p>
          <button 
            onClick={() => router.push("/dashboard")}
            className="mt-6 btn-minimal"
          >
            START_NEW_SCAN
          </button>
        </div>
      ) : (
        <div className="grid gap-4">
          {history.map((item) => {
            const date = new Date(item.created_at).toLocaleDateString(undefined, { 
              year: 'numeric', month: 'short', day: 'numeric' 
            });
            const score = item.result?.match_percentage || 0;
            const isSuccess = item.status === "SUCCESS";
            
            return (
              <div 
                key={item.id}
                onClick={() => router.push(`/dashboard/analysis/${item.id}`)}
                className="card-minimal cursor-pointer group hover:border-white/20 transition-all duration-500"
              >
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <h3 className="font-mono text-sm text-white/80 uppercase">{item.target_role}</h3>
                    <div className="flex items-center gap-3 text-[10px] uppercase tracking-widest text-white/40">
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {date}
                      </span>
                      <span>ID: {item.id}</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-6">
                    {isSuccess ? (
                      <div className="text-right">
                        <div className="text-xl font-light text-emerald-500/80">{score}%</div>
                        <div className="text-[10px] uppercase tracking-widest text-emerald-500/40">Match</div>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2 text-red-500/60">
                        <XCircle className="h-4 w-4" />
                        <span className="text-[10px] uppercase tracking-widest">{item.status}</span>
                      </div>
                    )}
                    
                    <ChevronRight className="h-5 w-5 text-white/20 group-hover:text-white/60 transition-colors" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
