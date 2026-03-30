# TASKS.md — Ordered Build Tasks

Execute tasks in order. Do not skip. Mark each done before proceeding.

---

## PHASE 0 — Project Setup

### TASK-001: Initialize Project Structure
**Action:** Create all folders and empty `__init__.py` files exactly as in `ARCHITECTURE.md`.

**Acceptance:**
- `find . -type f -name "*.py" | sort` matches expected structure
- All `__init__.py` files exist in every package folder

---

### TASK-002: Create requirements.txt

**File: `requirements.txt`**
```
streamlit>=1.32.0
spacy>=3.7.0
transformers>=4.38.0
torch>=2.0.0
beautifulsoup4>=4.12.0
selenium>=4.18.0
webdriver-manager>=4.0.0
requests>=2.31.0
pandas>=2.2.0
numpy>=1.26.0
plotly>=5.19.0
python-dotenv>=1.0.0
pytest>=8.0.0
```

**Action:** Create file. Then run `pip install -r requirements.txt` and `python -m spacy download en_core_web_md`.

**Acceptance:** `python -c "import streamlit, spacy, bs4, selenium, plotly"` exits with no errors.

---

### TASK-003: Create Mock Data Files

**Action:** Create `data/mock_jobs.json` with at least 10 realistic job postings for 3 different roles (Data Analyst, Software Engineer, ML Engineer). Each posting must match the `JobPosting` schema in `DATA_SCHEMAS.md`.

**Action:** Create `data/skill_aliases.json` with at least 30 common skill aliases:
```json
{
  "ml": "Machine Learning",
  "machine learning": "Machine Learning",
  "dl": "Deep Learning",
  "nlp": "Natural Language Processing",
  "cv": "Computer Vision",
  "js": "JavaScript",
  "ts": "TypeScript",
  "py": "Python",
  "sql": "SQL",
  "k8s": "Kubernetes"
}
```

**Action:** Create `data/resources_db.json` with at least 20 skills mapped to 2–3 resources each. See schema in `DATA_SCHEMAS.md`.

**Acceptance:** All files are valid JSON (`python -m json.tool data/mock_jobs.json` succeeds).

---

### TASK-004: Create config/settings.py

**Action:** Implement `config/settings.py` exactly as shown in `ARCHITECTURE.md`.
Add `.env.example` with:
```
USE_MOCK_DATA=true
ENABLE_BERT=false
```

**Acceptance:** `from config.settings import USE_MOCK_DATA` works from project root.

---

## PHASE 1 — Scraper Module

### TASK-005: Implement scraper/utils.py

**Functions to implement:**
- `make_request(url, headers=None, retries=3, delay=2) -> requests.Response | None` — retries with exponential backoff
- `get_chrome_driver() -> webdriver.Chrome` — headless Chrome via webdriver-manager
- `clean_text(text: str) -> str` — strip HTML tags, extra whitespace, special chars

**Acceptance:** Unit test `tests/test_scraper.py::test_clean_text` passes.

---

### TASK-006: Implement scraper/linkedin_scraper.py

**Function:** `scrape_linkedin(role: str, limit: int) -> List[dict]`

**Logic:**
1. If `USE_MOCK_DATA` is True → return filtered records from `data/mock_jobs.json`
2. Otherwise: Use `requests` + BeautifulSoup to scrape LinkedIn Jobs search URL
3. Extract: job title, company, location, description text
4. Return list matching `JobPosting` schema

**Important:** LinkedIn may block. Handle `403`/`429` status codes — log warning and return empty list (do NOT crash).

**Acceptance:**
- Mock mode returns at least 3 postings for "Data Analyst"
- Live mode doesn't crash on network failure

---

### TASK-007: Implement scraper/naukri_scraper.py

Same interface as `linkedin_scraper.py` but targets Naukri.com. Use Selenium for dynamic content.

**Function:** `scrape_naukri(role: str, limit: int) -> List[dict]`

**Acceptance:** Same as TASK-006.

---

### TASK-008: Implement scraper/job_scraper.py (Orchestrator)

**Function:** `fetch_jobs(role: str) -> List[JobPosting]`

**Logic:**
1. Call each platform scraper in `SCRAPE_PLATFORMS`
2. Merge and deduplicate results (by job title + company)
3. If total results < 3 → fall back to mock data regardless of `USE_MOCK_DATA`
4. Log count of postings fetched

**Acceptance:** Returns `List[JobPosting]` with at least 3 entries for any supported role.

---

## PHASE 2 — NLP Module

### TASK-009: Implement nlp/skill_normalizer.py

**Function:** `normalize(skill: str) -> str`
- Lowercase input
- Strip punctuation
- Look up in `skill_aliases.json`
- Title-case the result

**Function:** `normalize_list(skills: List[str]) -> List[str]`
- Apply `normalize()` to each skill
- Deduplicate

**Acceptance:** `normalize("ml")` returns `"Machine Learning"`. `normalize("Machine Learning")` returns `"Machine Learning"`.

---

### TASK-010: Implement nlp/skill_extractor.py

**Function:** `extract_skills(text: str) -> List[str]`

**Logic:**
1. Load spaCy model `en_core_web_md`
2. Tokenize and clean text
3. Use spaCy's `PhraseMatcher` with a pre-built skill vocabulary (load from `skill_aliases.json` keys + values)
4. Also extract noun chunks that match common tech patterns (e.g., capitalized abbreviations 2–8 chars, known frameworks)
5. Normalize extracted skills using `skill_normalizer.normalize_list()`
6. Return deduplicated list

**Function:** `aggregate_skills(job_postings: List[JobPosting]) -> Dict[str, int]`
- Run `extract_skills` on each posting's description
- Count frequency of each skill across all postings
- Return dict sorted by frequency descending

