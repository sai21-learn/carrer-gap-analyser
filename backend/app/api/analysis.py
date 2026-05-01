from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import Session

from .. import models
from ..auth import get_current_user
from ..celery_utils import celery_app
from ..celery_worker import run_gap_analysis_task
from ..db import get_session

router = APIRouter()


@router.post("/start", status_code=202)
def start_analysis(
    analysis_request: models.AnalysisRequest,
    current_user: models.User = Depends(get_current_user),
    session: Session = Depends(get_session),
):
    """
    Starts a new gap analysis task for the authenticated user.
    """
    profile = session.get(models.StudentProfile, current_user.profile_id)
    if not profile:
        raise HTTPException(status_code=404, detail="User profile not found.")

    task = run_gap_analysis_task.delay(
        target_role=analysis_request.target_role, user_skills=profile.skills
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
