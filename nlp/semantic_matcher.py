import difflib
from typing import List, Tuple

try:
    import spacy
except Exception:  # noqa: BLE001
    spacy = None

from config.settings import (
    ENABLE_BERT,
    PARTIAL_MATCH_MIN_SCORE,
    SIMILARITY_THRESHOLD,
    SPACY_MODEL,
)

_NLP = None
_MODEL = None


def _get_nlp():
    global _NLP
    if _NLP is None:
        if spacy is None:
            return None
        _NLP = spacy.load(SPACY_MODEL)
    return _NLP


def _get_bert_model():
    global _MODEL
    if _MODEL is None:
        try:
            from sentence_transformers import SentenceTransformer
        except Exception as exc:  # noqa: BLE001
            raise RuntimeError(
                "sentence-transformers is required when ENABLE_BERT=True"
            ) from exc
        _MODEL = SentenceTransformer("all-MiniLM-L6-v2")
    return _MODEL


def compute_similarity(skill_a: str, skill_b: str) -> float:
    if ENABLE_BERT:
        from sentence_transformers import util

        model = _get_bert_model()
        emb_a = model.encode(skill_a, convert_to_tensor=True)
        emb_b = model.encode(skill_b, convert_to_tensor=True)
        return float(util.cos_sim(emb_a, emb_b))

    nlp = _get_nlp()
    if nlp is None:
        return difflib.SequenceMatcher(None, skill_a.lower(), skill_b.lower()).ratio()
    return nlp(skill_a).similarity(nlp(skill_b))


def find_partial_matches(
    student_skill: str, industry_skills: List[str]
) -> List[Tuple[str, float]]:
    matches: List[Tuple[str, float]] = []
    for industry_skill in industry_skills:
        score = compute_similarity(student_skill, industry_skill)
        if PARTIAL_MATCH_MIN_SCORE <= score < SIMILARITY_THRESHOLD:
            matches.append((industry_skill, score))
    return matches
