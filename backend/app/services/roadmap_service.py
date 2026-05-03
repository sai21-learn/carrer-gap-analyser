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
            "DevOps Engineer": "devops",
            "Data Analyst": "data-analyst",
            "Data Scientist": "ai-data-scientist",
            "Machine Learning Engineer": "machine-learning",
            "Software Engineer": "computer-science",
            "UI/UX Designer": "ux-design",
            "Cybersecurity Analyst": "cyber-security",
            "Cloud Engineer": "aws",
            "Full Stack Developer": "full-stack",
            "Full Stack Engineer": "full-stack",
            "Game Developer": "game-developer",
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
            label_words = set(label.split())
            
            is_gap = False
            for gap in normalized_gaps:
                if gap in label:
                    is_gap = True
                    break
                gap_words = set(gap.split())
                if label_words & gap_words:
                    is_gap = True
                    break
                    
            if is_gap:
                node["status"] = "gap"
                if "data" not in node:
                    node["data"] = {}
                node["data"]["resources"] = [r.model_dump() if hasattr(r, 'model_dump') else r for r in get_resources(label)]
            else:
                node["status"] = "completed"
                if "data" not in node:
                    node["data"] = {}
                node["data"]["resources"] = []
                
        return {"nodes": nodes, "edges": edges}
