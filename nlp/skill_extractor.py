from collections import Counter
from pathlib import Path
from typing import Dict, List
import json

import spacy
from spacy.matcher import PhraseMatcher

from config.settings import SPACY_MODEL
from models import JobPosting
from nlp.skill_normalizer import normalize_list

ROOT_DIR = Path(__file__).resolve().parents[1]
ALIASES_PATH = ROOT_DIR / "data" / "skill_aliases.json"

_SEED_SKILLS = [
    "Python", "Java", "JavaScript", "TypeScript", "C++", "C#", "Go", "Rust", "Kotlin", "Swift",
    "SQL", "MySQL", "PostgreSQL", "MongoDB", "Redis", "Cassandra", "DynamoDB",
    "Machine Learning", "Deep Learning", "NLP", "Computer Vision", "Reinforcement Learning",
    "TensorFlow", "PyTorch", "Keras", "Scikit-learn", "XGBoost", "LightGBM",
    "Docker", "Kubernetes", "AWS", "Azure", "GCP", "Terraform", "Ansible",
    "React", "Angular", "Vue", "Node.js", "Django", "Flask", "FastAPI", "Spring Boot",
    "Git", "GitHub", "CI/CD", "Jenkins", "GitHub Actions",
    "Pandas", "NumPy", "Matplotlib", "Seaborn", "Plotly", "Tableau", "Power BI",
    "Excel", "JIRA", "Agile", "Scrum", "REST API", "GraphQL", "Microservices",
    "Linux", "Bash", "Shell Scripting", "Data Structures", "Algorithms",
    "System Design", "Object Oriented Programming", "Figma", "Adobe XD",
]

_NLP = None
_MATCHER = None


def _load_aliases() -> dict:
    with open(ALIASES_PATH, "r", encoding="utf-8") as f:
        return json.load(f)


def _get_nlp():
    global _NLP
    if _NLP is None:
        _NLP = spacy.load(SPACY_MODEL)
    return _NLP


def _get_matcher():
    global _MATCHER
    if _MATCHER is None:
        nlp = _get_nlp()
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
    doc = nlp(text)

    matches = matcher(doc)
    spans = [doc[start:end].text for _, start, end in matches]
    return normalize_list(spans)


def aggregate_skills(job_postings: List[JobPosting]) -> Dict[str, int]:
    all_skills: List[str] = []
    for posting in job_postings:
        all_skills.extend(extract_skills(posting.description))
    freq = Counter(all_skills)
    return dict(sorted(freq.items(), key=lambda x: x[1], reverse=True))
