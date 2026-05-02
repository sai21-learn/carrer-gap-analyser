from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import Session

from ..auth import get_current_user
from ..db import get_session
from ..models import Feedback, User

router = APIRouter()

@router.post("/")
async def submit_feedback(
    feedback_data: dict,
    current_user: User = Depends(get_current_user),
    session: Session = Depends(get_session),
):
    resource_url = feedback_data.get("resource_url")
    rating = feedback_data.get("rating")

    if not resource_url or rating not in [1, -1]:
        raise HTTPException(status_code=400, detail="Invalid feedback data")

    feedback = Feedback(
        user_id=current_user.id,
        resource_url=resource_url,
        rating=rating,
    )
    session.add(feedback)
    session.commit()

    return {"message": "Feedback submitted successfully"}
