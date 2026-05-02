# MODULES.md — Per-Module Specifications

---

## Module 1: scraper/job_scraper.py

### Purpose
Orchestrates job data collection across platforms. Single entry point for the rest of the app.

### Public API
```python
def fetch_jobs(role: str) -> List[JobPosting]: ...
```

### Logic
1. Validate `role` against `SUPPORTED_ROLES`. Raise `ValueError` if not found.
2. If `USE_MOCK_DATA=True`, skip scrapers and load from `data/mock_jobs.json`, filter by role.
3. Otherwise, invoke each scraper in `SCRAPE_PLATFORMS` concurrently (use `concurrent.futures.ThreadPoolExecutor`).
4. Merge results, dedup by `(title, company)` tuple.
5. If merged result < 3 postings → log warning and inject mock data to supplement.
6. Return final list.

### Edge Cases
- Role not in `SUPPORTED_ROLES` → raise `ValueError` with helpful message listing valid roles
- All scrapers fail → return mock data for that role, log `ERROR`
- Duplicate postings from multiple platforms → keep first occurrence

---

## Module 2: scraper/linkedin_scraper.py

### Purpose
Scrapes LinkedIn Jobs search results for a given role.

### Public API
```python
def scrape_linkedin(role: str, limit: int = 20) -> List[dict]: ...
```

