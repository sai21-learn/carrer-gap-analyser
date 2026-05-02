"use client";

import { useEffect, useState } from "react";
import RoadmapVisualizer from "@/components/dashboard/RoadmapVisualizer";
import { Loader2, Map as MapIcon, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function RoadmapPage({ params }: { params: { id: string } }) {
  const [data, setData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch(`/api/analysis/roadmap/${params.id}`)
      .then((res) => {
        if (!res.ok) throw new Error("ROADMAP_FETCH_FAILURE");
        return res.json();
      })
      .then(setData)
      .catch((err) => setError(err.message));
  }, [params.id]);

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-full space-y-4">
        <div className="text-red-500 font-tech uppercase tracking-[0.2em]">Error: {error}</div>
        <Link href="/dashboard" className="text-[10px] uppercase tracking-widest text-muted-foreground hover:text-white transition-colors">
          Return_to_Base
        </Link>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="flex flex-col items-center justify-center h-full space-y-6">
        <Loader2 className="h-8 w-8 animate-spin text-white/20" />
        <p className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground">Mapping_Pathways...</p>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col space-y-12 animate-in fade-in duration-700">
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <div className="flex items-center gap-3">
             <MapIcon className="h-4 w-4 text-white" />
             <p className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground">Strategic_Roadmap</p>
          </div>
          <h1 className="text-4xl font-tech font-bold tracking-tight uppercase">
            Learning_Path
          </h1>
        </div>
        <Link 
          href="/dashboard"
          className="group flex items-center gap-3 border border-white/10 px-6 py-3 hover:bg-white hover:text-black transition-all"
        >
          <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
          <span className="text-[10px] font-bold uppercase tracking-[0.2em]">Exit_View</span>
        </Link>
      </div>

      <div className="flex-grow border border-white/10 bg-white/5 relative overflow-hidden group">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[length:24px_24px]"></div>
        <RoadmapVisualizer nodes={data.nodes} edges={data.edges} />
        
        {/* Aesthetic overlays */}
        <div className="absolute top-8 left-8 p-4 border-l border-t border-white/20"></div>
        <div className="absolute bottom-8 right-8 p-4 border-r border-b border-white/20"></div>
      </div>
    </div>
  );
}
