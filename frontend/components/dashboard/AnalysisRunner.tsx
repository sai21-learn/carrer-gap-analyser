"use client";

import { useState, useEffect } from "react";
import { Play, Loader2, Terminal, AlertTriangle, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";

export default function AnalysisRunner() {
  const [taskId, setTaskId] = useState<string | null>(null);
  const [status, setStatus] = useState<string | null>(null);
  const [result, setResult] = useState<any | null>(null);
  const [progress, setProgress] = useState(0);
  const [targetRole, setTargetRole] = useState<string | null>(null);

  useEffect(() => {
    // Fetch target role from profile
    fetch("/api/proxy/profile/me")
      .then(res => res.json())
      .then(data => {
        setTargetRole(data.profile?.target_role || null);
      })
      .catch(console.error);
  }, []);

  const startAnalysis = async () => {
    if (!targetRole) {
      setStatus("ERROR");
      setResult({ error: "TARGET_ROLE_NOT_DEFINED. PLEASE_UPDATE_SETTINGS." });
      return;
    }

    setTaskId(null);
    setStatus("INITIALIZING");
    setResult(null);
    setProgress(0);

    try {
      const response = await fetch("/api/proxy/analysis/start", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ target_role: targetRole }),
      });

      if (response.ok) {
        const data = await response.json();
        setTaskId(data.task_id);
      } else {
        setStatus("ERROR");
        setResult({ error: "COMMUNICATION_LINK_FAILURE" });
      }
    } catch (e) {
      setStatus("ERROR");
      setResult({ error: "SYSTEM_OFFLINE" });
    }
  };

  useEffect(() => {
    if (!taskId) return;

    const interval = setInterval(async () => {
      try {
        const response = await fetch(`/api/proxy/analysis/status/${taskId}`);
        if (response.ok) {
          const data = await response.json();
          setStatus(data.state);
          if (data.state === "SUCCESS") {
            setResult(data.result);
            setTaskId(null);
            clearInterval(interval);
          } else if (data.state === "FAILURE") {
            setResult({ error: "ANALYSIS_ABORTED_BY_SYSTEM" });
            setTaskId(null);
            clearInterval(interval);
          }
        }
      } catch (e) {
        console.error("Status check failed", e);
      }
    }, 3000);

    return () => clearInterval(interval);
  }, [taskId]);

  useEffect(() => {
    if (status === "PENDING" || status === "STARTING" || status === "INITIALIZING") {
      const timer = setTimeout(() => {
        setProgress((prev) => (prev >= 95 ? 95 : prev + 5));
      }, 5000);
      return () => clearTimeout(timer);
    } else if (status === "SUCCESS") {
      setProgress(100);
    }
  }, [status, progress]);

  return (
    <div className="card-minimal">
      <div className="mb-8">
        <h2 className="text-minimal text-white/40">GAP_SCANNER</h2>
        <p className="text-[10px] text-white/20 uppercase tracking-widest mt-1">
          {targetRole ? `TARGET: ${targetRole}` : "TARGET: NOT_DEFINED"}
        </p>
      </div>

      <div className="space-y-6">
        <button
          onClick={startAnalysis}
          disabled={!!taskId || !targetRole}
          className={cn(
            "w-full btn-minimal",
            (!!taskId || !targetRole) && "opacity-20 cursor-not-allowed"
          )}
        >
          {taskId ? (
            <div className="flex items-center justify-center gap-2">
              <Loader2 className="h-4 w-4 animate-spin" />
              <span>SCANNING...</span>
            </div>
          ) : (
            <div className="flex items-center justify-center gap-2">
              <Play className="h-3 w-3" />
              <span>START_ANALYSIS</span>
            </div>
          )}
        </button>

        {status && (
          <div className="space-y-3">
            <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-[0.2em]">
              <span className="text-white/20">STATUS:</span>
              <span className={cn(
                status === "SUCCESS" ? "text-emerald-500" : 
                status === "ERROR" || status === "FAILURE" ? "text-red-500" : "text-white"
              )}>
                {status}
              </span>
            </div>
            <div className="h-0.5 w-full bg-white/5">
              <div
                className={cn(
                  "h-full transition-all duration-1000",
                  status === "SUCCESS" ? "bg-emerald-500" : 
                  status === "ERROR" || status === "FAILURE" ? "bg-red-500" : "bg-white/40"
                )}
                style={{ width: `${progress}%` }}
              ></div>
            </div>
          </div>
        )}

        {result && (
          <div className="pt-8 border-t border-white/5 space-y-4">
             <div className="flex items-center gap-2">
              <Terminal className="h-3 w-3 text-white/40" />
              <h3 className="text-minimal text-white/40">SCAN_LOG</h3>
            </div>
            
            <div className="bg-black/50 p-4 font-mono text-[10px] leading-relaxed">
              {result.error ? (
                <div className="flex items-center gap-3 text-red-500/60">
                   <AlertTriangle className="h-3 w-3" />
                   <p className="uppercase">{result.error}</p>
                </div>
              ) : (
                <div className="space-y-4">
                   <div className="flex items-center gap-3 text-emerald-500/60 mb-2">
                      <CheckCircle2 className="h-3 w-3" />
                      <p className="uppercase">SCAN_COMPLETE</p>
                   </div>
                   <div className="text-white/40 whitespace-pre-wrap">
                      {JSON.stringify(result, null, 2).split('\n').slice(0, 8).join('\n')}
                      {"\n"}... [SYSTEM_TRUNCATED]
                   </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
