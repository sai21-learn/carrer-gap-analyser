from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlmodel import Session, select

from ..auth import create_access_token, get_password_hash, verify_password
from ..db import get_session
from ..models import User

router = APIRouter()


@router.post("/register")
def register(user_data: User, session: Session = Depends(get_session)):
    user_data.hashed_password = get_password_hash(user_data.hashed_password)
    session.add(user_data)
    session.commit()
    return {"message": "User created"}


@router.post("/token")
def login(
    form_data: OAuth2PasswordRequestForm = Depends(),
    session: Session = Depends(get_session),
):
    user = session.exec(select(User).where(User.email == form_data.username)).first()
    if not user or not verify_password(form_data.password, user.hashed_password):
        raise HTTPException(status_code=400, detail="Incorrect email or password")
    access_token = create_access_token(data={"sub": user.email})
    return {"access_token": access_token, "token_type": "bearer"}