**Acceptance:**
- `extract_skills("We need experience with Python, SQL, and machine learning")` returns list containing `["Python", "SQL", "Machine Learning"]`
- `aggregate_skills` returns non-empty dict for mock job data

---

### TASK-011: Implement nlp/semantic_matcher.py

**Function:** `compute_similarity(skill_a: str, skill_b: str) -> float`

**Logic:**
- If `ENABLE_BERT` is False → use spaCy word vectors: `nlp(skill_a).similarity(nlp(skill_b))`
- If `ENABLE_BERT` is True → use `sentence-transformers` cosine similarity

**Function:** `find_partial_matches(student_skill: str, industry_skills: List[str]) -> List[Tuple[str, float]]`
- Compare student skill against each industry skill
- Return pairs where similarity is between `PARTIAL_MATCH_MIN_SCORE` and `SIMILARITY_THRESHOLD`

**Acceptance:** `compute_similarity("Deep Learning", "Neural Networks")` returns float > 0.5

---

## PHASE 3 — Analysis Module

### TASK-012: Implement analysis/skill_classifier.py

**Function:** `classify_skill(student_skill: str, industry_skills: List[str]) -> Tuple[str, str, float]`

Returns: `(student_skill, classification, score)`
Where `classification` ∈ `{"matched", "partial", "gap"}`

**Logic:**
1. Normalize both sides
2. If exact match → `"matched"`, score = 1.0
3. If partial match (above threshold) → `"partial"`, score = similarity value
4. Else → `"gap"`, score = 0.0

**Acceptance:** Unit tests in `tests/test_analysis.py` cover all 3 classification paths.

---

### TASK-013: Implement analysis/gap_analyzer.py

**Function:** `analyze(student_profile: StudentProfile, industry_skills: Dict[str, int]) -> GapReport`

**Logic:**
1. For each industry skill, classify against student's skill list
2. Also classify student skills not found in industry skills (marks student skills not in demand)
3. Compute `match_score = (matched_count / total_industry_skills) * 100`
4. Rank gaps by their industry frequency (most-demanded missing skill = top priority)
5. Return `GapReport` object (see `DATA_SCHEMAS.md`)

**Acceptance:**
- Given a student with `["Python"]` and industry skills `{"Python": 15, "SQL": 10, "Tableau": 5}`, gap report shows `SQL` and `Tableau` as gaps, match_score = ~33%

---

## PHASE 4 — Recommender Module

### TASK-014: Implement recommender/resource_recommender.py

**Function:** `get_resources(skill: str) -> List[Resource]`
- Look up `skill` (normalized) in `data/resources_db.json`
- Return list of `Resource` objects
- If not found → return a generic resource (e.g., Google "learn {skill}" link)

**Function:** `recommend_all(gap_skills: List[str]) -> Dict[str, List[Resource]]`
- Apply `get_resources` to each gap skill
- Return dict: `{skill: [Resource, ...]}`

**Acceptance:** Returns at least 1 resource per gap skill (even if fallback).

---

## PHASE 5 — UI Module

### TASK-015: Implement ui/input_form.py

**Function:** `render_input_form() -> StudentProfile | None`

Renders:
- Text input: Student name
- Selectbox: Target role (from `SUPPORTED_ROLES`)
- Text area: Current skills (comma-separated)
- Submit button

Returns `StudentProfile` object when form submitted, `None` otherwise.

**Acceptance:** See `UI_SPEC.md` for exact layout.

---

### TASK-016: Implement ui/charts.py

**Functions to implement:**

- `skill_match_gauge(score: float) -> plotly.Figure` — Gauge chart 0–100%
- `skill_breakdown_bar(gap_report: GapReport) -> plotly.Figure` — Horizontal bar chart showing matched / partial / gap counts
- `gap_priority_chart(gap_report: GapReport) -> plotly.Figure` — Ranked bar chart of top 10 missing skills by industry frequency

**Acceptance:** Each function returns a valid Plotly figure that renders in Streamlit via `st.plotly_chart()`.

---

### TASK-017: Implement ui/report_view.py

**Function:** `render_report(gap_report: GapReport, resources: Dict[str, List[Resource]])`

Renders full report dashboard. See `UI_SPEC.md` for exact layout.

**Acceptance:** Renders without error for any valid `GapReport`.

---

## PHASE 6 — Entry Point

### TASK-018: Implement app.py

Wire everything together:

```python
import streamlit as st
from ui.input_form import render_input_form
from ui.report_view import render_report
from scraper.job_scraper import fetch_jobs
from nlp.skill_extractor import aggregate_skills
from analysis.gap_analyzer import analyze
from recommender.resource_recommender import recommend_all

st.set_page_config(page_title="Skill Gap Analyzer", layout="wide")

profile = render_input_form()

if profile:
    with st.spinner("Fetching job data..."):
        jobs = fetch_jobs(profile.target_role)
    with st.spinner("Analyzing skills..."):
        industry_skills = aggregate_skills(jobs)
        gap_report = analyze(profile, industry_skills)
        resources = recommend_all([s.skill for s in gap_report.gaps])
    render_report(gap_report, resources)
```

**Acceptance:** `streamlit run app.py` launches without error. Full flow works with mock data.

---

## PHASE 7 — Tests & Docs

### TASK-019: Write All Tests

See `TESTING.md` for full list. All tests must pass: `pytest tests/ -v`

### TASK-020: Write README.md

Include:
- Project description (2 paragraphs)
- Prerequisites
- Installation steps
- How to run (mock mode + live mode)
- How to switch `USE_MOCK_DATA`
- Screenshots placeholder
- Known limitations
