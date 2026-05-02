# Backend Foundation & Auth Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ] syntax for tracking.

**Goal:** Initialize the FastAPI backend with PostgreSQL integration and JWT-based authentication.

**Architecture:** A modular FastAPI application using SQLModel (or SQLAlchemy) for ORM and Pydantic for schemas. Implements OAuth2 with Password Bearer for secure login.

**Tech Stack:** FastAPI, SQLModel, PostgreSQL, Passlib (bcrypt), PyJWT.

---

### Task 1: Project Structure & Environment

**Files:**
- Create: `backend/requirements.txt`
- Create: `backend/.env`
- Create: `backend/app/main.py`

- [ ] **Step 1: Create requirements.txt**

```text
fastapi
uvicorn[standard]
sqlmodel
psycopg2-binary
python-dotenv
passlib[bcrypt]
python-jose[cryptography]
python-multipart
```

- [ ] **Step 2: Create .env**

```text
DATABASE_URL=postgresql://user:password@localhost/career_gap
SECRET_KEY=yoursecretkeyhere
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
```

- [ ] **Step 3: Create initial main.py**

```python
from fastapi import FastAPI

app = FastAPI(title="CareerCompass AI API")

@app.get("/health")
def health_check():
    return {"status": "ok"}
```

- [ ] **Step 4: Commit**

```bash
git checkout -b feat/backend-auth
git add backend/
git commit -m "chore: initialize backend project structure"
```

---

### Task 2: Database Models & Migration

**Files:**
- Create: `backend/app/models.py`
- Create: `backend/app/db.py`

- [ ] **Step 1: Define SQLModels**

```python
from sqlmodel import SQLModel, Field, Relationship
from typing import List, Optional, Dict
from datetime import datetime
import json

class User(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    email: str = Field(unique=True, index=True)
    hashed_password: str
    full_name: Optional[str] = None
    created_at: datetime = Field(default_factory=datetime.now)

class Profile(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    user_id: int = Field(foreign_key="user.id")
    bio: Optional[str] = None
    current_skills: str = Field(default="[]") # Stored as JSON string
    target_role: Optional[str] = None
```

- [ ] **Step 2: Initialize Database connection**

```python
from sqlmodel import create_engine, Session, SQLModel
from .models import User, Profile
import os

DATABASE_URL = os.getenv("DATABASE_URL")
engine = create_engine(DATABASE_URL)

def init_db():
    SQLModel.metadata.create_all(engine)

def get_session():
    with Session(engine) as session:
        yield session
```

- [ ] **Step 3: Run health check with DB init**

```python
# Update main.py
@app.on_event("startup")
def on_startup():
    init_db()
```

- [ ] **Step 4: Commit**

```bash
git add backend/app/models.py backend/app/db.py backend/app/main.py
git commit -m "feat: add user and profile database models"
```

---

### Task 3: Authentication Logic

**Files:**
- Create: `backend/app/auth.py`

- [ ] **Step 1: Create password hashing and JWT helpers**

```python
from passlib.context import CryptContext
from datetime import datetime, timedelta
from jose import JWTError, jwt
import os

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
SECRET_KEY = os.getenv("SECRET_KEY")
ALGORITHM = os.getenv("ALGORITHM")

def verify_password(plain_password, hashed_password):
    return pwd_context.verify(plain_password, hashed_password)

def get_password_hash(password):
    return pwd_context.hash(password)

def create_access_token(data: dict):
    to_encode = data.copy()
    expire = datetime.utcnow() + timedelta(minutes=30)
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
```

- [ ] **Step 2: Commit**

```bash
git add backend/app/auth.py
git commit -m "feat: implement password hashing and JWT token generation"
```

---

### Task 4: Auth Endpoints

**Files:**
- Create: `backend/app/api/auth.py`
- Modify: `backend/app/main.py`

- [ ] **Step 1: Implement Register and Login endpoints**

```python
from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlmodel import Session, select
from ..db import get_session
from ..models import User
from ..auth import get_password_hash, verify_password, create_access_token

router = APIRouter()

@router.post("/register")
def register(user_data: User, session: Session = Depends(get_session)):
    user_data.hashed_password = get_password_hash(user_data.hashed_password)
    session.add(user_data)
    session.commit()
    return {"message": "User created"}

@router.post("/token")
def login(form_data: OAuth2PasswordRequestForm = Depends(), session: Session = Depends(get_session)):
    user = session.exec(select(User).where(User.email == form_data.username)).first()
    if not user or not verify_password(form_data.password, user.hashed_password):
        raise HTTPException(status_code=400, detail="Incorrect email or password")
    access_token = create_access_token(data={"sub": user.email})
    return {"access_token": access_token, "token_type": "bearer"}
```

- [ ] **Step 2: Register router in main.py**

```python
from .api import auth
app.include_router(auth.router, prefix="/auth", tags=["auth"])
```

- [ ] **Step 3: Commit**

```bash
git add backend/app/api/auth.py backend/app/main.py
git commit -m "feat: add registration and token login endpoints"
```
