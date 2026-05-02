from typing import Dict, List

from app.core.config.settings import PARTIAL_MATCH_MIN_SCORE, SIMILARITY_THRESHOLD
from app.schemas import GapReport, SkillResult, StudentProfile
from app.core.nlp.semantic_matcher import compute_similarity
from app.core.nlp.skill_normalizer import normalize_list


def analyze(student_profile: StudentProfile, industry_skills: Dict[str, int]) -> GapReport:
    student_skills = normalize_list(student_profile.skills)
    industry_skill_names = list(industry_skills.keys())
    normalized_industry = normalize_list(industry_skill_names)

    matched: List[SkillResult] = []
    partial: List[SkillResult] = []
    gaps: List[SkillResult] = []

    # Map normalized industry -> original frequency
    freq_map = {normalize_list([k])[0]: v for k, v in industry_skills.items()}

    for industry_skill in normalized_industry:
        freq = freq_map.get(industry_skill, 0)
        if industry_skill in student_skills:
            matched.append(
                SkillResult(
                    skill=industry_skill,
                    classification="matched",
                    similarity_score=1.0,
                    industry_frequency=freq,
                )
            )
            continue

        best_score = 0.0
        best_match = None
        for student_skill in student_skills:
            score = compute_similarity(student_skill, industry_skill)
            if score > best_score:
                best_score = score
                best_match = student_skill
        if PARTIAL_MATCH_MIN_SCORE <= best_score < SIMILARITY_THRESHOLD:
            partial.append(
                SkillResult(
                    skill=industry_skill,
                    classification="partial",
                    similarity_score=best_score,
                    industry_frequency=freq,
                    matched_to=best_match,
                )
            )
        else:
            gaps.append(
                SkillResult(
                    skill=industry_skill,
                    classification="gap",
                    similarity_score=0.0,
                    industry_frequency=freq,
                )
            )

    student_skills_irrelevant = [s for s in student_skills if s not in normalized_industry]

    total_industry_skills = len(normalized_industry) if normalized_industry else 1
    match_score = (len(matched) / total_industry_skills) * 100

    gaps = sorted(gaps, key=lambda s: s.industry_frequency, reverse=True)

    total_jobs_analyzed = max(industry_skills.values(), default=0)

    return GapReport(
        student_name=student_profile.name,
        target_role=student_profile.target_role,
        match_score=match_score,
        matched=matched,
        partial=partial,
        gaps=gaps,
        student_skills_irrelevant=student_skills_irrelevant,
        total_jobs_analyzed=total_jobs_analyzed,
    )
