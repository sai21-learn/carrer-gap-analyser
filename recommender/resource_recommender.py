import json
from pathlib import Path
from typing import Dict, List
from urllib.parse import quote_plus

from models import Resource
from nlp.skill_normalizer import normalize

ROOT_DIR = Path(__file__).resolve().parents[1]
RESOURCES_PATH = ROOT_DIR / "data" / "resources_db.json"


def _load_resources() -> dict:
    with open(RESOURCES_PATH, "r", encoding="utf-8") as f:
        return json.load(f)


def get_resources(skill: str) -> List[Resource]:
    normalized = normalize(skill)
    data = _load_resources()
    resources = data.get(normalized)
    if not resources:
        url = f"https://www.google.com/search?q={quote_plus('learn ' + normalized)}"
        return [Resource(title=f"Learn {normalized}", url=url, platform="Google", type="search")]
    return [Resource(**r) for r in resources]


def recommend_all(gap_skills: List[str]) -> Dict[str, List[Resource]]:
    return {skill: get_resources(skill) for skill in gap_skills}
