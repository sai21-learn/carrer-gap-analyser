from dataclasses import dataclass, field
from datetime import datetime
from typing import Dict, List, Optional


@dataclass
class StudentProfile:
    name: str
    target_role: str
    skills: List[str]
    submitted_at: datetime = field(default_factory=datetime.now)

    def __post_init__(self) -> None:
        self.skills = [s.strip() for s in self.skills if s.strip()]


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


@dataclass
class SkillResult:
    skill: str
    classification: str
    similarity_score: float
    industry_frequency: int
    matched_to: Optional[str] = None

    @property
    def priority(self) -> int:
        if self.classification == "gap":
            return self.industry_frequency
        return 0


@dataclass
class GapReport:
    student_name: str
    target_role: str
    match_score: float

    matched: List[SkillResult]
    partial: List[SkillResult]
    gaps: List[SkillResult]

    student_skills_irrelevant: List[str]
    total_jobs_analyzed: int
    generated_at: datetime = field(default_factory=datetime.now)

    @property
    def total_industry_skills(self) -> int:
        return len(self.matched) + len(self.partial) + len(self.gaps)

    @property
    def top_gaps(self) -> List[SkillResult]:
        return sorted(self.gaps, key=lambda s: s.industry_frequency, reverse=True)[:10]

    @property
    def summary(self) -> str:
        return (
            f"{self.student_name} matches {self.match_score:.1f}% of "
            f"{self.target_role} requirements based on {self.total_jobs_analyzed} job postings. "
            f"Matched: {len(self.matched)}, Partial: {len(self.partial)}, Gaps: {len(self.gaps)}."
        )


@dataclass
class Resource:
    title: str
    url: str
    platform: str
    type: str
