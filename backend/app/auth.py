import logging
import requests
from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from jose import jwt, JWTError
from sqlmodel import Session, select
from typing import Optional

from .core.config.settings import settings
from .db import get_session
from .models import User

logger = logging.getLogger(__name__)

oauth2_scheme = OAuth2PasswordBearer(tokenUrl=f"{settings.API_V1_STR}/auth/token", auto_error=False)

# Cache for JWKS
_jwks_cache = None

def get_jwks():
    global _jwks_cache
    if _jwks_cache is None:
        try:
            response = requests.get(settings.CLERK_JWKS_URL)
            response.raise_for_status()
            _jwks_cache = response.json()
        except Exception as e:
            logger.error(f"Failed to fetch JWKS from Clerk: {e}")
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Failed to initialize authentication",
            )
    return _jwks_cache

async def get_current_user(
    token: str = Depends(oauth2_scheme), session: Session = Depends(get_session)
) -> User:
    if not token:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Not authenticated",
            headers={"WWW-Authenticate": "Bearer"},
        )

    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    
    try:
        jwks = get_jwks()
        unverified_header = jwt.get_unverified_header(token)
        rsa_key = {}
        for key in jwks["keys"]:
            if key["kid"] == unverified_header["kid"]:
                rsa_key = {
                    "kty": key["kty"],
                    "kid": key["kid"],
                    "use": key["use"],
                    "n": key["n"],
                    "e": key["e"]
                }
        
        if rsa_key:
            payload = jwt.decode(
                token,
                rsa_key,
                algorithms=["RS256"],
                options={"verify_at_hash": False}
            )
            clerk_id: str = payload.get("sub")
            email: str = payload.get("email")
            
            if clerk_id is None:
                raise credentials_exception
        else:
            raise credentials_exception
            
    except (JWTError, KeyError, Exception) as e:
        logger.error(f"Token validation error: {e}")
        raise credentials_exception

    user = session.exec(select(User).where(User.clerk_id == clerk_id)).first()
    
    if user is None:
        # Auto-create user on first login if they exist in Clerk
        # Note: In a production app, you might want to fetch full name from Clerk API here
        user = User(clerk_id=clerk_id, email=email or f"{clerk_id}@clerk.user")
        session.add(user)
        session.commit()
        session.refresh(user)
        
    return user
