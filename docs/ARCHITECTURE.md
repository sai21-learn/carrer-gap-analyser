# ARCHITECTURE.md — System Architecture

## System Pipeline (5 Stages)

```
[Student Input]
      │
      ▼
[Stage 1: Streamlit UI]          ← User enters name, role, skills
      │
      ▼
[Stage 2: Job Scraper]           ← Fetches live postings (or mock fallback)
      │  BeautifulSoup (static)
      │  Selenium (dynamic JS pages)
      ▼
[Stage 3: NLP Engine]            ← Extracts skill keywords from job descriptions
      │  spaCy NER + rule-based patterns
      │  BERT similarity for semantic matching
      ▼
[Stage 4: Gap Analysis Engine]   ← Compares student skills vs industry skills
      │  3-way classification: matched / partial / gap
      ▼
[Stage 5: Recommendation Engine] ← Maps gaps → curated learning resources
      │
      ▼
[Output: Skill Gap Report]       ← Streamlit dashboard with charts + resource links
```

---

## Folder Structure

```
skill-gap-analyzer/
│
├── app.py                        # Streamlit entry point
├── requirements.txt
├── .env.example                  # Template for env vars (no real secrets)
│
├── config/
│   └── settings.py               # All config constants, toggles, thresholds
│
├── scraper/
│   ├── __init__.py
│   ├── job_scraper.py            # Orchestrates scraping across platforms
│   ├── linkedin_scraper.py       # LinkedIn-specific scraper
│   ├── naukri_scraper.py         # Naukri-specific scraper
│   └── utils.py                  # Shared scraper helpers (retry, rate limit)
│
├── nlp/
│   ├── __init__.py
│   ├── skill_extractor.py        # spaCy NER + pattern matching
│   ├── semantic_matcher.py       # BERT-based similarity matching
│   └── skill_normalizer.py       # Normalize variants ("ML" → "Machine Learning")
│
├── analysis/
│   ├── __init__.py
│   ├── gap_analyzer.py           # Core comparison logic
│   └── skill_classifier.py       # Matched / Partial / Gap classification
│
├── recommender/
│   ├── __init__.py
│   └── resource_recommender.py   # Maps skill gaps → learning resources
│
├── ui/
│   ├── __init__.py
│   ├── input_form.py             # Streamlit input components
│   ├── report_view.py            # Streamlit report rendering
│   └── charts.py                 # Plotly chart builders
│
├── data/
│   ├── mock_jobs.json            # Mock job postings for offline dev/testing
│   ├── skill_aliases.json        # Skill normalization map
│   └── resources_db.json         # Curated resource database (skill → links)
│
├── logs/
│   └── app.log                   # Runtime logs (gitignored)
│
└── tests/
    ├── test_scraper.py
    ├── test_nlp.py
    ├── test_analysis.py
    ├── test_recommender.py
    └── fixtures/
        └── sample_jobs.json      # Small deterministic fixture for tests
```

---

## Key Config (config/settings.py)

```python
# --- Feature Toggles ---
USE_MOCK_DATA = True           # Set False to enable live scraping
ENABLE_BERT = False            # Set True to use BERT (slower, more accurate)

# --- Scraping ---
MAX_JOBS_PER_PLATFORM = 20
REQUEST_DELAY_SECONDS = 2      # Rate limiting between requests
SCRAPE_TIMEOUT_SECONDS = 10

# --- NLP ---
SPACY_MODEL = "en_core_web_md"
SIMILARITY_THRESHOLD = 0.75    # Cosine similarity cutoff for partial match

# --- Analysis ---
PARTIAL_MATCH_MIN_SCORE = 0.5
PARTIAL_MATCH_MAX_SCORE = 0.75

# --- Supported Roles ---
SUPPORTED_ROLES = [
    "Data Analyst",
    "Data Scientist",
    "Machine Learning Engineer",
    "Software Engineer",
    "Frontend Developer",
    "Backend Developer",
    "DevOps Engineer",
    "UI/UX Designer",
    "Cybersecurity Analyst",
    "Cloud Engineer",
]

# --- Platforms ---
SCRAPE_PLATFORMS = ["linkedin", "naukri"]  # extend as needed
```

---

## Data Flow Detail

### Input → Scraper
- Role string passed to scraper
- Scraper returns: `List[JobPosting]` (see DATA_SCHEMAS.md)

### Scraper → NLP
- Raw job description text per posting
- NLP returns: `List[str]` of extracted skill keywords per posting
- Aggregated across all postings into `Dict[str, int]` (skill → frequency)

### NLP → Gap Analysis
- Industry skills dict + student skills list
- Returns: `GapReport` object (see DATA_SCHEMAS.md)

### Gap Analysis → Recommender
- List of gap skill strings
- Returns: `Dict[str, List[Resource]]`

### Everything → UI
- `GapReport` + resources dict → rendered as Streamlit dashboard
