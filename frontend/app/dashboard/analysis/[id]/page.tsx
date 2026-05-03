"use client";

import { useEffect, useState, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import { Loader2, ArrowLeft, Download, Share2, Calendar, Target, Check, Copy } from "lucide-react";
import RoadmapVisualizer from "@/components/dashboard/RoadmapVisualizer";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

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
  const [isExporting, setIsExporting] = useState(false);
  const [isShared, setIsShared] = useState(false);
  const reportRef = useRef<HTMLDivElement>(null);

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `CAREER_ANALYSIS: ${analysis?.target_role}`,
          text: `VIEW_MY_CAREER_ROADMAP_FOR_${analysis?.target_role}`,
          url: window.location.href,
        });
      } catch (err) {
        console.error("Error sharing:", err);
      }
    } else {
      navigator.clipboard.writeText(window.location.href);
      setIsShared(true);
      setTimeout(() => setIsShared(false), 2000);
    }
  };

  const handleExportPDF = async () => {
    if (!reportRef.current || !analysis) return;
    setIsExporting(true);
    
    try {
      const canvas = await html2canvas(reportRef.current, {
        scale: 2,
        useCORS: true,
        backgroundColor: "#000000",
        logging: false,
        onclone: (clonedDoc) => {
          const el = clonedDoc.getElementById("pdf-content");
          if (el) {
            el.style.padding = "60px";
            el.style.background = "#000000";
            el.style.height = "auto";
            el.style.overflow = "visible";
          }
          
          // Show report header only in PDF
          const header = clonedDoc.getElementById("report-header");
          if (header) header.style.display = "block";

          // Ensure roadmap container is fully visible
          const roadmapContainer = clonedDoc.querySelector(".roadmap-container");
          if (roadmapContainer) {
            (roadmapContainer as HTMLElement).style.height = "800px"; // Fixed height for PDF
          }

          // Hide UI elements
          const noPrint = clonedDoc.querySelectorAll(".no-print");
          noPrint.forEach(item => {
            (item as HTMLElement).style.display = "none";
          });

          // Expand all scrollable lists
          const scrollableLists = clonedDoc.querySelectorAll(".custom-scrollbar");
          scrollableLists.forEach(list => {
            (list as HTMLElement).style.maxHeight = "none";
            (list as HTMLElement).style.overflow = "visible";
          });
        }
      });
      
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");
      const imgProps = pdf.getImageProperties(imgData);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
      
      // If content is very long, we might need multiple pages. 
      // For now, let's use a single long page or standard A4.
      // Scaling to fit A4 width:
      if (pdfHeight > pdf.internal.pageSize.getHeight()) {
        // Multi-page logic
        let heightLeft = pdfHeight;
        let position = 0;
        const pageHeight = pdf.internal.pageSize.getHeight();

        pdf.addImage(imgData, "PNG", 0, position, pdfWidth, pdfHeight);
        heightLeft -= pageHeight;

        while (heightLeft >= 0) {
          position = heightLeft - pdfHeight;
          pdf.addPage();
          pdf.addImage(imgData, "PNG", 0, position, pdfWidth, pdfHeight);
          heightLeft -= pageHeight;
        }
      } else {
        pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
      }

      pdf.save(`CAREER_STRATEGY_REPORT_${analysis.target_role.replace(/\s+/g, '_')}.pdf`);
    } catch (error) {
      console.error("PDF export failed:", error);
    } finally {
      setIsExporting(false);
    }
  };

  useEffect(() => {
    let intervalId: NodeJS.Timeout;

    const fetchDetail = async () => {
      try {
        const res = await fetch(`/api/proxy/analysis/history/${id}`);
        if (res.ok) {
          const data = await res.json();
          setAnalysis(data);
          
          // Stop polling if status is SUCCESS or FAILURE
          if (data.status === 'SUCCESS' || data.status === 'FAILURE') {
            setIsLoading(false);
            if (intervalId) clearInterval(intervalId);
          }
        } else {
          router.push("/dashboard/history");
          if (intervalId) clearInterval(intervalId);
        }
      } catch (error) {
        console.error("Failed to fetch analysis detail:", error);
        setIsLoading(false);
        if (intervalId) clearInterval(intervalId);
      }
    };

    if (id) {
      fetchDetail();
      // Poll every 3 seconds
      intervalId = setInterval(fetchDetail, 3000);
    }

    return () => {
      if (intervalId) clearInterval(intervalId);
    };
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
    <div className="space-y-12 pb-20" id="pdf-content" ref={reportRef}>
      {/* Report Header (Hidden in UI, Visible in PDF) */}
      <div id="report-header" className="hidden border-b-2 border-white/20 pb-10 mb-10">
        <div className="flex justify-between items-start">
          <div className="space-y-2">
            <p className="text-[10px] uppercase tracking-[0.5em] text-white/40">Official_Career_Strategy_Report</p>
            <h1 className="text-4xl font-tech font-bold uppercase tracking-tight text-white">{analysis.target_role}</h1>
          </div>
          <div className="text-right space-y-1">
             <p className="text-[8px] uppercase tracking-widest text-white/40">Generated_on</p>
             <p className="text-xs font-tech font-bold text-white">{new Date(analysis.created_at).toLocaleDateString()}</p>
          </div>
        </div>
      </div>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-8">
        <div className="space-y-4">
          <button 
            onClick={() => router.back()}
            className="flex items-center gap-2 text-[10px] font-bold tracking-[0.2em] text-white/40 hover:text-white transition-colors uppercase no-print"
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
        
        <div className="flex items-center gap-3 no-print">
          <button 
            onClick={handleShare}
            className="p-3 border border-white/10 hover:border-white/40 transition-all flex items-center gap-2"
          >
            {isShared ? <Check className="w-4 h-4 text-emerald-500" /> : <Share2 className="w-4 h-4" />}
            {isShared && <span className="text-[10px] font-bold uppercase tracking-widest">COPIED</span>}
          </button>
          <button 
            onClick={handleExportPDF}
            disabled={isExporting}
            className="px-8 py-3 bg-white text-black text-[10px] font-bold uppercase tracking-[0.2em] flex items-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isExporting ? <Loader2 className="w-3 h-3 animate-spin" /> : <Download className="w-3 h-3" />}
            {isExporting ? "EXPORTING..." : "EXPORT_PDF"}
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
            <div className="mt-2 h-1 w-full bg-white/5 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-emerald-500/40 to-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.4)]" 
                style={{ width: `${Math.round(analysis.result?.match_score || 0)}%` }}
              />
            </div>
          </div>
        </div>
        <div className="card-minimal flex items-center gap-4">
          <div className="w-5 h-5 rounded-full border border-white/20 flex items-center justify-center text-[10px] font-bold">!</div>
          <div>
            <p className="text-[10px] uppercase tracking-widest text-white/40">Gap Count</p>
            <p className="text-xs font-bold uppercase">{analysis.result?.gaps?.length || 0} Critical Nodes</p>
            <div className="mt-2 h-1 w-full bg-white/5 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-red-500/40 to-red-500 shadow-[0_0_8px_rgba(239,68,68,0.4)]" 
                style={{ width: `${Math.min(100, (analysis.result?.gaps?.length || 0) * 10)}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="h-px w-full bg-white/5" />

      {/* Skill Analysis Section */}
      <div className="space-y-8">
        <div className="flex items-center gap-4">
          <h2 className="text-minimal text-white/40 uppercase tracking-[0.3em]">Competency_Matrix</h2>
          <div className="h-px flex-grow bg-white/5" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {/* Matched Skills */}
          <div className="space-y-6">
            <div className="flex items-center justify-between border-b border-emerald-500/20 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-1.5 h-1.5 bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
                <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-500">Matched_Skills</span>
              </div>
              <span className="text-xs font-tech font-bold text-emerald-500/60">{analysis.result?.matched?.length || 0}</span>
            </div>
            <div className="space-y-2 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
              {analysis.result?.matched?.length > 0 ? (
                analysis.result.matched.map((skill: any, idx: number) => (
                  <div key={idx} className="group p-4 border border-white/5 bg-white/[0.01] hover:bg-white/[0.03] transition-all flex justify-between items-center">
                    <span className="text-xs font-medium text-white/80 group-hover:text-white transition-colors">{skill.skill}</span>
                    <div className="flex items-center gap-2">
                       <div className="w-1 h-1 rounded-full bg-emerald-500/40" />
                       <span className="text-[8px] text-emerald-500/40 uppercase tracking-tighter">Verified</span>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-[10px] text-white/10 uppercase tracking-widest italic py-4">No_Direct_Matches_Found</p>
              )}
            </div>
          </div>

          {/* Partial Matches */}
          <div className="space-y-6">
            <div className="flex items-center justify-between border-b border-amber-500/20 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-1.5 h-1.5 bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.5)]" />
                <span className="text-[10px] font-bold uppercase tracking-widest text-amber-500">Partial_Bridge</span>
              </div>
              <span className="text-xs font-tech font-bold text-amber-500/60">{analysis.result?.partial?.length || 0}</span>
            </div>
            <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
              {analysis.result?.partial?.length > 0 ? (
                analysis.result.partial.map((skill: any, idx: number) => (
                  <div key={idx} className="group p-4 border border-white/5 bg-white/[0.01] hover:bg-white/[0.03] transition-all space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-xs font-medium text-white/80 group-hover:text-white transition-colors">{skill.skill}</span>
                      <span className="text-[8px] text-amber-500/60 uppercase tracking-tighter font-bold">{Math.round(skill.similarity_score * 100)}% Match</span>
                    </div>
                    <div className="h-1 w-full bg-white/5 overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-amber-500/20 to-amber-500/60 transition-all duration-1000" 
                        style={{ width: `${skill.similarity_score * 100}%` }} 
                      />
                    </div>
                    {skill.matched_to && (
                      <p className="text-[8px] text-white/20 uppercase tracking-widest">
                        Linked_to: <span className="text-white/40 italic">{skill.matched_to}</span>
                      </p>
                    )}
                  </div>
                ))
              ) : (
                <p className="text-[10px] text-white/10 uppercase tracking-widest italic py-4">No_Partial_Matches_Detected</p>
              )}
            </div>
          </div>

          {/* Critical Gaps */}
          <div className="space-y-6">
            <div className="flex items-center justify-between border-b border-red-500/20 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-1.5 h-1.5 bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.5)]" />
                <span className="text-[10px] font-bold uppercase tracking-widest text-red-500">Critical_Gaps</span>
              </div>
              <span className="text-xs font-tech font-bold text-red-500/60">{analysis.result?.gaps?.length || 0}</span>
            </div>
            <div className="space-y-2 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
              {analysis.result?.gaps?.length > 0 ? (
                analysis.result.gaps.map((skill: any, idx: number) => (
                  <div key={idx} className="group p-4 border border-red-500/10 bg-red-500/[0.02] hover:bg-red-500/[0.05] transition-all flex justify-between items-center border-l-2 border-l-red-500/40">
                    <span className="text-xs font-medium text-white/80 group-hover:text-white transition-colors">{skill.skill}</span>
                    <span className="text-[8px] text-red-500/60 font-bold uppercase tracking-tighter">Mandatory</span>
                  </div>
                ))
              ) : (
                <p className="text-[10px] text-white/10 uppercase tracking-widest italic py-4">No_Skill_Gaps_Found</p>
              )}
            </div>
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
          <div className="h-[600px] w-full border border-white/5 bg-white/[0.02] roadmap-container">
            <RoadmapVisualizer 
              nodes={analysis.result.roadmap.nodes} 
              edges={analysis.result.roadmap.edges} 
            />
          </div>
        </div>
      ) : analysis.status === 'FAILURE' ? (
        <div className="py-40 flex flex-col items-center justify-center border border-red-500/10 bg-red-500/[0.02]">
          <div className="w-12 h-12 rounded-full border border-red-500/20 flex items-center justify-center text-red-500 font-bold mb-6 text-xl">!</div>
          <p className="text-minimal text-red-500/60 uppercase tracking-[0.3em] mb-2">ANALYSIS_FAILED</p>
          <p className="text-[10px] text-white/40 uppercase tracking-widest max-w-md text-center leading-relaxed">
            {analysis.result?.error || "AN_UNEXPECTED_ERROR_OCCURRED_DURING_PIPELINE_EXECUTION"}
          </p>
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
