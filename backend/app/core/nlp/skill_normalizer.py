import json
import re
from pathlib import Path
from typing import List

from app.core.config.settings import DATA_STORE_DIR

ALIASES_PATH = DATA_STORE_DIR / "skill_aliases.json"


_ALIASES_CACHE = None

def _load_aliases() -> dict:
    global _ALIASES_CACHE
    if _ALIASES_CACHE is not None:
        return _ALIASES_CACHE
    try:
        with open(ALIASES_PATH, "r", encoding="utf-8") as f:
            _ALIASES_CACHE = json.load(f)
    except Exception:
        _ALIASES_CACHE = {}
    return _ALIASES_CACHE


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
