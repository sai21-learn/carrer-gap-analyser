from __future__ import absolute_import

import logging
from typing import Dict, List

from . import models
from .core.analysis.gap_analyzer import analyze as analyze_gaps
from .core.nlp.skill_extractor import aggregate_skills
from .core.scraper.job_scraper import fetch_jobs
from .celery_utils import celery_app

logger = logging.getLogger(__name__)


@celery_app.task
def run_gap_analysis_task(target_role: str, user_skills: List[str]) -> Dict:
    """
    Celery task to perform a full gap analysis for a user.
    """
    logger.info(
        "Starting gap analysis task for role '%s' with %s skills",
        target_role,
        len(user_skills),
    )

    # 1. Scrape job postings
    job_postings = fetch_jobs(role=target_role)
    if not job_postings:
        logger.warning("No job postings found for role '%s'.", target_role)
        return {"error": "No job postings found."}

    # 2. Extract and aggregate skills from job postings
    industry_skills = aggregate_skills(job_postings)
    if not industry_skills:
        logger.warning("No industry skills extracted for role '%s'.", target_role)
        return {"error": "Could not extract industry skills."}

    # 3. Create a student profile
    student_profile = models.StudentProfile(
        name="temp", target_role=target_role, skills=user_skills
    )

    # 4. Analyze the gap
    report = analyze_gaps(student_profile, industry_skills)

    logger.info("Gap analysis complete for role '%s'.", target_role)
    return report.model_dump()


@celery_app.task
def add(x, y):
    return x + y
