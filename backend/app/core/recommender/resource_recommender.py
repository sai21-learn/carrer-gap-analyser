import json
from pathlib import Path
from typing import Dict, List
from urllib.parse import quote_plus

from app.core.config.settings import DATA_STORE_DIR
from app.schemas import Resource
from app.core.nlp.skill_normalizer import normalize

RESOURCES_PATH = DATA_STORE_DIR / "resources_db.json"


_RESOURCES_CACHE = None

def _load_resources() -> dict:
    global _RESOURCES_CACHE
    if _RESOURCES_CACHE is not None:
        return _RESOURCES_CACHE
    try:
        with open(RESOURCES_PATH, "r", encoding="utf-8") as f:
            _RESOURCES_CACHE = json.load(f)
    except Exception:
        _RESOURCES_CACHE = {}
    return _RESOURCES_CACHE


def get_resources(skill: str) -> List[Resource]:
    normalized = normalize(skill)
    data = _load_resources()
    resources = None
    for key, value in data.items():
        if key.lower() == normalized.lower():
            resources = value
            break
            
    if not resources:
        url = f"https://www.google.com/search?q={quote_plus('learn ' + normalized)}"
        return [Resource(title=f"Learn {normalized}", url=url, platform="Google", type="search")]
    return [Resource(**r) for r in resources]


def recommend_all(gap_skills: List[str]) -> Dict[str, List[Resource]]:
    return {skill: get_resources(skill) for skill in gap_skills}
