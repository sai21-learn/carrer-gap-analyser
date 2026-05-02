import json
import logging
from fastapi import APIRouter, Depends, File, HTTPException, UploadFile, status
from sqlmodel import Session, select

from ..services.resume_parser import extract_text_from_pdf
from ..core.nlp.skill_extractor import extract_skills
from ..auth import get_current_user
from ..db import get_session
from ..models import Profile, User
from .. import schemas

logger = logging.getLogger(__name__)
router = APIRouter()


@router.post("/resume")
async def upload_resume(
    file: UploadFile = File(...),
    current_user: User = Depends(get_current_user),
    session: Session = Depends(get_session),
):
    if file.content_type != "application/pdf":
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, 
            detail="Only PDF files are supported."
        )

    try:
        content = await file.read()
        text = extract_text_from_pdf(content)
        skills = extract_skills(text)

        # Save to profile
        profile = session.exec(
            select(Profile).where(Profile.user_id == current_user.id)
        ).first()
        
        if not profile:
            profile = Profile(user_id=current_user.id)
            session.add(profile)

        profile.current_skills = json.dumps(skills)
        session.commit()

        logger.info(f"Resume parsed successfully for user {current_user.id}")
        return {"filename": file.filename, "skills": skills}
    except Exception as e:
        logger.error(f"Error parsing resume for user {current_user.id}: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, 
            detail=f"Error parsing PDF: {str(e)}"
        )


@router.get("/", response_model=schemas.ProfileRead)
async def get_profile(
    current_user: User = Depends(get_current_user),
    session: Session = Depends(get_session),
):
    profile = session.exec(
        select(Profile).where(Profile.user_id == current_user.id)
    ).first()
    
    if not profile:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Profile not found")
        
    return profile


@router.post("/onboard")
async def onboard_user(
    data: schemas.ProfileBase,
    current_user: User = Depends(get_current_user),
    session: Session = Depends(get_session),
):
    profile = session.exec(
        select(Profile).where(Profile.user_id == current_user.id)
    ).first()
    
    if not profile:
        profile = Profile(user_id=current_user.id)
        session.add(profile)
    
    profile.target_role = data.target_role
    profile.current_skills = json.dumps(data.current_skills)
    
    session.add(profile)
    session.commit()
    
    logger.info(f"Onboarding complete for user {current_user.id}")
    return {"status": "success", "message": "Onboarding complete"}


@router.get("/me")
async def get_my_profile(
    current_user: User = Depends(get_current_user),
    session: Session = Depends(get_session),
):
    profile = session.exec(
        select(Profile).where(Profile.user_id == current_user.id)
    ).first()
    
    return {
        "id": current_user.id,
        "clerk_id": current_user.clerk_id,
        "email": current_user.email,
        "full_name": current_user.full_name,
        "profile": {
            "target_role": profile.target_role if profile else None,
            "skills": json.loads(profile.current_skills) if profile and profile.current_skills else []
        } if profile else None
    }
