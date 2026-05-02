'use client';

import { useEffect, useState } from 'react';
import RoadmapVisualizer from '@/components/dashboard/RoadmapVisualizer';

export default function RoadmapPage({ params }: { params: { id: string } }) {
  const [data, setData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch(`/api/analysis/roadmap/${params.id}`)
      .then(res => {
        if (!res.ok) throw new Error('Failed to fetch roadmap');
        return res.json();
      })
      .then(setData)
      .catch(err => setError(err.message));
  }, [params.id]);

  if (error) return <div className="p-8 text-red-500">Error: {error}</div>;
  if (!data) return <div className="p-8">Loading roadmap...</div>;

  return (
    <div className="p-8 h-full flex flex-col">
      <h1 className="text-2xl font-bold mb-4">Your Learning Path</h1>
      <div className="flex-grow border rounded-lg overflow-hidden bg-white shadow-sm">
        <RoadmapVisualizer nodes={data.nodes} edges={data.edges} />
      </div>
    </div>
  );
}
