import logging
from fastapi import APIRouter, Depends, HTTPException, status
from sqlmodel import Session

from ..auth import get_current_user
from ..db import get_session
from ..models import Feedback, User
from .. import schemas

logger = logging.getLogger(__name__)
router = APIRouter()

@router.post("/", status_code=status.HTTP_201_CREATED)
async def submit_feedback(
    feedback_in: schemas.FeedbackBase,
    current_user: User = Depends(get_current_user),
    session: Session = Depends(get_session),
):
    """
    Submits user feedback for a specific resource.
    """
    feedback = Feedback(
        user_id=current_user.id,
        resource_url=feedback_in.resource_url,
        rating=feedback_in.rating,
    )
    session.add(feedback)
    session.commit()

    logger.info(f"Feedback submitted by user {current_user.id} for {feedback_in.resource_url}")
    return {"message": "Feedback submitted successfully"}
