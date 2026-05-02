import json
import logging
from fastapi import APIRouter, Depends, HTTPException, status
from sqlmodel import Session, select

from .. import schemas, models
from ..auth import get_current_user
from ..celery_utils import celery_app
from ..celery_worker import run_gap_analysis_task
from ..db import get_session
from ..services.roadmap_service import RoadmapService

logger = logging.getLogger(__name__)
router = APIRouter()

# Dependency to get roadmap service
def get_roadmap_service():
    return RoadmapService()


@router.post("/start", status_code=status.HTTP_202_ACCEPTED)
def start_analysis(
    analysis_request: schemas.AnalysisRequest,
    current_user: models.User = Depends(get_current_user),
    session: Session = Depends(get_session),
):
    """
    Starts a new gap analysis task for the authenticated user.
    """
    profile = session.exec(
        select(models.Profile).where(models.Profile.user_id == current_user.id)
    ).first()
    
    if not profile:
        logger.warning(f"Profile not found for user {current_user.id}")
        raise HTTPException(status_code=404, detail="User profile not found. Please complete your profile first.")

    try:
        user_skills = json.loads(profile.current_skills) if profile.current_skills else []
    except json.JSONDecodeError:
        logger.error(f"Failed to decode skills for user {current_user.id}")
        user_skills = []

    task = run_gap_analysis_task.delay(
        target_role=analysis_request.target_role, user_skills=user_skills
    )

    logger.info(f"Started analysis task {task.id} for user {current_user.id}")
    return {"task_id": task.id}


@router.get("/status/{task_id}")
def task_status(task_id: str):
    """
    Retrieves the status and result of a Celery task.
    """
    task = celery_app.AsyncResult(task_id)
    
    # Map Celery states to user-friendly states if needed
    response = {
        "task_id": task_id,
        "state": task.state,
        "complete": task.ready()
    }
    
    if task.ready():
        if task.successful():
            response["result"] = task.result
        else:
            response["error"] = str(task.result)
            
    return response


@router.get("/roadmap/{task_id}", response_model=schemas.RoadmapResponse)
def get_personalized_roadmap(
    task_id: str,
    roadmap_service: RoadmapService = Depends(get_roadmap_service)
):
    """
    Generates a personalized roadmap based on the results of a gap analysis.
    """
    task = celery_app.AsyncResult(task_id)
    if not task.ready():
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, 
            detail="Analysis task is still in progress."
        )

    if not task.successful():
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Analysis task failed."
        )

    result = task.result
    if not result:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, 
            detail="Task result not found."
        )

    # Extract role and gaps from result
    role = result.get("target_role")
    gaps = [gap["skill"] for gap in result.get("gaps", [])]

    if not role:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail="Invalid task result: missing target role."
        )

    roadmap = roadmap_service.get_roadmap_for_gaps(role, gaps)
    return roadmap
