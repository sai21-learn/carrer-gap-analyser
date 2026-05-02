'use client';

import React, { useEffect, useState } from 'react';
import ReactFlow, {
  Background,
  Controls,
  Node,
  Edge,
  useNodesState,
  useEdgesState
} from 'reactflow';
import 'reactflow/dist/style.css';
import { Loader2 } from 'lucide-react';

export default function RoadmapPage({ params }: { params: { id: string } }) {
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchRoadmap() {
      try {
        const res = await fetch(`/api/proxy/analysis/${params.id}/roadmap`);
        if (res.ok) {
          const data = await res.json();

          // Transform data for react-flow if needed,
          // or assume backend returns compatible format
          const formattedNodes = data.nodes.map((node: any, index: number) => ({
            id: node.id,
            data: { label: node.data.label },
            position: { x: 250, y: index * 100 },
            style: {
              background: node.status === 'matched' ? '#dcfce7' : '#fee2e2',
              color: node.status === 'matched' ? '#166534' : '#991b1b',
              border: `1px solid ${node.status === 'matched' ? '#22c55e' : '#ef4444'}`,
              borderRadius: '8px',
              padding: '10px',
              width: 150,
              textAlign: 'center'
            }
          }));

          setNodes(formattedNodes);
          setEdges(data.edges || []);
        }
      } catch (error) {
        console.error("Failed to fetch roadmap:", error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchRoadmap();
  }, [params.id, setNodes, setEdges]);

  if (isLoading) {
    return (
      <div className="flex h-[600px] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-zinc-400" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Your Personalized Roadmap</h1>
        <p className="text-zinc-500 dark:text-zinc-400">
          Green nodes represent skills you already have. Red nodes are recommended focus areas.
        </p>
      </div>

      <div className="h-[600px] rounded-xl border bg-white shadow-sm dark:bg-zinc-950 overflow-hidden">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          fitView
        >
          <Background />
          <Controls />
        </ReactFlow>
      </div>
    </div>
  );
}
