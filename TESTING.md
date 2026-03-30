# TESTING.md — Test Strategy & Test Specifications

## Test Setup

All tests live in `tests/`. Run with: `pytest tests/ -v`

No live scraping in tests — always use fixtures from `tests/fixtures/sample_jobs.json`.

---

## Fixtures

### tests/fixtures/sample_jobs.json

Create this file with exactly these 5 entries (used by all tests):

```json
[
  {
    "title": "Data Analyst",
    "company": "TechCorp",
    "location": "Bangalore",
    "description": "Looking for a Data Analyst with Python, SQL, Pandas, NumPy, Tableau, and Excel skills. Knowledge of machine learning is a plus. Familiarity with Power BI and data visualization required.",
    "platform": "mock"
  },
  {
    "title": "Data Analyst",
    "company": "InfoSystems",
    "location": "Hyderabad",
    "description": "Seeking a Data Analyst. Must know Python, SQL, Excel, Tableau, and statistical analysis. Experience with Power BI preferred.",
    "platform": "mock"
  },
  {
    "title": "Machine Learning Engineer",
    "company": "AI Labs",
    "location": "Remote",
    "description": "ML Engineer role requiring Python, TensorFlow, PyTorch, scikit-learn, deep learning, NLP, and Docker. AWS or GCP experience needed.",
    "platform": "mock"
  },
  {
    "title": "Software Engineer",
    "company": "StartupXYZ",
    "location": "Mumbai",
    "description": "Software Engineer needed with Java or Python, REST APIs, Docker, Kubernetes, Git, and SQL knowledge. React or Angular experience a plus.",
    "platform": "mock"
  },
  {
    "title": "Data Analyst",
    "company": "DataCo",
    "location": "Chennai",
    "description": "Data Analyst with strong SQL, Python, Pandas, Excel, and Tableau. Statistical knowledge required. Machine learning exposure helpful.",
    "platform": "mock"
  }
]
```

---

## tests/conftest.py

```python
import pytest
import json
from pathlib import Path
from models import StudentProfile, JobPosting

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
        skills=["Python", "SQL", "Excel"]
    )

@pytest.fixture
def student_with_no_skills():
    return StudentProfile(
        name="Empty Student",
        target_role="Data Analyst",
        skills=["Underwater Basket Weaving"]
    )

@pytest.fixture
def student_with_all_skills():
    return StudentProfile(
        name="Full Student",
        target_role="Data Analyst",
        skills=["Python", "SQL", "Pandas", "NumPy", "Tableau", "Excel", "Power BI", "Machine Learning"]
    )
```

---

## tests/test_scraper.py

```python
import pytest
from scraper.utils import clean_text
from scraper.job_scraper import fetch_jobs
from config.settings import SUPPORTED_ROLES

class TestCleanText:
    def test_removes_html_tags(self):
        result = clean_text("<p>Hello <b>World</b></p>")
        assert "<" not in result
        assert "Hello" in result
        assert "World" in result

    def test_strips_whitespace(self):
        result = clean_text("  lots   of   spaces  ")
        assert result == "lots of spaces"

    def test_handles_empty_string(self):
        assert clean_text("") == ""

    def test_handles_none_input(self):
        # Should not crash — return empty string or handle gracefully
        assert clean_text(None) == ""


class TestFetchJobs:
    def test_returns_list(self, monkeypatch):
        # Force mock mode
        monkeypatch.setattr("config.settings.USE_MOCK_DATA", True)
        jobs = fetch_jobs("Data Analyst")
        assert isinstance(jobs, list)

    def test_returns_job_postings(self, monkeypatch):
        monkeypatch.setattr("config.settings.USE_MOCK_DATA", True)
        from models import JobPosting
        jobs = fetch_jobs("Data Analyst")
        assert len(jobs) > 0
        assert all(isinstance(j, JobPosting) for j in jobs)

    def test_raises_on_invalid_role(self):
        with pytest.raises(ValueError):
            fetch_jobs("Underwater Archaeologist")

    def test_filters_by_role(self, monkeypatch):
        monkeypatch.setattr("config.settings.USE_MOCK_DATA", True)
        jobs = fetch_jobs("Machine Learning Engineer")
        assert len(jobs) > 0
```

