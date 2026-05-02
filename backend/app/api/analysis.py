import json

from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import Session, select

from ..auth import get_current_user
from ..db import get_session
from ..models import Profile, User
from ..services.roadmap_service import RoadmapService

router = APIRouter()


@router.get("/{analysis_id}/roadmap")
async def get_personalized_roadmap(
    analysis_id: int,
    current_user: User = Depends(get_current_user),
    session: Session = Depends(get_session),
):
    # For prototype, we'll use the user's latest profile skills
    profile = session.exec(
        select(Profile).where(Profile.user_id == current_user.id)
    ).first()

    if not profile:
        raise HTTPException(status_code=404, detail="Profile not found")

    skills = json.loads(profile.current_skills) if profile.current_skills else []

    # Map to a default roadmap (e.g., backend) or based on target_role
    roadmap_id = "backend"  # Default for now
    if profile.target_role == "Frontend Developer":
        roadmap_id = "frontend"
    elif profile.target_role == "DevOps Engineer":
        roadmap_id = "devops"

    roadmap_data = RoadmapService.map_skills_to_roadmap(skills, roadmap_id)
    return roadmap_data
