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