---

## tests/test_nlp.py

```python
import pytest
from nlp.skill_extractor import extract_skills, aggregate_skills
from nlp.skill_normalizer import normalize, normalize_list
from nlp.semantic_matcher import compute_similarity


class TestSkillNormalizer:
    def test_normalizes_alias(self):
        assert normalize("ml") == "Machine Learning"

    def test_already_normalized(self):
        assert normalize("Machine Learning") == "Machine Learning"

    def test_case_insensitive(self):
        assert normalize("PYTHON") == "Python"

    def test_normalize_list_deduplicates(self):
        result = normalize_list(["ml", "Machine Learning", "Python"])
        assert result.count("Machine Learning") == 1
        assert "Python" in result

    def test_unknown_skill_passes_through(self):
        result = normalize("QuantumFoo")
        assert result == "Quantumfoo" or result == "QuantumFoo"  # normalized but not in aliases


class TestSkillExtractor:
    def test_extracts_python(self):
        skills = extract_skills("We need Python and SQL skills.")
        assert "Python" in skills

    def test_extracts_sql(self):
        skills = extract_skills("Strong SQL and database knowledge required.")
        assert "SQL" in skills

    def test_extracts_alias(self):
        skills = extract_skills("Experience with ML and deep learning frameworks.")
        # Should normalize "ML" to "Machine Learning"
        assert any("Machine Learning" in s or "Deep Learning" in s for s in skills)

    def test_empty_text(self):
        skills = extract_skills("")
        assert isinstance(skills, list)
        assert len(skills) == 0

    def test_no_false_positives_on_common_words(self):
        skills = extract_skills("The candidate should be a team player who communicates well.")
        assert "The" not in skills
        assert "candidate" not in skills

    def test_aggregate_skills_returns_dict(self, sample_jobs):
        result = aggregate_skills(sample_jobs)
        assert isinstance(result, dict)
        assert len(result) > 0

    def test_aggregate_skills_python_high_frequency(self, data_analyst_jobs):
        result = aggregate_skills(data_analyst_jobs)
        assert "Python" in result
        # Python appears in multiple postings — should have high count
        assert result["Python"] >= 2


class TestSemanticMatcher:
    def test_identical_skills_max_similarity(self):
        score = compute_similarity("Python", "Python")
        assert score > 0.95

    def test_unrelated_skills_low_similarity(self):
        score = compute_similarity("Python", "Kubernetes")
        assert score < 0.8  # spaCy vectors — these should be dissimilar

    def test_similar_skills_mid_similarity(self):
        score = compute_similarity("Machine Learning", "Deep Learning")
        assert score > 0.5

    def test_returns_float(self):
        score = compute_similarity("Python", "Java")
        assert isinstance(score, float)
        assert 0.0 <= score <= 1.0
```

---

## tests/test_analysis.py

