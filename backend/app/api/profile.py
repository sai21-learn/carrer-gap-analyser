import json

from fastapi import APIRouter, Depends, File, HTTPException, UploadFile
from sqlmodel import Session, select

from backend.app.services.resume_parser import extract_text_from_pdf
from nlp.skill_extractor import extract_skills

from ..auth import get_current_user
from ..db import get_session
from ..models import Profile, User

router = APIRouter()


@router.post("/resume")
async def upload_resume(
    file: UploadFile = File(...),
    current_user: User = Depends(get_current_user),
    session: Session = Depends(get_session),
):
    if file.content_type != "application/pdf":
        raise HTTPException(status_code=400, detail="Only PDF files are supported.")

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

        return {"filename": file.filename, "skills": skills}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error parsing PDF: {str(e)}")


@router.get("/")
async def get_profile(
    current_user: User = Depends(get_current_user),
    session: Session = Depends(get_session),
):
    profile = session.exec(
        select(Profile).where(Profile.user_id == current_user.id)
    ).first()
    if not profile:
        return {"user_email": current_user.email, "skills": []}
    return {
        "user_email": current_user.email,
        "skills": json.loads(profile.current_skills) if profile.current_skills else [],
    }
