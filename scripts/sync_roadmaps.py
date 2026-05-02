import os
import json
import shutil
import subprocess
import logging
import tempfile

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

ROADMAPS = {
    "Frontend Developer": "frontend",
    "Backend Developer": "backend",
    "DevOps Engineer": "devops"
}

REPO_URL = "https://github.com/kamranahmedse/developer-roadmap.git"
DATA_DIR = "backend/app/data/roadmaps"

def sync():
    os.makedirs(DATA_DIR, exist_ok=True)
    
    with tempfile.TemporaryDirectory() as tmp_dir:
        logger.info(f"Cloning {REPO_URL}...")
        try:
            subprocess.run(["git", "clone", "--depth", "1", REPO_URL, tmp_dir], check=True)
            
            for role, slug in ROADMAPS.items():
                logger.info(f"Syncing roadmap for {role}...")
                src_dir = os.path.join(tmp_dir, "src/data/roadmaps", slug)
                json_file = os.path.join(src_dir, f"{slug}.json")
                
                if not os.path.exists(json_file):
                    logger.error(f"Roadmap JSON not found for {role} at {json_file}")
                    continue
                    
                dest_role_dir = os.path.join(DATA_DIR, slug)
                os.makedirs(dest_role_dir, exist_ok=True)
                
                # Copy roadmap.json (rename to roadmap.json for consistency)
                shutil.copy(json_file, os.path.join(dest_role_dir, "roadmap.json"))
                
                # Copy content directory if it exists
                content_src = os.path.join(src_dir, "content")
                if os.path.exists(content_src):
                    shutil.copytree(content_src, os.path.join(dest_role_dir, "content"), dirs_exist_ok=True)
                    
                logger.info(f"Successfully synced {role}")
                
        except Exception as e:
            logger.error(f"Failed to sync roadmaps: {e}")

if __name__ == "__main__":
    sync()
