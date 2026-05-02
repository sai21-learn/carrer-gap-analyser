from typing import List, Tuple

from app.core.config.settings import PARTIAL_MATCH_MIN_SCORE, SIMILARITY_THRESHOLD
from app.core.nlp.semantic_matcher import compute_similarity
from app.core.nlp.skill_normalizer import normalize, normalize_list


def classify_skill(student_skill: str, industry_skills: List[str]) -> Tuple[str, str, float]:
    normalized_student = normalize(student_skill)
    normalized_industry = normalize_list(industry_skills)

    if normalized_student in normalized_industry:
        return normalized_student, "matched", 1.0

    best_score = 0.0
    for industry_skill in normalized_industry:
        score = compute_similarity(normalized_student, industry_skill)
        if score > best_score:
            best_score = score

    if PARTIAL_MATCH_MIN_SCORE <= best_score < SIMILARITY_THRESHOLD:
        return normalized_student, "partial", best_score

    return normalized_student, "gap", 0.0
