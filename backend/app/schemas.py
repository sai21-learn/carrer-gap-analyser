from datetime import datetime
from typing import Any, Dict, List, Optional
from pydantic import BaseModel, Field


class UserBase(BaseModel):
    clerk_id: str
    email: str
    full_name: Optional[str] = None


class UserCreate(UserBase):
    pass


class UserRead(UserBase):
    id: int
    created_at: datetime


class ProfileBase(BaseModel):
    bio: Optional[str] = None
    current_skills: List[str] = []
    target_role: Optional[str] = None


class ProfileCreate(ProfileBase):
    user_id: int


class ProfileRead(ProfileBase):
    id: int
    user_id: int


class StudentProfile(BaseModel):
    name: str
    target_role: str
    skills: List[str]
    submitted_at: datetime = Field(default_factory=datetime.now)


class AnalysisRequest(BaseModel):
    target_role: str


class JobSearchFilters(BaseModel):
    location: Optional[str] = None
    sort_by: Optional[str] = None
    what_exclude: Optional[str] = None
    salary_min: Optional[int] = None
    salary_max: Optional[int] = None
    full_time: Optional[bool] = None
    part_time: Optional[bool] = None
    permanent: Optional[bool] = None
    contract: Optional[bool] = None


class JobPosting(BaseModel):
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
    scraped_at: datetime = Field(default_factory=datetime.now)


class SkillResult(BaseModel):
    skill: str
    classification: str
    similarity_score: float
    industry_frequency: int
    matched_to: Optional[str] = None


class GapReport(BaseModel):
    student_name: str
    target_role: str
    match_score: float
    matched: List[SkillResult]
    partial: List[SkillResult]
    gaps: List[SkillResult]
    student_skills_irrelevant: List[str]
    total_jobs_analyzed: int
    generated_at: datetime = Field(default_factory=datetime.now)


class Resource(BaseModel):
    title: str
    url: str
    platform: str
    type: str


class RoadmapNode(BaseModel):
    id: str
    data: Dict[str, Any]
    position: Dict[str, float]
    type: str = "default"
    status: str = "completed"
    resources: List[Resource] = []


class RoadmapEdge(BaseModel):
    id: str
    source: str
    target: str


class RoadmapResponse(BaseModel):
    nodes: List[RoadmapNode]
    edges: List[RoadmapEdge]
    content: Dict[str, str] = {}


class FeedbackBase(BaseModel):
    resource_url: str
    rating: int  # 1 for up, -1 for down


class FeedbackCreate(FeedbackBase):
    user_id: int


class FeedbackRead(FeedbackBase):
    id: int
    user_id: int
    created_at: datetime