### Target URL Pattern
```
https://www.linkedin.com/jobs/search/?keywords={role}&location=India&f_TPR=r604800
```
(Last week's postings, India location — adjust as needed)

### Extraction Logic
Use BeautifulSoup on the static HTML. Extract from each job card:
- `title`: `.base-search-card__title`
- `company`: `.base-search-card__subtitle`
- `location`: `.job-search-card__location`
- `description`: Follow job link → scrape `.description__text` (requires additional request)

### Rate Limiting
- Sleep `REQUEST_DELAY_SECONDS` between each detail page request
- Add realistic `User-Agent` header

### Failure Handling
- Status 429 → log warning, return empty list immediately
- Status 403 → log warning, return empty list
- Timeout → log warning, return whatever was collected so far
- Any unhandled exception → log traceback, return empty list (NEVER propagate)

---

## Module 3: scraper/naukri_scraper.py

### Purpose
Scrapes Naukri.com job listings using Selenium (JS-rendered page).

### Public API
```python
def scrape_naukri(role: str, limit: int = 20) -> List[dict]: ...
```

### Target URL Pattern
```
https://www.naukri.com/{role-slug}-jobs
```
Where `role-slug` = role.lower().replace(" ", "-")

### Extraction Logic
1. Launch headless Chrome via `get_chrome_driver()` from `scraper/utils.py`
2. Navigate to URL
3. Wait for `.jobTuple` elements (max 10s)
4. Extract from each card:
   - `title`: `.title`
   - `company`: `.companyName`
   - `location`: `.location`
   - `description`: `.job-desc` (if visible, else empty string)
5. Quit driver after extraction

### Failure Handling
Same as LinkedIn scraper — never propagate exceptions.

---

## Module 4: nlp/skill_extractor.py

### Purpose
Extracts skill keywords from job description text using NLP.

### Public API
```python
def extract_skills(text: str) -> List[str]: ...
def aggregate_skills(job_postings: List[JobPosting]) -> Dict[str, int]: ...
```

### Skill Vocabulary
Build a `PhraseMatcher` from:
1. All keys and values from `data/skill_aliases.json`
2. A hardcoded seed list of ~100 known tech skills (see below)

### Seed Skill List (hardcode in module)
```python
SEED_SKILLS = [
    "Python", "Java", "JavaScript", "TypeScript", "C++", "C#", "Go", "Rust", "Kotlin", "Swift",
    "SQL", "MySQL", "PostgreSQL", "MongoDB", "Redis", "Cassandra", "DynamoDB",
    "Machine Learning", "Deep Learning", "NLP", "Computer Vision", "Reinforcement Learning",
    "TensorFlow", "PyTorch", "Keras", "Scikit-learn", "XGBoost", "LightGBM",
    "Docker", "Kubernetes", "AWS", "Azure", "GCP", "Terraform", "Ansible",
    "React", "Angular", "Vue", "Node.js", "Django", "Flask", "FastAPI", "Spring Boot",
    "Git", "GitHub", "CI/CD", "Jenkins", "GitHub Actions",
    "Pandas", "NumPy", "Matplotlib", "Seaborn", "Plotly", "Tableau", "Power BI",
    "Excel", "JIRA", "Agile", "Scrum", "REST API", "GraphQL", "Microservices",
    "Linux", "Bash", "Shell Scripting", "Data Structures", "Algorithms",
    "System Design", "Object Oriented Programming", "Figma", "Adobe XD"
]
```

### aggregate_skills Logic
```python
from collections import Counter

def aggregate_skills(job_postings):
    all_skills = []
    for posting in job_postings:
        skills = extract_skills(posting.description)
        all_skills.extend(skills)
    freq = Counter(all_skills)
    return dict(sorted(freq.items(), key=lambda x: x[1], reverse=True))
```

---

## Module 5: nlp/semantic_matcher.py

### Purpose
Determines similarity between two skill strings — used for partial matching.

### Public API
```python
def compute_similarity(skill_a: str, skill_b: str) -> float: ...
def find_partial_matches(student_skill: str, industry_skills: List[str]) -> List[Tuple[str, float]]: ...
```

### spaCy Mode (ENABLE_BERT=False)
```python
nlp = spacy.load("en_core_web_md")

def compute_similarity(a, b):
    return nlp(a).similarity(nlp(b))
```

### BERT Mode (ENABLE_BERT=True)
```python
from sentence_transformers import SentenceTransformer, util
model = SentenceTransformer("all-MiniLM-L6-v2")

def compute_similarity(a, b):
    emb_a = model.encode(a, convert_to_tensor=True)
    emb_b = model.encode(b, convert_to_tensor=True)
    return float(util.cos_sim(emb_a, emb_b))
```

### Lazy Loading
Both `nlp` and `model` must be **module-level singletons loaded lazily** to avoid startup overhead.

---

## Module 6: analysis/gap_analyzer.py

### Purpose
Core business logic. Compares student profile against industry skill demand.

### Public API
```python
def analyze(student_profile: StudentProfile, industry_skills: Dict[str, int]) -> GapReport: ...
```

### Algorithm
```
1. Normalize student skills via skill_normalizer
2. For each industry skill (sorted by frequency, take top 30):
     a. Check if exact match in student skills → matched
     b. Check semantic similarity → partial (if 0.5 ≤ sim < 0.75)
     c. Otherwise → gap
3. match_score = (matched_count + 0.5 * partial_count) / min(total_industry_skills, 30) * 100
4. Sort gaps by industry_frequency descending → priority order
5. Return GapReport
```

### match_score Formula
Partial matches contribute 0.5 weight to avoid inflating the score. Score is capped at 100.

---

## Module 7: recommender/resource_recommender.py

### Purpose
Maps identified skill gaps to curated learning resources.

### Public API
```python
def get_resources(skill: str) -> List[Resource]: ...
def recommend_all(gap_skills: List[str]) -> Dict[str, List[Resource]]: ...
```

### Lookup Logic
1. Normalize `skill`
2. Check `data/resources_db.json` for exact key match
3. If no match → fuzzy search: find closest key (use `difflib.get_close_matches`)
4. If still no match → return generic fallback:
```python
Resource(
    title=f"Learn {skill} — Google Search",
    url=f"https://www.google.com/search?q=learn+{skill.replace(' ', '+')}",
    platform="Google",
    type="search"
)
```

### resources_db.json Structure
```json
{
  "Python": [
    {
      "title": "Python for Everybody — Coursera",
      "url": "https://www.coursera.org/specializations/python",
      "platform": "Coursera",
      "type": "course"
    },
    {
      "title": "Official Python Tutorial",
      "url": "https://docs.python.org/3/tutorial/",
      "platform": "Python.org",
      "type": "documentation"
    }
  ]
}
```

---

## Module 8: ui/report_view.py

### Purpose
Renders the full skill gap report as a Streamlit dashboard.

### Public API
```python
def render_report(gap_report: GapReport, resources: Dict[str, List[Resource]]) -> None: ...
```

### Rendering Logic
See `UI_SPEC.md` for exact layout. Key rules:
- Never call `st.rerun()` inside this function
- Use `st.columns()` for side-by-side layout
- Use `st.expander()` for resource lists (collapsed by default)
- Use color-coded `st.metric()` for match score
- All charts via `st.plotly_chart(fig, use_container_width=True)`
