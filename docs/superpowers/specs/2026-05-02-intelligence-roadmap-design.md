# Design Specification: Phase 5 — Intelligence & Roadmaps

## 1. Overview
The goal of Phase 5 is to transform raw skill-gap data into an actionable, visual learning roadmap for the user. We will integrate data from `roadmap.sh` to provide structured guidance on how to bridge identified skill gaps.

## 2. Objectives
- Synchronize data from `roadmap.sh` public repositories.
- Map identified skill gaps to specific nodes in developer roadmaps.
- Provide a personalized learning path via a new API endpoint.
- Visualize the learning path using an interactive node-based graph on the frontend.

## 3. Architecture & Components

### 3.1 Data Synchronization (Task 1)
- **Script**: `scripts/sync_roadmaps.py`
- **Source**: `https://github.com/kamranahmedse/developer-roadmap`
- **Storage**: `backend/app/data/roadmaps/` (Ensure this directory is created)
- **Behavior**:
    - Download `roadmap.json` and `content/*.md` for supported roles.
    - Supported roles mapping:
        - "Frontend Developer" -> `frontend`
        - "Backend Developer" -> `backend`
        - "DevOps Engineer" -> `devops`
        - ... (extend as needed)

### 3.2 Mapping Service (Task 2)
- **Service**: `backend/app/services/roadmap_service.py`
- **Logic**:
    - Load `roadmap.json` for a given role.
    - Normalize skill names from the roadmap nodes.
    - Create a lookup map: `skill_name` -> `node_id`.
    - Handle aliases using `data/skill_aliases.json`.

### 3.3 API Endpoint (Task 3)
- **Endpoint**: `GET /analysis/{task_id}/roadmap`
- **Response Format**:
    ```json
    {
      "nodes": [
        { "id": "1", "data": { "label": "React" }, "position": { "x": 0, "y": 0 }, "type": "skillNode", "status": "gap" }
      ],
      "edges": [
        { "id": "e1-2", "source": "1", "target": "2" }
      ],
      "content": {
        "1": "### React\nReact is a library for building user interfaces..."
      }
    }
    ```
- **Logic**:
    1. Retrieve analysis result (GapReport) using `task_id`.
    2. Identify `target_role` and corresponding roadmap.
    3. Use `RoadmapService` to find nodes corresponding to `gap_skills`.
    4. Construct a "Personalized Roadmap" JSON compatible with `react-flow`.

### 3.4 Frontend Visualization (Task 4)
- **Library**: `react-flow`
- **Location**: `frontend/app/dashboard/analysis/[id]/roadmap/page.tsx`
- **Features**:
    - Interactive graph with pan and zoom.
    - Custom nodes styled based on status (e.g., "To Learn" for gaps).
    - Side panel or modal to show Markdown content when a node is clicked.

## 4. Data Flow
1. User starts analysis -> `run_gap_analysis_task` (Celery).
2. Analysis finishes -> `GapReport` stored in Redis/DB.
3. User navigates to Roadmap view -> Frontend calls `GET /analysis/{task_id}/roadmap`.
4. Backend fetches `GapReport`, maps to `roadmap.sh` data, returns filtered graph data.
5. Frontend renders graph via `react-flow`.

## 5. Testing Strategy
- **Unit Tests**:
    - `sync_roadmaps.py` handles download and storage correctly.
    - `RoadmapService` correctly maps normalized skills to node IDs.
    - API returns expected JSON structure.
- **Integration Tests**:
    - End-to-end flow from analysis task ID to roadmap JSON.
- **Frontend Tests**:
    - `RoadmapVisualizer` renders nodes and edges correctly.
    - Clicking nodes triggers description display.

## 6. Success Criteria
- Roadmaps can be successfully synced and stored locally.
- Users can view a personalized roadmap for their target role.
- Skill gaps are clearly identified and actionable through linked resources/content.
