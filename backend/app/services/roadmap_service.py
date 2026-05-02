import os
import json
from typing import List, Dict

from backend.core.recommender.resource_recommender import get_resources

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
            
        nodes = data.get("nodes", [])
        edges = data.get("edges", [])
        
        normalized_gaps = [s.lower() for s in gap_skills]
        
        for node in nodes:
            label = node.get("data", {}).get("label", "").lower()
            if label in normalized_gaps:
                node["status"] = "gap"
                node["resources"] = get_resources(label)
            else:
                node["status"] = "completed"
                node["resources"] = []
                
        return {"nodes": nodes, "edges": edges}
