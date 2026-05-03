"use client";

import { useState, useEffect } from "react";
import { Play, Loader2, Terminal, AlertTriangle, CheckCircle2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

export default function AnalysisRunner() {
  const [taskId, setTaskId] = useState<string | null>(null);
  const [status, setStatus] = useState<string | null>(null);
  const [result, setResult] = useState<any | null>(null);
  const [progress, setProgress] = useState(0);
  const [targetRoles, setTargetRoles] = useState<string[]>([]);
  const [selectedRole, setSelectedRole] = useState<string | null>(null);
  const [analysisId, setAnalysisId] = useState<number | null>(null);
  const router = useRouter();

  useEffect(() => {
    // Fetch target roles from profile
    fetch("/api/proxy/profile/me")
      .then(res => res.json())
      .then(data => {
        const roles = data.profile?.target_roles || (data.profile?.target_role ? [data.profile.target_role] : []);
        setTargetRoles(roles);
        if (roles.length > 0) setSelectedRole(roles[0]);
      })
      .catch(console.error);
  }, []);

  const startAnalysis = async () => {
    if (!selectedRole) {
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
        body: JSON.stringify({ target_role: selectedRole }),
      });

      if (response.ok) {
        const data = await response.json();
        setTaskId(data.task_id);
        setAnalysisId(data.analysis_id);
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
            setResult(data.result || data);
            setStatus("SUCCESS");
            setProgress(100);
            setTaskId(null);
            clearInterval(interval);
            // Navigate after a short delay
            setTimeout(() => {
              if (analysisId) {
                router.push(`/dashboard/analysis/${analysisId}`);
              } else {
                router.push(`/dashboard/analysis`);
              }
            }, 1500);
          } else if (data.state === "FAILURE") {
            setResult({ error: "ANALYSIS_ABORTED_BY_SYSTEM" });
            setStatus("FAILURE");
            setTaskId(null);
            clearInterval(interval);
          } else if (data.meta) {
            // Update progress and status based on backend metadata
            if (data.meta.progress) setProgress(data.meta.progress);
            if (data.meta.stage) setStatus(data.meta.stage);
          }
        }
      } catch (e) {
        console.error("Status check failed", e);
      }
    }, 3000);

    return () => clearInterval(interval);
  }, [taskId]);

  // Removed automatic increment as we now have real backend progress reporting

  return (
    <div className="card-minimal">
      <div className="mb-8">
        <h2 className="text-minimal text-white/40">GAP_SCANNER</h2>
        <div className="mt-4 space-y-4">
          <div className="space-y-1">
            <p className="text-[8px] text-white/20 uppercase tracking-[0.3em]">SELECT_ACTIVE_TARGET</p>
            {targetRoles.length > 1 ? (
              <select 
                value={selectedRole || ""} 
                onChange={(e) => setSelectedRole(e.target.value)}
                className="w-full bg-black border border-white/10 p-2 text-[10px] font-mono uppercase focus:border-white/40 outline-none transition-all"
              >
                {targetRoles.map(role => (
                  <option key={role} value={role}>{role}</option>
                ))}
              </select>
            ) : (
              <p className="text-[10px] text-white/60 font-mono uppercase">
                {selectedRole || "NOT_DEFINED"}
              </p>
            )}
          </div>
        </div>
      </div>

      <div className="space-y-6">
        <button
          onClick={startAnalysis}
          disabled={!!taskId || !selectedRole}
          className={cn(
            "w-full btn-minimal",
            (!!taskId || !selectedRole) && "opacity-20 cursor-not-allowed"
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
                   <div className="text-white/40 space-y-2">
                      <p>MATCH_SCORE: {result.match_percentage || (result.result?.match_percentage) || 0}%</p>
                      <p>GAPS_DETECTED: {result.gaps?.length || result.result?.gaps?.length || 0}</p>
                      <p>MATCHED_SKILLS: {result.matched?.length || result.result?.matched?.length || 0}</p>
                   </div>
                   <button 
                     onClick={() => router.push(analysisId ? `/dashboard/analysis/${analysisId}` : `/dashboard/analysis`)}
                     className="mt-4 text-emerald-500/80 hover:text-emerald-400 text-[10px] uppercase tracking-widest border border-emerald-500/30 px-3 py-1.5 transition-colors"
                   >
                     VIEW_FULL_REPORT →
                   </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
