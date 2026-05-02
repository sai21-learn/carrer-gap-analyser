import json
import re
from pathlib import Path
from typing import List

ROOT_DIR = Path(__file__).resolve().parents[2]
ALIASES_PATH = ROOT_DIR / "data_store" / "skill_aliases.json"


def _load_aliases() -> dict:
    with open(ALIASES_PATH, "r", encoding="utf-8") as f:
        return json.load(f)


def normalize(skill: str) -> str:
    if not skill:
        return ""
    aliases = _load_aliases()
    cleaned = re.sub(r"[^a-zA-Z0-9 +#.-]", " ", skill).strip().lower()
    cleaned = re.sub(r"\s+", " ", cleaned)
    if cleaned in aliases:
        return aliases[cleaned]
    # Preserve common acronyms
    if cleaned.isupper() and len(cleaned) <= 5:
        return cleaned
    return cleaned.title()


def normalize_list(skills: List[str]) -> List[str]:
    seen = set()
    normalized: List[str] = []
    for skill in skills:
        norm = normalize(skill)
        if not norm or norm in seen:
            continue
        seen.add(norm)
        normalized.append(norm)
    return normalized
