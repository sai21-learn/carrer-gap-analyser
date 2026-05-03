from __future__ import absolute_import

import logging
from typing import Dict, List

from . import models, schemas
from .core.analysis.gap_analyzer import analyze as analyze_gaps
from .core.nlp.skill_extractor import aggregate_skills
from .core.scraper.job_scraper import fetch_jobs
from .celery_utils import celery_app

logger = logging.getLogger(__name__)


import json
from .db import engine
from sqlmodel import Session, select

@celery_app.task(bind=True)
def run_gap_analysis_task(self, target_role: str, user_skills: List[str], analysis_id: int) -> Dict:
    """
    Celery task to perform a full gap analysis for a user.
    """
    logger.info(
        "Starting gap analysis task for role '%s' with %s skills (Analysis ID: %s)",
        target_role,
        len(user_skills),
        analysis_id
    )

    result_data = {}
    status = "SUCCESS"

    try:
        # 1. Scrape job postings
        self.update_state(state='PROGRESS', meta={'stage': 'SCRAPING_MARKET_DATA', 'progress': 25})
        job_postings = fetch_jobs(role=target_role)
        if not job_postings:
            logger.warning("No job postings found for role '%s'.", target_role)
            result_data = {"error": "No job postings found."}
            status = "FAILURE"
        else:
            # 2. Extract and aggregate skills from job postings
            self.update_state(state='PROGRESS', meta={'stage': 'EXTRACTING_SKILLS', 'progress': 50})
            industry_skills = aggregate_skills(job_postings)
            if not industry_skills:
                logger.warning("No industry skills extracted for role '%s'.", target_role)
                result_data = {"error": "Could not extract industry skills."}
                status = "FAILURE"
            else:
                # 3. Create a student profile
                self.update_state(state='PROGRESS', meta={'stage': 'COMPUTING_SEMANTIC_GAPS', 'progress': 75})
                student_profile = schemas.StudentProfile(
                    name="User", target_role=target_role, skills=user_skills
                )
 
                # 4. Analyze the gap
                report = analyze_gaps(student_profile, industry_skills)
                result_data = report.model_dump(mode='json')
                
                # 5. Generate Roadmap
                self.update_state(state='PROGRESS', meta={'stage': 'GENERATING_ROADMAP', 'progress': 85})
                from .services.roadmap_service import RoadmapService
                gap_skill_names = [g.skill for g in report.gaps]
                roadmap = RoadmapService().get_roadmap_for_gaps(target_role, gap_skill_names)
                result_data["roadmap"] = roadmap
                
                self.update_state(state='PROGRESS', meta={'stage': 'FINALIZING', 'progress': 90})
    except Exception as e:
        logger.error(f"Error in gap analysis task: {e}")
        result_data = {"error": str(e)}
        status = "FAILURE"

    # Update database
    with Session(engine) as session:
        analysis = session.exec(
            select(models.Analysis).where(models.Analysis.id == analysis_id)
        ).first()
        if analysis:
            analysis.status = status
            analysis.result = json.dumps(result_data)
            session.add(analysis)
            session.commit()

    logger.info("Gap analysis complete for role '%s'. Status: %s", target_role, status)
    return result_data


@celery_app.task
def add(x, y):
    return x + y
