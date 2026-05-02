import os
import json
import logging
from typing import List, Dict
from pathlib import Path

from ..core.recommender.resource_recommender import get_resources

logger = logging.getLogger(__name__)

class RoadmapService:
    def __init__(self):
        # Path relative to this file: backend/app/services/roadmap_service.py
        # Data dir: backend/app/data/roadmaps
        self.base_dir = Path(__file__).resolve().parents[1]
        self.data_dir = self.base_dir / "data" / "roadmaps"
        
        self.role_map = {
            "Frontend Developer": "frontend",
            "Backend Developer": "backend",
            "DevOps Engineer": "devops"
        }

    def get_roadmap_for_gaps(self, role: str, gap_skills: List[str]) -> Dict:
        slug = self.role_map.get(role)
        if not slug:
            logger.warning(f"No roadmap slug found for role: {role}")
            return {"nodes": [], "edges": []}
            
        path = self.data_dir / slug / "roadmap.json"
        if not path.exists():
            logger.error(f"Roadmap file not found at: {path}")
            return {"nodes": [], "edges": []}
            
        try:
            with open(path, "r") as f:
                data = json.load(f)
        except Exception as e:
            logger.error(f"Failed to load roadmap JSON: {e}")
            return {"nodes": [], "edges": []}
            
        nodes = data.get("nodes", [])
        edges = data.get("edges", [])
        
        normalized_gaps = [s.lower() for s in gap_skills]
        
        for node in nodes:
            label = node.get("data", {}).get("label", "").lower()
            if any(gap in label or label in gap for gap in normalized_gaps):
                node["status"] = "gap"
                node["resources"] = get_resources(label)
            else:
                node["status"] = "completed"
                node["resources"] = []
                
        return {"nodes": nodes, "edges": edges}
