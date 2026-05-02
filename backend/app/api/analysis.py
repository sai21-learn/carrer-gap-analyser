import json

from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import Session, select

from .. import models
from ..auth import get_current_user
from ..celery_utils import celery_app
from ..celery_worker import run_gap_analysis_task
from ..db import get_session
from ..models import Profile, User
from ..services.roadmap_service import RoadmapService

router = APIRouter()

roadmap_service = RoadmapService()


@router.post("/start", status_code=202)
def start_analysis(
    analysis_request: models.AnalysisRequest,
    current_user: models.User = Depends(get_current_user),
    session: Session = Depends(get_session),
):
    """
    Starts a new gap analysis task for the authenticated user.
    """
    profile = session.exec(
        select(Profile).where(Profile.user_id == current_user.id)
    ).first()
    if not profile:
        raise HTTPException(status_code=404, detail="User profile not found.")

    user_skills = json.loads(profile.current_skills) if profile.current_skills else []

    task = run_gap_analysis_task.delay(
        target_role=analysis_request.target_role, user_skills=user_skills
    )

    return {"task_id": task.id}


@router.get("/status/{task_id}")
def task_status(task_id: str):
    """
    Retrieves the status and result of a Celery task.
    """
    task = celery_app.AsyncResult(task_id)
    response = {"state": task.state, "result": task.result}
    return response


@router.get("/roadmap/{task_id}", response_model=models.RoadmapResponse)
def get_personalized_roadmap(task_id: str):
    """
    Generates a personalized roadmap based on the results of a gap analysis.
    """
    task = celery_app.AsyncResult(task_id)
    if not task.ready():
        raise HTTPException(status_code=400, detail="Analysis task is not complete.")

    result = task.result
    if not result or "error" in result:
        raise HTTPException(
            status_code=500, detail=result.get("error", "Task result not found")
        )

    # Extract role and gaps from result
    role = result.get("target_role")
    gaps = [gap["skill"] for gap in result.get("gaps", [])]

    roadmap = roadmap_service.get_roadmap_for_gaps(role, gaps)
    return roadmap
