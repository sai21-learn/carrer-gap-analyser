import json
import re
from collections import Counter
from pathlib import Path
from typing import Dict, List

try:
    import spacy
    from spacy.matcher import PhraseMatcher
except Exception:  # noqa: BLE001
    spacy = None
    PhraseMatcher = None

from app.core.config.settings import SPACY_MODEL, DATA_STORE_DIR
from app.schemas import JobPosting
from app.core.nlp.skill_normalizer import normalize_list

ALIASES_PATH = DATA_STORE_DIR / "skill_aliases.json"

_SEED_SKILLS = [
    "Python",
    "Java",
    "JavaScript",
    "TypeScript",
    "C++",
    "C#",
    "Go",
    "Rust",
    "Kotlin",
    "Swift",
    "SQL",
    "MySQL",
    "PostgreSQL",
    "MongoDB",
    "Redis",
    "Cassandra",
    "DynamoDB",
    "Machine Learning",
    "Deep Learning",
    "NLP",
    "Computer Vision",
    "Reinforcement Learning",
    "TensorFlow",
    "PyTorch",
    "Keras",
    "Scikit-learn",
    "XGBoost",
    "LightGBM",
    "Docker",
    "Kubernetes",
    "AWS",
    "Azure",
    "GCP",
    "Terraform",
    "Ansible",
    "React",
    "Angular",
    "Vue",
    "Node.js",
    "Django",
    "Flask",
    "FastAPI",
    "Spring Boot",
    "Git",
    "GitHub",
    "CI/CD",
    "Jenkins",
    "GitHub Actions",
    "Pandas",
    "NumPy",
    "Matplotlib",
    "Seaborn",
    "Plotly",
    "Tableau",
    "Power BI",
    "Excel",
    "JIRA",
    "Agile",
    "Scrum",
    "REST API",
    "GraphQL",
    "Microservices",
    "Linux",
    "Bash",
    "Shell Scripting",
    "Data Structures",
    "Algorithms",
    "System Design",
    "Object Oriented Programming",
    "Figma",
    "Adobe XD",
]

_NLP = None
_MATCHER = None


def _load_aliases() -> dict:
    with open(ALIASES_PATH, "r", encoding="utf-8") as f:
        return json.load(f)


def _get_nlp():
    global _NLP
    if _NLP is None:
        if spacy is None:
            return None
        _NLP = spacy.load(SPACY_MODEL)
    return _NLP


def _get_matcher():
    global _MATCHER
    if _MATCHER is None:
        nlp = _get_nlp()
        if nlp is None or PhraseMatcher is None:
            return None
        matcher = PhraseMatcher(nlp.vocab, attr="LOWER")
        aliases = _load_aliases()
        vocab = set(_SEED_SKILLS)
        vocab.update(aliases.keys())
        vocab.update(aliases.values())
        patterns = [nlp.make_doc(text) for text in vocab if text]
        matcher.add("SKILLS", patterns)
        _MATCHER = matcher
    return _MATCHER


def extract_skills(text: str) -> List[str]:
    if not text:
        return []
    nlp = _get_nlp()
    matcher = _get_matcher()
    if nlp is None or matcher is None:
        return _fallback_extract_skills(text)
    doc = nlp(text)

    matches = matcher(doc)
    spans = [doc[start:end].text for _, start, end in matches]
    return normalize_list(spans)


def _fallback_extract_skills(text: str) -> List[str]:
    aliases = _load_aliases()
    vocab = set(_SEED_SKILLS)
    vocab.update(aliases.keys())
    vocab.update(aliases.values())
    lower = text.lower()
    hits: List[str] = []
    for term in vocab:
        if not term:
            continue
        pattern = r"\b" + re.escape(term.lower()) + r"\b"
        if re.search(pattern, lower):
            hits.append(term)
    return normalize_list(hits)


def aggregate_skills(job_postings: List[JobPosting]) -> Dict[str, int]:
    all_skills: List[str] = []
    for posting in job_postings:
        all_skills.extend(extract_skills(posting.description))
    freq = Counter(all_skills)
    return dict(sorted(freq.items(), key=lambda x: x[1], reverse=True))
