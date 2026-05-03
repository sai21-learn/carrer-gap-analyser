"use client";

import React, { useState } from "react";
import ReactFlow, { Background, Controls, Node, MiniMap } from "reactflow";
import "reactflow/dist/style.css";
import { ThumbsUp, ThumbsDown, ExternalLink, Box, Info } from "lucide-react";
import { cn } from "@/lib/utils";

interface RoadmapVisualizerProps {
  nodes: any[];
  edges: any[];
}

const RoadmapVisualizer: React.FC<RoadmapVisualizerProps> = ({ nodes, edges }) => {
  const [selectedNode, setSelectedNode] = useState<Node | null>(null);

  const onNodeClick = (event: React.MouseEvent, node: Node) => {
    setSelectedNode(node);
  };

  const handleFeedback = async (resourceUrl: string, rating: number) => {
    try {
      await fetch("/api/proxy/feedback", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ resource_url: resourceUrl, rating }),
      });
    } catch (error) {
      console.error("Failed to submit feedback:", error);
    }
  };

  return (
    <div className="flex h-full bg-black/40">
      <div className="flex-grow relative">
        <ReactFlow 
          nodes={nodes} 
          edges={edges} 
          onNodeClick={onNodeClick}
          {...({ colorMode: "dark" } as any)}
        >
          <Background color="#333" gap={20} />
          <Controls className="bg-black border border-white/10" />
          <MiniMap 
            maskColor="rgba(0, 0, 0, 0.6)"
            nodeColor="#333"
            className="border border-white/10 bg-black/80"
          />
        </ReactFlow>
      </div>
      
      {selectedNode && (
        <div className="w-[400px] border-l border-white/10 bg-black/80 backdrop-blur-xl p-8 overflow-y-auto animate-in slide-in-from-right duration-500">
          <div className="flex items-center gap-3 mb-8">
            <Box className="h-4 w-4 text-white" />
            <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-white">Node_Details</h3>
          </div>

          <h2 className="text-2xl font-tech font-bold uppercase tracking-tight mb-2">
            {selectedNode.data.label}
          </h2>
          <p className="text-[10px] text-muted-foreground uppercase tracking-widest mb-10 opacity-60">
            Node_ID: {selectedNode.id}
          </p>

          <div className="space-y-8">
            <div className="flex items-center gap-2 text-white">
               <Info className="h-3 w-3" />
               <span className="text-[10px] font-bold uppercase tracking-widest">Resources</span>
            </div>

            {selectedNode.data.resources && selectedNode.data.resources.length > 0 ? (
              <ul className="space-y-4">
                {selectedNode.data.resources.map((resource: any, index: number) => (
                  <li 
                    key={index} 
                    className="border border-white/5 bg-white/5 p-5 transition-all hover:border-white/20 group"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="space-y-1">
                        <a 
                          href={resource.url} 
                          target="_blank" 
                          rel="noopener noreferrer" 
                          className="text-xs font-bold uppercase tracking-widest text-white group-hover:text-blue-400 transition-colors flex items-center gap-2"
                        >
                          {resource.title}
                          <ExternalLink className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                        </a>
                        <span className="text-[10px] text-muted-foreground uppercase tracking-widest block">
                          [{resource.platform}]
                        </span>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-end gap-4 border-t border-white/5 pt-4">
                      <span className="text-[10px] text-muted-foreground uppercase tracking-widest mr-auto opacity-30">Rate_Content:</span>
                      <button 
                        onClick={() => handleFeedback(resource.url, 1)} 
                        className="text-muted-foreground hover:text-emerald-500 transition-colors"
                      >
                        <ThumbsUp className="h-4 w-4" />
                      </button>
                      <button 
                        onClick={() => handleFeedback(resource.url, -1)} 
                        className="text-muted-foreground hover:text-red-500 transition-colors"
                      >
                        <ThumbsDown className="h-4 w-4" />
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="py-12 border border-dashed border-white/10 flex flex-col items-center justify-center opacity-30 text-center">
                 <Box className="h-6 w-6 mb-4" />
                 <p className="text-[10px] uppercase tracking-widest">No_Resources_Mapped</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default RoadmapVisualizer;