```python
import pytest
from analysis.gap_analyzer import analyze
from analysis.skill_classifier import classify_skill


class TestSkillClassifier:
    def test_exact_match(self):
        skill, classification, score = classify_skill("Python", ["Python", "SQL", "Tableau"])
        assert classification == "matched"
        assert score == 1.0

    def test_gap(self):
        skill, classification, score = classify_skill("Rust", ["Python", "SQL", "Tableau"])
        assert classification == "gap"
        assert score == 0.0

    def test_partial_match(self):
        # "Machine Learning" vs "Deep Learning" — should be partial or gap depending on threshold
        skill, classification, score = classify_skill("ML", ["Deep Learning", "Neural Networks"])
        assert classification in ("partial", "gap")  # both are valid depending on threshold

    def test_alias_normalizes_before_matching(self):
        # "ml" should normalize to "Machine Learning" and match
        skill, classification, score = classify_skill("ml", ["Machine Learning", "Python"])
        assert classification == "matched"


class TestGapAnalyzer:
    def test_returns_gap_report(self, student_with_some_skills, data_analyst_jobs):
        from nlp.skill_extractor import aggregate_skills
        from models import GapReport
        industry_skills = aggregate_skills(data_analyst_jobs)
        report = analyze(student_with_some_skills, industry_skills)
        assert isinstance(report, GapReport)

    def test_match_score_range(self, student_with_some_skills, data_analyst_jobs):
        from nlp.skill_extractor import aggregate_skills
        industry_skills = aggregate_skills(data_analyst_jobs)
        report = analyze(student_with_some_skills, industry_skills)
        assert 0.0 <= report.match_score <= 100.0

    def test_full_match_high_score(self, student_with_all_skills, data_analyst_jobs):
        from nlp.skill_extractor import aggregate_skills
        industry_skills = aggregate_skills(data_analyst_jobs)
        report = analyze(student_with_all_skills, industry_skills)
        assert report.match_score > 60.0  # Student has all major skills

    def test_no_skills_low_score(self, student_with_no_skills, data_analyst_jobs):
        from nlp.skill_extractor import aggregate_skills
        industry_skills = aggregate_skills(data_analyst_jobs)
        report = analyze(student_with_no_skills, industry_skills)
        assert report.match_score < 20.0

    def test_gaps_sorted_by_frequency(self, student_with_no_skills, data_analyst_jobs):
        from nlp.skill_extractor import aggregate_skills
        industry_skills = aggregate_skills(data_analyst_jobs)
        report = analyze(student_with_no_skills, industry_skills)
        frequencies = [s.industry_frequency for s in report.top_gaps]
        assert frequencies == sorted(frequencies, reverse=True)

    def test_student_name_in_report(self, student_with_some_skills, data_analyst_jobs):
        from nlp.skill_extractor import aggregate_skills
        industry_skills = aggregate_skills(data_analyst_jobs)
        report = analyze(student_with_some_skills, industry_skills)
        assert report.student_name == "Test Student"
```

---

## tests/test_recommender.py

```python
import pytest
from recommender.resource_recommender import get_resources, recommend_all
from models import Resource


class TestGetResources:
    def test_returns_list(self):
        result = get_resources("Python")
        assert isinstance(result, list)

    def test_returns_resources_for_known_skill(self):
        result = get_resources("Python")
        assert len(result) > 0
        assert all(isinstance(r, Resource) for r in result)

    def test_fallback_for_unknown_skill(self):
        result = get_resources("QuantumTurbineEngineering")
        assert len(result) >= 1
        assert result[0].type == "search"

    def test_resource_has_url(self):
        result = get_resources("SQL")
        for r in result:
            assert r.url.startswith("http")

    def test_case_insensitive_lookup(self):
        result_upper = get_resources("PYTHON")
        result_lower = get_resources("python")
        # Both should return resources (same result)
        assert len(result_upper) > 0
        assert len(result_lower) > 0


class TestRecommendAll:
    def test_returns_dict(self):
        result = recommend_all(["Python", "SQL"])
        assert isinstance(result, dict)

    def test_all_skills_have_entry(self):
        skills = ["Python", "SQL", "Tableau"]
        result = recommend_all(skills)
        for skill in skills:
            assert skill in result or any(k.lower() == skill.lower() for k in result)

    def test_empty_list(self):
        result = recommend_all([])
        assert result == {}
```

---

## Test Coverage Target

| Module | Target Coverage |
|--------|----------------|
| nlp/ | ≥ 80% |
| analysis/ | ≥ 85% |
| recommender/ | ≥ 80% |
| scraper/ | ≥ 60% (scraping is hard to test fully) |
| ui/ | Not unit tested — test manually |

Run coverage: `pytest tests/ --cov=. --cov-report=term-missing`
