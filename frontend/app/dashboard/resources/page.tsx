"use client";

import { useEffect, useState } from "react";
import { BookOpen, ExternalLink, Search, Tag, Loader2 } from "lucide-react";

interface Resource {
  title: string;
  url: string;
  platform: string;
  type: string;
}

export default function ResourcesPage() {
  const [resources, setResources] = useState<Resource[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchResources = async () => {
      try {
        // In a real app, this might come from a specific endpoint or be extracted from history
        const res = await fetch("/api/proxy/analysis/history");
        if (res.ok) {
          const data = await res.json();
          // Extract unique resources from history
          const allResources: Resource[] = [];
          data.forEach((item: any) => {
            if (item.result?.roadmap?.nodes) {
              item.result.roadmap.nodes.forEach((node: any) => {
                if (node.data?.resources) {
                  allResources.push(...node.data.resources);
                }
              });
            }
          });
          // Unique by URL
          const unique = Array.from(new Map(allResources.map(r => [r.url, r])).values());
          setResources(unique);
        }
      } catch (error) {
        console.error("Failed to fetch resources:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchResources();
  }, []);

  return (
    <div className="space-y-12">
      <div className="space-y-4">
        <p className="text-minimal text-white/40">KNOWLEDGE_BASE</p>
        <h1 className="text-5xl md:text-7xl font-tech font-bold tracking-tighter uppercase italic">
          RESOURCES
        </h1>
      </div>

      <div className="h-px w-full bg-white/5" />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {isLoading ? (
          <div className="col-span-full flex items-center justify-center py-20">
            <Loader2 className="h-6 w-6 animate-spin text-white/20" />
          </div>
        ) : resources.length > 0 ? (
          resources.map((resource, i) => (
            <a
              key={i}
              href={resource.url}
              target="_blank"
              rel="noopener noreferrer"
              className="card-minimal group hover:border-white/20 transition-all block"
            >
              <div className="flex justify-between items-start mb-6">
                <div className="p-2 border border-white/10 group-hover:bg-white group-hover:text-black transition-all">
                  <BookOpen className="w-4 h-4" />
                </div>
                <ExternalLink className="w-4 h-4 text-white/20 group-hover:text-white transition-all" />
              </div>
              <h3 className="text-xs font-bold uppercase tracking-widest mb-4 group-hover:text-blue-400 transition-colors">
                {resource.title}
              </h3>
              <div className="flex flex-wrap gap-2">
                <span className="text-[8px] px-2 py-1 bg-white/5 border border-white/10 tracking-widest uppercase">
                  {resource.platform}
                </span>
                <span className="text-[8px] px-2 py-1 bg-white/5 border border-white/10 tracking-widest uppercase">
                  {resource.type}
                </span>
              </div>
            </a>
          ))
        ) : (
          <div className="col-span-full py-20 border border-dashed border-white/5 flex flex-col items-center justify-center opacity-20 text-center">
            <Search className="h-12 w-12 mb-6" />
            <p className="text-minimal">NO_RESOURCES_FOUND. RUN_ANALYSIS_FIRST.</p>
          </div>
        )}
      </div>
    </div>
  );
}
