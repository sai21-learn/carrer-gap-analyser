import json
import os
from typing import Dict, List, Optional

STORAGE_DIR = "backend/app/data/roadmaps"


class RoadmapService:
    @staticmethod
    def get_roadmap(roadmap_id: str) -> Optional[Dict]:
        file_path = os.path.join(STORAGE_DIR, f"{roadmap_id}.json")
        if not os.path.exists(file_path):
            return None

        with open(file_path, "r") as f:
            return json.load(f)

    @staticmethod
    def map_skills_to_roadmap(skills: List[str], roadmap_id: str) -> Dict:
        roadmap = RoadmapService.get_roadmap(roadmap_id)
        if not roadmap:
            return {"nodes": [], "edges": []}

        # Simplified mapping logic for prototype
        nodes = []
        for node in roadmap.get("nodes", []):
            status = "matched" if node["label"] in skills else "gap"
            nodes.append(
                {"id": node["id"], "data": {"label": node["label"]}, "status": status}
            )

        return {"nodes": nodes, "edges": roadmap.get("edges", [])}
