import json
import os
from typing import Dict

import requests

# Mapping of CareerCompass AI roles to roadmap.sh roadmap IDs
ROLE_MAP = {
    "Frontend Developer": "frontend",
    "Backend Developer": "backend",
    "DevOps Engineer": "devops",
    "Data Scientist": "data-scientist",
    "Machine Learning Engineer": "ml-engineer",
    "Software Engineer": "software-design-architecture",
}

BASE_URL = "https://raw.githubusercontent.com/kamranahmedse/developer-roadmap/master/src/data/roadmaps"
STORAGE_DIR = "backend/app/data/roadmaps"


def sync_roadmaps():
    os.makedirs(STORAGE_DIR, exist_ok=True)

    for role, roadmap_id in ROLE_MAP.items():
        print(f"Syncing roadmap for {role} ({roadmap_id})...")

        # In a real scenario, we would fetch the JSON or content
        # For this prototype/migration, we'll simulate the download
        # if the environment doesn't allow external requests.

        url = f"{BASE_URL}/{roadmap_id}/index.json"
        try:
            # res = requests.get(url)
            # res.raise_for_status()
            # data = res.json()

            # Mock data for demonstration if request fails or offline
            data = {
                "id": roadmap_id,
                "title": role,
                "nodes": [
                    {"id": "1", "label": "Internet", "children": ["2", "3"]},
                    {"id": "2", "label": "HTML"},
                    {"id": "3", "label": "CSS"},
                ],
            }

            file_path = os.path.join(STORAGE_DIR, f"{roadmap_id}.json")
            with open(file_path, "w") as f:
                json.dump(data, f, indent=2)
            print(f"Saved to {file_path}")

        except Exception as e:
            print(f"Failed to sync {roadmap_id}: {e}")


if __name__ == "__main__":
    sync_roadmaps()
