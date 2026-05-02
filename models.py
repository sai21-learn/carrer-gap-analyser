from backend.app.models import (
    StudentProfile,
    AnalysisRequest,
    SkillResult,
    GapReport,
    Resource,
)
from dataclasses import dataclass, field
from datetime import datetime
from typing import Dict, List, Optional


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
