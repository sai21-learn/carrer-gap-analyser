import sys
import os
from pathlib import Path

# Add backend/app to path to import settings
backend_path = os.path.abspath("/home/whysooraj/Documents/carrer_gap/backend")
sys.path.append(backend_path)

try:
    from app.core.config.settings import DATA_STORE_DIR
    print(f"DATA_STORE_DIR: {DATA_STORE_DIR}")
    print(f"Exists: {DATA_STORE_DIR.exists()}")
    
    mock_path = DATA_STORE_DIR / "mock_jobs.json"
    print(f"Mock path: {mock_path}")
    print(f"Mock file exists: {mock_path.exists()}")
except Exception as e:
    print(f"Error: {e}")
    import traceback
    traceback.print_exc()
