'use client';

import React from 'react';
import ReactFlow, { Background, Controls } from 'reactflow';
import 'reactflow/dist/style.css';

interface RoadmapVisualizerProps {
  nodes: any[];
  edges: any[];
}

const RoadmapVisualizer: React.FC<RoadmapVisualizerProps> = ({ nodes, edges }) => {
  return (
    <div style={{ height: '500px', width: '100%' }}>
      <ReactFlow nodes={nodes} edges={edges}>
        <Background />
        <Controls />
      </ReactFlow>
    </div>
  );
};

export default RoadmapVisualizer;
