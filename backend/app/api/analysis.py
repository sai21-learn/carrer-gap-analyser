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

    # Create analysis record
    analysis = models.Analysis(
        user_id=current_user.id,
        target_role=analysis_request.target_role,
        status="PENDING"
    )
    session.add(analysis)
    session.commit()
    session.refresh(analysis)

    try:
        user_skills = json.loads(profile.current_skills) if profile.current_skills else []
    except json.JSONDecodeError:
        logger.error(f"Failed to decode skills for user {current_user.id}")
        user_skills = []

    # Start Celery task, with sync fallback
    try:
        task = run_gap_analysis_task.delay(
            target_role=analysis_request.target_role, 
            user_skills=user_skills,
            analysis_id=analysis.id
        )
        logger.info(f"Started analysis task {task.id} for user {current_user.id}")
        return {"task_id": task.id, "analysis_id": analysis.id}
    except Exception as e:
        logger.warning(f"Celery unavailable ({e}), running synchronously...")
        # Sync fallback
        run_gap_analysis_task(
            target_role=analysis_request.target_role, 
            user_skills=user_skills,
            analysis_id=analysis.id
        )
        return {"task_id": "sync", "analysis_id": analysis.id}


@router.get("/history")
def get_analysis_history(
    current_user: models.User = Depends(get_current_user),
    session: Session = Depends(get_session),
):
    """
    Returns the analysis history for the current user.
    """
    history = session.exec(
        select(models.Analysis)
        .where(models.Analysis.user_id == current_user.id)
        .order_by(models.Analysis.created_at.desc())
    ).all()
    
    # Parse results for frontend consumption
    for item in history:
        if item.result and isinstance(item.result, str):
            try:
                item.result = json.loads(item.result)
            except json.JSONDecodeError:
                item.result = {}
    
    return history


@router.get("/history/{analysis_id}")
def get_analysis_detail(
    analysis_id: int,
    current_user: models.User = Depends(get_current_user),
    session: Session = Depends(get_session),
    roadmap_service: RoadmapService = Depends(get_roadmap_service)
):
    """
    Returns the details of a specific analysis including the roadmap.
    """
    analysis = session.exec(
        select(models.Analysis)
        .where(models.Analysis.id == analysis_id)
        .where(models.Analysis.user_id == current_user.id)
    ).first()

    if not analysis:
        raise HTTPException(status_code=404, detail="Analysis not found")

    result = json.loads(analysis.result) if analysis.result else {}
    
    # If success, attach roadmap
    if analysis.status == "SUCCESS" and result:
        role = result.get("target_role")
        gaps = [gap["skill"] for gap in result.get("gaps", [])]
        if role:
            roadmap = roadmap_service.get_roadmap_for_gaps(role, gaps)
            result["roadmap"] = roadmap

    return {
        "id": analysis.id,
        "target_role": analysis.target_role,
        "status": analysis.status,
        "created_at": analysis.created_at,
        "result": result
    }


@router.get("/status/{task_id}")
def task_status(task_id: str):
    """
    Retrieves the status and result of a Celery task.
    """
    if task_id == "sync":
        return {
            "task_id": "sync",
            "state": "SUCCESS",
            "complete": True
        }

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
    else:
        # Include progress metadata if available
        if isinstance(task.info, dict):
            response["meta"] = task.info
            
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
