import json
from datetime import datetime
from typing import Any, Dict, List, Optional
from dataclasses import dataclass, field

from sqlmodel import Field, Relationship, SQLModel


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
    current_skills: str = Field(default="[]")  # Stored as JSON string
    target_role: Optional[str] = None


class StudentProfile(SQLModel):
    name: str
    target_role: str
    skills: List[str]
    submitted_at: datetime = Field(default_factory=datetime.now)


class AnalysisRequest(SQLModel):
    target_role: str


@dataclass
class JobSearchFilters:
    location: Optional[str] = None
    sort_by: Optional[str] = None
    what_exclude: Optional[str] = None
    salary_min: Optional[int] = None
    salary_max: Optional[int] = None
    full_time: Optional[bool] = None
    part_time: Optional[bool] = None
    permanent: Optional[bool] = None
    contract: Optional[bool] = None


@dataclass
class JobPosting:
    title: str
    company: str
    location: str
    description: str
    platform: str
    url: Optional[str] = None
    posted_at: Optional[datetime] = None
    salary_min: Optional[float] = None
    salary_max: Optional[float] = None
    contract_type: Optional[str] = None
    contract_time: Optional[str] = None
    scraped_at: datetime = field(default_factory=datetime.now)


class SkillResult(SQLModel):
    skill: str
    classification: str
    similarity_score: float
    industry_frequency: int
    matched_to: Optional[str] = None


class GapReport(SQLModel):
    student_name: str
    target_role: str
    match_score: float
    matched: List[SkillResult]
    partial: List[SkillResult]
    gaps: List[SkillResult]
    student_skills_irrelevant: List[str]
    total_jobs_analyzed: int
    generated_at: datetime = Field(default_factory=datetime.now)


class Resource(SQLModel):
    title: str
    url: str
    platform: str
    type: str


class RoadmapNode(SQLModel):
    id: str
    data: Dict[str, Any]
    position: Dict[str, float]
    type: str = "default"
    status: str = "completed"
    resources: List[Resource] = []


class RoadmapEdge(SQLModel):
    id: str
    source: str
    target: str


class RoadmapResponse(SQLModel):
    nodes: List[RoadmapNode]
    edges: List[RoadmapEdge]
    content: Dict[str, str] = {}
