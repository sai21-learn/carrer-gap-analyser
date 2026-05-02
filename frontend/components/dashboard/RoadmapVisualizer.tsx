'use client';

import React, { useState } from 'react';
import ReactFlow, { Background, Controls, Node } from 'reactflow';
import 'reactflow/dist/style.css';

interface RoadmapVisualizerProps {
  nodes: any[];
  edges: any[];
}

const RoadmapVisualizer: React.FC<RoadmapVisualizerProps> = ({ nodes, edges }) => {
  const [selectedNode, setSelectedNode] = useState<Node | null>(null);

  const onNodeClick = (event: React.MouseEvent, node: Node) => {
    setSelectedNode(node);
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
                <li key={index}>
                  <a href={resource.url} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
                    {resource.title}
                  </a>
                  <span className="text-sm text-gray-500 ml-2">({resource.platform})</span>
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
