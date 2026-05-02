# DATA_SCHEMAS.md — Data Structures & Type Definitions

All dataclasses live in a shared `models.py` at the project root.
Import from there: `from models import StudentProfile, JobPosting, GapReport, SkillResult, Resource`

---

## models.py — Full Implementation

```python
from dataclasses import dataclass, field
from typing import List, Dict, Optional
from datetime import datetime

@dataclass
class StudentProfile:
    name: str                        # Student's name (display only)
    target_role: str                 # Must be in SUPPORTED_ROLES
    skills: List[str]                # Raw skills entered by user
    submitted_at: datetime = field(default_factory=datetime.now)

    def __post_init__(self):
        # Normalize skills: strip whitespace, remove empty strings
        self.skills = [s.strip() for s in self.skills if s.strip()]


@dataclass
class JobPosting:
    title: str                       # Job title
    company: str                     # Company name
    location: str                    # City / Remote
    description: str                 # Full job description text
    platform: str                    # "linkedin" | "naukri" | "mock"
    url: Optional[str] = None        # Source URL (optional)
    scraped_at: datetime = field(default_factory=datetime.now)


@dataclass
class SkillResult:
    skill: str                       # Normalized skill name
    classification: str              # "matched" | "partial" | "gap"
    similarity_score: float          # 0.0 to 1.0
    industry_frequency: int          # How often this skill appeared in job postings
    matched_to: Optional[str] = None # For partial: which student skill it matched

    @property
    def priority(self) -> int:
        """Higher priority = more important gap to fill."""
        if self.classification == "gap":
            return self.industry_frequency
        return 0


@dataclass
class GapReport:
    student_name: str
    target_role: str
    match_score: float               # 0.0 to 100.0 — overall alignment percentage
    
    matched: List[SkillResult]       # Skills student has that industry wants
    partial: List[SkillResult]       # Skills partially matched (need improvement)
    gaps: List[SkillResult]          # Skills missing from student profile
    
    student_skills_irrelevant: List[str]   # Student skills not in demand for this role
    total_jobs_analyzed: int         # Number of job postings used
    generated_at: datetime = field(default_factory=datetime.now)

    @property
    def total_industry_skills(self) -> int:
        return len(self.matched) + len(self.partial) + len(self.gaps)

    @property
    def top_gaps(self) -> List[SkillResult]:
        """Top 10 gaps by industry frequency (highest priority first)."""
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
    title: str                       # Display title of the resource
    url: str                         # Direct link
    platform: str                    # "Coursera" | "YouTube" | "Docs" | "Google" etc.
    type: str                        # "course" | "video" | "documentation" | "search"
```

---

## data/mock_jobs.json — Schema

```json
[
  {
    "title": "Data Analyst",
    "company": "Infosys",
    "location": "Bangalore, India",
    "description": "We are looking for a Data Analyst with strong Python and SQL skills. Experience with Pandas, NumPy, and Tableau is required. Knowledge of machine learning is a plus.",
    "platform": "mock",
    "url": null
  }
]
```

Minimum 10 entries. Include at least 3 roles: "Data Analyst", "Software Engineer", "Machine Learning Engineer".

---

## data/resources_db.json — Schema

```json
{
  "Python": [
    {
      "title": "Python for Everybody — Coursera",
      "url": "https://www.coursera.org/specializations/python",
      "platform": "Coursera",
      "type": "course"
    }
  ],
  "SQL": [
    {
      "title": "SQL Tutorial — W3Schools",
      "url": "https://www.w3schools.com/sql/",
      "platform": "W3Schools",
      "type": "documentation"
    }
  ]
}
```

Must include resources for at minimum: Python, SQL, Machine Learning, Deep Learning, TensorFlow, PyTorch, Docker, Kubernetes, React, Node.js, AWS, Git, Pandas, Tableau, Power BI, System Design, REST API, Data Structures, Algorithms, JavaScript.

---

## data/skill_aliases.json — Schema

```json
{
  "ml": "Machine Learning",
  "ai": "Artificial Intelligence",
  "dl": "Deep Learning",
  "nlp": "Natural Language Processing",
  "cv": "Computer Vision",
  "rl": "Reinforcement Learning",
  "js": "JavaScript",
  "ts": "TypeScript",
  "py": "Python",
  "sql": "SQL",
  "nosql": "NoSQL",
  "k8s": "Kubernetes",
  "kube": "Kubernetes",
  "tf": "TensorFlow",
  "sklearn": "Scikit-learn",
  "scikit": "Scikit-learn",
  "scikit learn": "Scikit-learn",
  "oop": "Object Oriented Programming",
  "dsa": "Data Structures",
  "data structures and algorithms": "Data Structures",
  "apis": "REST API",
  "rest": "REST API",
  "gcp": "Google Cloud Platform",
  "aws": "Amazon Web Services",
  "azure": "Microsoft Azure",
  "powerbi": "Power BI",
  "power bi": "Power BI",
  "node": "Node.js",
  "nodejs": "Node.js",
  "react.js": "React",
  "reactjs": "React",
  "vuejs": "Vue",
  "vue.js": "Vue",
  "angular.js": "Angular"
}
```
