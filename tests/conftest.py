import json
import sys
from pathlib import Path

import pytest

ROOT_DIR = Path(__file__).resolve().parents[1]
if str(ROOT_DIR) not in sys.path:
    sys.path.insert(0, str(ROOT_DIR))

from models import JobPosting, StudentProfile

FIXTURES_DIR = Path(__file__).parent / "fixtures"


@pytest.fixture
def sample_jobs():
    with open(FIXTURES_DIR / "sample_jobs.json") as f:
        data = json.load(f)
    return [JobPosting(**job) for job in data]


@pytest.fixture
def data_analyst_jobs(sample_jobs):
    return [j for j in sample_jobs if "Data Analyst" in j.title]


@pytest.fixture
def student_with_some_skills():
    return StudentProfile(
        name="Test Student",
        target_role="Data Analyst",
        skills=["Python", "SQL", "Excel"],
    )


@pytest.fixture
def student_with_no_skills():
    return StudentProfile(
        name="Empty Student",
        target_role="Data Analyst",
        skills=["Underwater Basket Weaving"],
    )


@pytest.fixture
def student_with_all_skills():
    return StudentProfile(
        name="Full Student",
        target_role="Data Analyst",
        skills=[
            "Python",
            "SQL",
            "Pandas",
            "NumPy",
            "Tableau",
            "Excel",
            "Power BI",
            "Machine Learning",
        ],
    )
