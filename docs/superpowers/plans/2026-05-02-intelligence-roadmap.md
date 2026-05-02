# Intelligence & Roadmaps Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Transform raw skill-gap data into an actionable, visual learning roadmap using data from `roadmap.sh`.

**Architecture:** A build-time sync script downloads roadmap data. A backend service maps skill gaps to roadmap nodes. A new API endpoint returns filtered graph data. A frontend component renders the graph using `react-flow`.

**Tech Stack:** FastAPI, SQLModel, Celery, Next.js, React Flow.

---

## File Structure

- **Backend**:
  - `scripts/sync_roadmaps.py`: Downloads roadmap data from GitHub.
  - `backend/app/data/roadmaps/`: Local storage for synced roadmaps.
  - `backend/app/services/roadmap_service.py`: Logic for mapping skills to roadmap nodes.
  - `backend/app/api/analysis.py`: New endpoint `GET /analysis/{task_id}/roadmap`.
  - `backend/app/models.py`: Data models for roadmap responses.

- **Frontend**:
  - `frontend/components/dashboard/RoadmapVisualizer.tsx`: Interactive graph component.
  - `frontend/app/dashboard/analysis/[id]/roadmap/page.tsx`: Page for viewing the roadmap.

---

### Task 1: Roadmap Synchronization Script

**Files:**
- Create: `scripts/sync_roadmaps.py`
- Create: `backend/app/data/roadmaps/.gitkeep`

- [ ] **Step 1: Create the sync script**

```python
import os
import json
import requests
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

ROADMAPS = {
    "Frontend Developer": "frontend",
    "Backend Developer": "backend",
    "DevOps Engineer": "devops"
}

BASE_URL = "https://raw.githubusercontent.com/kamranahmedse/developer-roadmap/master/src/data/roadmaps"
DATA_DIR = "backend/app/data/roadmaps"

def sync():
    os.makedirs(DATA_DIR, exist_ok=True)
    for role, slug in ROADMAPS.items():
        logger.info(f"Syncing roadmap for {role}...")
        try:
            # Fetch roadmap.json
            res = requests.get(f"{BASE_URL}/{slug}/roadmap.json")
            res.raise_for_status()
            roadmap_data = res.json()
            
            role_dir = os.path.join(DATA_DIR, slug)
            os.makedirs(role_dir, exist_ok=True)
            
            with open(os.path.join(role_dir, "roadmap.json"), "w") as f:
                json.dump(roadmap_data, f, indent=2)
                
            logger.info(f"Successfully synced {role}")
        except Exception as e:
            logger.error(f"Failed to sync {role}: {e}")

if __name__ == "__main__":
    sync()
```

- [ ] **Step 2: Run the sync script**

Run: `python scripts/sync_roadmaps.py`
Expected: `backend/app/data/roadmaps/` contains folders for `frontend`, `backend`, and `devops`, each with a `roadmap.json`.

- [ ] **Step 3: Commit**

```bash
git add scripts/sync_roadmaps.py backend/app/data/roadmaps/
git commit -m "feat: add roadmap sync script and initial data"
```

### Task 2: Roadmap Mapping Service

**Files:**
- Create: `backend/app/services/roadmap_service.py`
- Test: `tests/test_roadmap_service.py`

- [ ] **Step 1: Write failing test for RoadmapService**

```python
import pytest
from backend.app.services.roadmap_service import RoadmapService

def test_map_skills_to_nodes():
    service = RoadmapService()
    # Mock data or use synced data
    gaps = ["React", "CSS"]
    role = "Frontend Developer"
    nodes = service.get_roadmap_for_gaps(role, gaps)
    assert len(nodes) > 0
    assert any(n["data"]["label"].lower() == "react" for n in nodes)
```

- [ ] **Step 2: Run test to verify it fails**

Run: `pytest tests/test_roadmap_service.py`
Expected: FAIL

- [ ] **Step 3: Implement RoadmapService**

