import pytest
import os
import json
from backend.app.services.roadmap_service import RoadmapService

def test_map_skills_to_nodes():
    # Ensure we have some synced data for the test
    os.makedirs("backend/app/data/roadmaps/frontend", exist_ok=True)
    test_data = {
        "nodes": [
            {"id": "react", "data": {"label": "React"}},
            {"id": "css", "data": {"label": "CSS"}}
        ],
        "edges": [
            {"id": "e1", "source": "react", "target": "css"}
        ]
    }
    with open("backend/app/data/roadmaps/frontend/roadmap.json", "w") as f:
        json.dump(test_data, f)

    service = RoadmapService()
    gaps = ["React"]
    role = "Frontend Developer"
    roadmap = service.get_roadmap_for_gaps(role, gaps)
    
    assert len(roadmap["nodes"]) > 0
    # Check if React node is marked as gap
    react_node = next(n for n in roadmap["nodes"] if n["id"] == "react")
    assert react_node["status"] == "gap"
    # Check if CSS node is marked as completed
    css_node = next(n for n in roadmap["nodes"] if n["id"] == "css")
    assert css_node["status"] == "completed"
