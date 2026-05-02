'use client';

import React, { useState } from 'react';
import ReactFlow, { Background, Controls, Node } from 'reactflow';
import 'reactflow/dist/style.css';
import { ThumbsUp, ThumbsDown } from "lucide-react";

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
      // Optionally, provide some visual feedback to the user
    } catch (error) {
      console.error("Failed to submit feedback:", error);
    }
  };

  return (
    <div className="flex h-full">
      <div className="flex-grow">
        <ReactFlow nodes={nodes} edges={edges} onNodeClick={onNodeClick}>
          <Background />
          <Controls />
        </ReactFlow>
      </div>
      {selectedNode && (
        <div className="w-1/3 p-4 border-l overflow-y-auto">
          <h3 className="text-lg font-bold mb-2">{selectedNode.data.label}</h3>
          {selectedNode.data.resources && selectedNode.data.resources.length > 0 ? (
            <ul className="space-y-2">
              {selectedNode.data.resources.map((resource: any, index: number) => (
                <li key={index} className="flex items-center justify-between">
                  <div>
                    <a href={resource.url} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
                      {resource.title}
                    </a>
                    <span className="text-sm text-gray-500 ml-2">({resource.platform})</span>
                  </div>
                  <div className="flex space-x-2">
                    <button onClick={() => handleFeedback(resource.url, 1)} className="p-1 text-gray-400 hover:text-green-500">
                      <ThumbsUp className="h-4 w-4" />
                    </button>
                    <button onClick={() => handleFeedback(resource.url, -1)} className="p-1 text-gray-400 hover:text-red-500">
                      <ThumbsDown className="h-4 w-4" />
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500">No resources available for this skill.</p>
          )}
        </div>
      )}
    </div>
  );
};

export default RoadmapVisualizer;
