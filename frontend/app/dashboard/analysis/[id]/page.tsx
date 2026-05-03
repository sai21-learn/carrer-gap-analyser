"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Loader2, ArrowLeft, Download, Share2, Calendar, Target } from "lucide-react";
import RoadmapVisualizer from "@/components/dashboard/RoadmapVisualizer";

interface AnalysisDetail {
  id: number;
  target_role: string;
  status: string;
  created_at: string;
  result: any;
}

export default function AnalysisDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const [analysis, setAnalysis] = useState<AnalysisDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchDetail = async () => {
      try {
        const res = await fetch(`/api/proxy/analysis/history/${id}`);
        if (res.ok) {
          const data = await res.json();
          setAnalysis(data);
        } else {
          router.push("/dashboard/history");
        }
      } catch (error) {
        console.error("Failed to fetch analysis detail:", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (id) {
      fetchDetail();
    }
  }, [id, router]);

  if (isLoading) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-white/20" />
      </div>
    );
  }

  if (!analysis) return null;

  return (
    <div className="space-y-12 pb-20">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-8">
        <div className="space-y-4">
          <button 
            onClick={() => router.back()}
            className="flex items-center gap-2 text-[10px] font-bold tracking-[0.2em] text-white/40 hover:text-white transition-colors uppercase"
          >
            <ArrowLeft className="w-3 h-3" />
            RETURN_TO_ARCHIVE
          </button>
          <div className="flex items-center gap-4">
             <p className="text-minimal text-white/40">ANALYSIS_REPORT_#{analysis.id}</p>
             <span className={`text-[8px] px-2 py-0.5 border ${analysis.status === 'SUCCESS' ? 'border-emerald-500/40 text-emerald-500' : 'border-red-500/40 text-red-500'} uppercase tracking-widest`}>
               {analysis.status}
             </span>
          </div>
          <h1 className="text-4xl md:text-6xl font-tech font-bold tracking-tighter uppercase italic leading-none">
            {analysis.target_role}
          </h1>
        </div>
        
        <div className="flex items-center gap-3">
          <button className="p-3 border border-white/10 hover:border-white/40 transition-all">
            <Share2 className="w-4 h-4" />
          </button>
          <button className="px-8 py-3 bg-white text-black text-[10px] font-bold uppercase tracking-[0.2em] flex items-center gap-3">
            <Download className="w-3 h-3" />
            EXPORT_PDF
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card-minimal flex items-center gap-4">
          <Calendar className="w-5 h-5 text-white/20" />
          <div>
            <p className="text-[10px] uppercase tracking-widest text-white/40">Timestamp</p>
            <p className="text-xs font-bold uppercase">{new Date(analysis.created_at).toLocaleString()}</p>
          </div>
        </div>
        <div className="card-minimal flex items-center gap-4">
          <Target className="w-5 h-5 text-white/20" />
          <div>
            <p className="text-[10px] uppercase tracking-widest text-white/40">Match Score</p>
            <p className="text-xs font-bold uppercase">{Math.round(analysis.result?.match_score || 0)}% Compatibility</p>
          </div>
        </div>
        <div className="card-minimal flex items-center gap-4">
          <div className="w-5 h-5 rounded-full border border-white/20 flex items-center justify-center text-[10px] font-bold">!</div>
          <div>
            <p className="text-[10px] uppercase tracking-widest text-white/40">Gap Count</p>
            <p className="text-xs font-bold uppercase">{analysis.result?.gaps?.length || 0} Critical Nodes</p>
          </div>
        </div>
      </div>

      <div className="h-px w-full bg-white/5" />

      {analysis.status === "SUCCESS" && analysis.result?.roadmap ? (
        <div className="space-y-8">
          <div className="flex justify-between items-end">
            <h2 className="text-minimal text-white/40 uppercase tracking-[0.3em]">Dynamic_Roadmap_Visualizer</h2>
            <p className="text-[10px] text-white/20 italic">Interactive_Node_Graph_Ready</p>
          </div>
          <div className="h-[600px] w-full border border-white/5 bg-white/[0.02]">
            <RoadmapVisualizer 
              nodes={analysis.result.roadmap.nodes} 
              edges={analysis.result.roadmap.edges} 
            />
          </div>
        </div>
      ) : (
        <div className="py-40 flex flex-col items-center justify-center border border-dashed border-white/5 opacity-20">
          <Loader2 className="w-12 h-12 animate-spin mb-6" />
          <p className="text-minimal">PROCESSING_ROADMAP_DATA...</p>
        </div>
      )}
    </div>
  );
}
