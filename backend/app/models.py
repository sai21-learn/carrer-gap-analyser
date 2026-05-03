from datetime import datetime
from typing import Optional
from sqlmodel import Field, SQLModel


class User(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    clerk_id: str = Field(unique=True, index=True)
    email: str = Field(unique=True, index=True)
    full_name: Optional[str] = None
    created_at: datetime = Field(default_factory=datetime.now)


class Profile(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    user_id: int = Field(foreign_key="user.id")
    bio: Optional[str] = None
    current_skills: str = Field(default="[]")  # Stored as JSON string
    target_role: Optional[str] = None  # Deprecated in favor of target_roles
    target_roles: str = Field(default="[]")  # Stored as JSON string


class Feedback(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    user_id: int = Field(foreign_key="user.id")
    resource_url: str
    rating: int  # 1 for up, -1 for down
    created_at: datetime = Field(default_factory=datetime.now)


from sqlalchemy import Column, Text

class Analysis(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    user_id: int = Field(foreign_key="user.id")
    target_role: str
    status: str = Field(default="PENDING")
    result: Optional[str] = Field(default="{}", sa_column=Column(Text))  # Stored as JSON string
    created_at: datetime = Field(default_factory=datetime.now)