```python
import os
import json
from typing import List, Dict

class RoadmapService:
    def __init__(self):
        self.data_dir = "backend/app/data/roadmaps"
        self.role_map = {
            "Frontend Developer": "frontend",
            "Backend Developer": "backend",
            "DevOps Engineer": "devops"
        }

    def get_roadmap_for_gaps(self, role: str, gap_skills: List[str]) -> Dict:
        slug = self.role_map.get(role)
        if not slug:
            return {"nodes": [], "edges": []}
            
        path = os.path.join(self.data_dir, slug, "roadmap.json")
        if not os.path.exists(path):
            return {"nodes": [], "edges": []}
            
        with open(path, "r") as f:
            data = json.load(f)
            
        # Basic mapping logic: find nodes matching gap skills
        # This will be refined to return a structured graph
        nodes = data.get("nodes", [])
        edges = data.get("edges", [])
        
        normalized_gaps = [s.lower() for s in gap_skills]
        
        for node in nodes:
            label = node.get("data", {}).get("label", "").lower()
            if label in normalized_gaps:
                node["status"] = "gap"
            else:
                node["status"] = "completed" # Or skip
                
        return {"nodes": nodes, "edges": edges}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `pytest tests/test_roadmap_service.py`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add backend/app/services/roadmap_service.py tests/test_roadmap_service.py
git commit -m "feat: implement roadmap mapping service"
```

### Task 3: API Endpoint for Personalized Roadmap

**Files:**
- Modify: `backend/app/api/analysis.py`
- Modify: `backend/app/models.py`

- [ ] **Step 1: Add Roadmap models to models.py**

```python
from typing import Optional, List, Dict, Any

# ... existing models ...

class RoadmapNode(SQLModel):
    id: str
    data: Dict[str, Any]
    position: Dict[str, float]
    type: str = "default"
    status: str = "completed"

class RoadmapEdge(SQLModel):
    id: str
    source: str
    target: str

class RoadmapResponse(SQLModel):
    nodes: List[RoadmapNode]
    edges: List[RoadmapEdge]
    content: Dict[str, str] = {}
```

- [ ] **Step 2: Implement the roadmap endpoint in analysis.py**

```python
from fastapi import APIRouter, Depends, HTTPException
from ..services.roadmap_service import RoadmapService
from .. import models

roadmap_service = RoadmapService()

@router.get("/roadmap/{task_id}", response_model=models.RoadmapResponse)
def get_personalized_roadmap(task_id: str):
    task = celery_app.AsyncResult(task_id)
    if not task.ready():
        raise HTTPException(status_code=400, detail="Analysis task is not complete.")
        
    result = task.result
    if not result or "error" in result:
        raise HTTPException(status_code=500, detail=result.get("error", "Task result not found"))
        
    # Extract role and gaps from result
    role = result.get("target_role")
    gaps = [gap["skill"] for gap in result.get("gaps", [])]
    
    roadmap = roadmap_service.get_roadmap_for_gaps(role, gaps)
    return roadmap
```

- [ ] **Step 3: Commit**

```bash
git add backend/app/api/analysis.py backend/app/models.py
git commit -m "feat: add API endpoint for personalized roadmap"
```

### Task 4: Frontend Visualization with React Flow

**Files:**
- Modify: `frontend/package.json`
- Create: `frontend/components/dashboard/RoadmapVisualizer.tsx`

- [ ] **Step 1: Install react-flow**

Run: `cd frontend && npm install reactflow`

- [ ] **Step 2: Create RoadmapVisualizer component**

```tsx
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
```

- [ ] **Step 3: Create Roadmap page**

Create `frontend/app/dashboard/analysis/[id]/roadmap/page.tsx`:
```tsx
'use client';

import { useEffect, useState } from 'react';
import RoadmapVisualizer from '@/components/dashboard/RoadmapVisualizer';

export default function RoadmapPage({ params }: { params: { id: string } }) {
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    fetch(`/api/analysis/roadmap/${params.id}`)
      .then(res => res.json())
      .then(setData);
  }, [params.id]);

  if (!data) return <div>Loading roadmap...</div>;

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Your Learning Path</h1>
      <RoadmapVisualizer nodes={data.nodes} edges={data.edges} />
    </div>
  );
}
```

- [ ] **Step 4: Commit**

```bash
git add frontend/package.json frontend/components/dashboard/RoadmapVisualizer.tsx frontend/app/dashboard/analysis/[id]/roadmap/page.tsx
git commit -m "feat: implement interactive roadmap visualization"
```
