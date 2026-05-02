# VIVA PRACTICE INTERVIEW SCRIPT

## Instructions
Person A (Viva Panel) asks questions from this script.  
Person B (You) answers, trying to explain clearly and precisely.  
After each answer, deeper follow-up questions test your understanding.

---

## ROUND 1: PROJECT OVERVIEW

### Q1.1: Tell us about your project in 2 minutes.

**Expected Answer Structure:**
1. Problem statement (students need job market insights)
2. Solution (automated skill gap analysis)
3. Technical approach (5-stage pipeline)
4. Key results (match score, recommendations)

**Sample Answer:**
"My project is an AI Skill Gap Analyzer. The problem it solves is that students often don't understand what specific skills the job market demands for their target role. My solution is a Streamlit web application that:

1. Takes student input (name, target role, current skills)
2. Scrapes real job postings from LinkedIn, Naukri, and Adzuna
3. Uses spaCy NLP to extract skill requirements
4. Compares student skills to industry demands
5. Recommends curated learning resources for gaps

The output is a dashboard showing overall match score (0-100%), and breaking down skills into three categories: Matched (student has them), Partial (student has similar skills), and Gap (student needs to acquire).

The main impact: Students get data-driven, personalized learning recommendations instead of guessing what to study."

---

### Q1.1.1 (Follow-up): What makes your approach different from just looking at job descriptions manually?

**What They're Testing:** Problem understanding, value proposition

**Sample Answer:**
"Manual review is subjective, slow, and doesn't scale. My approach:
1. **Automated**: Analyzes 20+ jobs in seconds (vs hours for manual)
2. **Consistent**: Same criteria applied to all jobs (no human bias)
3. **Quantified**: Match score is objective, comparable across roles
4. **Normalized**: Handles skill synonyms ('ML' = 'Machine Learning')
5. **Prioritized**: Gaps ranked by industry frequency (most-wanted first)
6. **Personalized**: Returns curated resources per skill gap

So it's not just faster—it's smarter and more actionable."

---

### Q1.1.2 (Follow-up): Who would use this? What's the target audience?

**What They're Testing:** Business sense, use-case clarity

**Sample Answer:**
"Primary: College students figuring out what to study for a career pivot.
Secondary: Job seekers retraining into new fields.
Tertiary: Companies (HR) assessing candidate skill alignment.

The MVP targets students because:
- High pain point (career anxiety)
- Lower friction (single user, no authentication)
- Easy to validate (direct feedback)
- Scalable (works for any role/domain)"

---

## ROUND 2: ARCHITECTURE & DESIGN

### Q2.1: Walk us through your system architecture. What are the main components?

**Expected Answer Structure:**
1. Draw 5-stage pipeline
2. Name each component
3. Explain input/output of each stage

**Sample Answer:**
"The system is a 5-stage pipeline:

**Stage 1: Streamlit UI** - User enters name, target role, and skills
**Stage 2: Job Scraper** - Orchestrates fetching jobs from LinkedIn, Naukri, Adzuna. Falls back to mock data if live scraping fails.
**Stage 3: NLP Engine** - Extracts skills from job descriptions using spaCy NER + pattern matching. Normalizes variants.
**Stage 4: Gap Analyzer** - Compares student skills to industry skills using similarity matching (0.7 threshold). Classifies each as Matched/Partial/Gap.
**Stage 5: Recommender** - Maps each gap to curated learning resources from our database.

Each stage is modular—if scraper fails, we skip it and use mock data. If NLP has an error, we log and continue with partial results. This makes the system resilient."

---

### Q2.1.1 (Follow-up): Why did you choose this architecture instead of a monolithic design?

**What They're Testing:** Design maturity, separation of concerns

**Sample Answer:**
"Modular design has clear benefits:
1. **Testability** - Each module tested independently with fixtures
2. **Reusability** - NLP module can be swapped (spaCy → BERT) without touching scraper
3. **Maintainability** - Bug in recommender doesn't break scraper
4. **Scalability** - Scraper can become microservice later if needed
5. **Fallbacks** - If one component fails, others continue

Trade-off: Slightly more code/complexity than monolithic. But for this use case (data pipeline), modularity is worth it because:
- Each stage fails independently
- You can run stages offline (test NLP without internet)
- Clear responsibility boundaries"

---

### Q2.1.2 (Follow-up): How do you orchestrate these modules? What calls what?

**What They're Testing:** Code organization, calling patterns

**Sample Answer:**
"app.py is the orchestrator. It imports and calls in sequence:

```
app.py
  ├─ render_input_form() [ui/input_form.py]
  │   ↓ (user submits)
  ├─ fetch_jobs(role) [scraper/job_scraper.py]
  │   ├─ → scrape_linkedin(role)
  │   ├─ → scrape_naukri(role)
  │   └─ → (fallback to mock)
  │   ↓ (returns List[JobPosting])
  ├─ aggregate_skills(jobs) [nlp/skill_extractor.py]
  │   ├─ → extract_skills_from_text()
  │   └─ → normalize_skills()
  │   ↓ (returns Dict[skill → frequency])
  ├─ analyze(student_profile, industry_skills) [analysis/gap_analyzer.py]
  │   ├─ → classify_skill() for each skill
  │   ↓ (returns GapReport)
  ├─ recommend_all(gap_report) [recommender/resource_recommender.py]
  │   ↓ (returns List[Resource] per gap)
  └─ render_report(report, resources) [ui/report_view.py]
      ↓ (displays dashboard)
```

Each returns a typed dataclass (StudentProfile, JobPosting, SkillResult, GapReport) so the contract is clear."

---

## ROUND 3: NLP & ALGORITHMS

### Q3.1: How does skill extraction work? What's your NLP approach?

**Expected Answer Structure:**
1. Input (job description text)
2. Process (spaCy NER + patterns)
3. Output (list of skills)
4. Explain hybrid approach

**Sample Answer:**
"I use a hybrid approach combining spaCy NER and rule-based pattern matching.

**Process:**
1. Tokenize job description using spaCy
2. Apply NER model to identify entities (some are skills, some not)
3. Apply rule-based patterns (e.g., regex for 'Python', 'C++', 'AWS')
4. Filter to skill-like tokens
5. Normalize using skill_aliases.json
6. Deduplicate and return

**Why hybrid?**
- Pure ML (NER alone) misses skills outside training data ('Terraform', new frameworks)
- Pure rules miss context ('Python' in 'talk Python' isn't programming)
- Hybrid = best of both worlds

**Accuracy:** ~85-90% on our 5-job fixture.

**Optional BERT upgrade:** If accuracy matters more than speed, we can swap to BERT embeddings for better semantic understanding of skill synonyms."

---

### Q3.1.1 (Follow-up): What's the difference between exact match and similarity matching?

**What They're Testing:** Understanding of similarity vs exact, thresholds

**Sample Answer:**
"**Exact Match:**
- Student skill 'Python' vs Industry skill 'Python' → classification = Matched
- String equality check (lowercased, trimmed)

**Similarity Matching:**
- Student skill 'ML' vs Industry skill 'Machine Learning'
- Compute cosine similarity of spaCy word vectors
- If similarity ≥ 0.7 → classify as Partial
- If < 0.7 → classify as Gap

**Why 0.7?**
- Empirically tuned on our 5 jobs
- Below 0.7 → too noisy (false positives like 'Git' ≈ 'GitHub')
- Above 0.7 → too strict (misses valid synonyms)
- Configurable in settings.py if needed"

---

### Q3.1.2 (Follow-up): How would you improve accuracy? What's missing?

**What They're Testing:** Critical thinking, next steps

**Sample Answer:**
"Current bottlenecks:
1. **Spelling errors** - 'pyhton' not caught by spaCy, only aliases
2. **Acronyms** - 'ML' in isolation hard to classify
3. **Domain-specific terms** - New frameworks like 'LangChain' not in spaCy
4. **Contextual understanding** - 'API' in 'REST API' vs 'API key' treated same

**Improvements:**
1. **BERT** - Semantic understanding of synonyms (implemented, toggled)
2. **Custom NER model** - Fine-tune on job description data
3. **Fuzzy matching** - Handle typos ('pyhton' → 'python')
4. **Domain dictionary** - Curate 500 tech skills manually, use as primary source
5. **Human feedback loop** - Log student corrections, retrain model

If I had more time, I'd focus on fine-tuning BERT and building domain dictionary."

---

## ROUND 4: DATA & LOGIC

### Q4.1: Walk us through gap analysis. How do you decide if a skill is Matched, Partial, or Gap?

**Expected Answer Structure:**
1. Decision tree / algorithm
2. Concrete example
3. Explain each classification

**Sample Answer:**
"Classification happens in skill_classifier.py. For each industry skill:

```
Industry Skill 'SQL'
├─ Is 'SQL' in student skills? 
│  YES → Classification = Matched
│  NO ↓
├─ For each student skill, check similarity
│  'MySQL' has similarity 0.85 to 'SQL' (≥ 0.7 threshold)
│  → Classification = Partial, matched_to = 'MySQL'
│  If no student skill ≥ 0.7 similarity ↓
└─ Classification = Gap
```

**Concrete example:**
Student: [Python, Excel, SQL]
Industry from jobs: [Python, SQL, Tableau, Statistical Analysis, Power BI]

Results:
- Python → Matched (exact)
- SQL → Matched (exact)
- Tableau → Gap (not similar to any student skill)
- Statistical Analysis → Partial (similarity to 'Excel'? maybe 0.65, below threshold → actually Gap in this case)
- Power BI → Gap

Match Score = 2 Matched / 5 Total = 40%
Top gaps by frequency: Tableau (appears in 4 jobs) → Power BI → Statistical Analysis"

---

### Q4.1.1 (Follow-up): Why only count "Matched" in match score, not "Partial"?

**What They're Testing:** Design rationale, avoiding overestimation

**Sample Answer:**
"Good catch. We could include Partial, but that would overstate readiness.

**Example:**
Student has 'Excel', industry wants 'Statistical Analysis'. Excel + stats knowledge ≠ same skill.
If we'd said 40% instead of 40%, we'd overestimate alignment.

**Philosophy:**
- Matched = definitely ready
- Partial = need targeted upskilling (not just 'related')
- Gap = must learn from scratch

This keeps advice honest: 'You know Excel but need proper statistical training.' Pushing them toward resources, not false confidence.

**Could be tuned:** Maybe future version weights Partial at 0.5x? But for MVP, conservative (Matched-only) is better."

---

## ROUND 5: TESTING & QUALITY

### Q5.1: Tell us about your testing strategy. What do you test and why?

**Expected Answer Structure:**
1. Test types (unit, integration)
2. Test pyramid (how many of each)
3. Key test cases
4. Fixture usage

**Sample Answer:**
"Testing is critical because NLP is probabilistic and scraping is fragile.

**Test Suite (50+ cases):**
- **test_scraper.py**: Mock scraper with fixtures, test fallback to mock data, dedup logic
- **test_nlp.py**: Skill extraction accuracy, normalization, similarity matching
- **test_analysis.py**: Gap classification (Matched/Partial/Gap), match score calculation
- **test_recommender.py**: Resource lookup, handling missing skills

**Key test fixture:** 5 sample jobs (deterministic, reproducible)

**Example test:**
```
def test_skill_extraction():
    jobs = load_fixture('sample_jobs.json')  # 5 jobs
    skills = aggregate_skills(jobs)
    assert 'Python' in skills
    assert skills['Python']['frequency'] ≥ 3  # appears in ≥3 jobs
```

**Run:** pytest tests/ -v → should all pass

**Coverage:** ~80% of core logic. Gaps: UI rendering (hard to test), external APIs (mocked)."

---

### Q5.1.1 (Follow-up): What happens if a test fails? How do you debug?

**What They're Testing:** Debugging discipline, understanding of test failure modes

**Sample Answer:**
"Test failure = something broke. Debugging process:

1. **Read error message** - pinpoints which assertion failed
2. **Run single test** - pytest tests/test_nlp.py::test_skill_extraction -v
3. **Add print statements** - log intermediate values
4. **Check fixture data** - confirm sample_jobs.json hasn't changed
5. **Inspect code change** - diff against last working version
6. **Isolate** - is it NLP, config, or data?

**Example:** Similarity test fails with 'AssertionError: 0.6 < 0.7'
- Could be: word vector model not loaded, threshold changed, or spaCy version update
- Solution: Confirm en_core_web_md downloaded, check settings.py, check spaCy version

**Lesson:** Good tests catch regressions immediately, so you catch subtle bugs early."

---

## ROUND 6: ARCHITECTURE CHOICES & TRADE-OFFS

### Q6.1: Why did you use Streamlit instead of Flask or Django?

**Expected Answer:** Understand when to use what tool

**Sample Answer:**
"Streamlit vs alternatives:

| Aspect | Streamlit | Flask | Django |
|--------|-----------|-------|--------|
| Dev Speed | Fast (no boilerplate) | Medium | Slow (batteries-included) |
| Charts | Built-in Plotly | Manual | Manual |
| State | Auto-rerun model | Manual session | ORM + middleware |
| Deployment | Streamlit Cloud | Any server | Any server |
| Flexibility | Limited (data-app focused) | High | High (but complex) |

**For this project:** Streamlit wins because:
- Focus is dashboard (charts, metrics)
- Single-user flow (submit → report)
- Visualization critical (skill tags, match score)
- Rapid iteration (no need for REST API yet)

**Trade-offs:**
- Can't do multi-page flows easily (Streamlit reruns entire script)
- Not ideal for complex UX (forms get hacky)

**If project needed:** API + mobile app → would use Flask + React instead"

---

### Q6.1.1 (Follow-up): How would you scale this to handle 1000s of concurrent users?

**What They're Testing:** Scalability thinking

**Sample Answer:**
"Current: Single-user Streamlit app (in-memory state).

**Scaling to 1000s:**

1. **Separation of concerns:**
   - Streamlit (frontend) → calls API
   - FastAPI backend (scraper, NLP, analysis, recommender)
   - PostgreSQL (cache extracted skills, store reports)

2. **Caching:**
   - Job postings cached (skills same for 'Data Analyst' role)
   - Skill extraction cached by job ID
   - User reports stored, fetched quickly

3. **Async processing:**
   - Scraping in background (Celery queue)
   - Return job ID, user polls for completion
   - Not blocking UI

4. **Database:**
   - Replace JSON with PostgreSQL
   - Index by role, company (fast lookups)
   - Archive old jobs (not everything needed live)

5. **Microservices (if needed):**
   - Scraper service (scale independently)
   - NLP service (GPU if using BERT)
   - Recommendation service

6. **CDN/Caching:**
   - Cache resources_db.json (changes infrequently)
   - Cache resource links (avoid scraping recommendation sites)

**First step:** Just make a REST API, add database. That gets you to 100s of users. After that, think about workers/queues."

---

## ROUND 7: DEEP DIVES & EDGE CASES

### Q7.1: What happens if a student enters an invalid role?

**Expected Answer:** Error handling, UX, fallback strategy

**Sample Answer:**
"**Current behavior:**
1. UI (input_form.py) has dropdown of SUPPORTED_ROLES
2. If somehow invalid role submitted → fetch_jobs() validates
3. Raises ValueError('Role not found. Valid roles: ...')
4. app.py catches, shows error message: 'Invalid role. Please select from: Data Analyst, ML Engineer, ...'
5. User tries again

**Could improve:**
- Fuzzy matching: 'Data Science' → suggests 'Data Analyst'
- Free-text input → NLP-based role detector
- Search role database (not hardcoded list)

**Trade-off:** Dropdown + hardcoded list is simple, user-friendly for KnownRoles. Free text is more flexible but adds complexity."

---

### Q7.1.1 (Follow-up): What if scraping fails completely?

**What They're Testing:** Resilience design, priorities

**Sample Answer:**
"**Failure scenario:** All scrapers (LinkedIn, Naukri, Adzuna) fail due to network, blocks, or bugs.

**Current handling (job_scraper.py):**
```python
try:
    jobs = fetch_jobs(role)  # tries all scrapers
except AllScrapersFailedError:
    jobs = load_mock_jobs(role)  # fallback to mock
    log.warning(f'All scrapers failed. Using mock data.')
```

**Result:** User gets report with mock data
- Not ideal (data 1 week old), but functional
- User sees note: 'Using sample data (live scraping unavailable)'
- Resources still recommended based on mock skills

**Alternative:** Could queue scraping for later, return cached results from yesterday. But MVP just uses mock.

**Lesson:** Design assumes failures happen, plan fallbacks rather than crash."

---

### Q7.2: How do you handle duplicate job postings?

**Expected Answer:** Data quality, deduplication strategy

**Sample Answer:**
"**Problem:** LinkedIn, Naukri, Adzuna might post same job.

**Solution:** Deduplication by (title, company) tuple
```python
jobs = fetch_jobs(role)  # merged from 3 scrapers
# Now 45 jobs, potentially 15 duplicates
unique_jobs = {}
for job in jobs:
    key = (job.title.lower(), job.company.lower())  # case-insensitive
    if key not in unique_jobs:
        unique_jobs[key] = job
return list(unique_jobs.values())  # 30 unique jobs
```

**Why (title, company) tuple?**
- Title alone duplicated (many 'Data Analyst' postings)
- Company alone duplicated (company posts multiple roles)
- (Title, Company) = unique posting (same job from two platforms ≈ same posting)

**Trade-off:** Perfect dedup would be hard (parse description for content match). (Title, Company) is 95% effective, simple."

---

## ROUND 8: FUTURE & IMPACT

### Q8.1: What would you build next if you had more time?

**Expected Answer:** Roadmap thinking, prioritization

**Sample Answer:**
"**Phase 2 (1-2 months):**
1. Multi-role comparison: Compare skill gaps for 3-5 target roles side-by-side
2. Learning path sequencing: Order resources by difficulty/prerequisites
3. Time estimates: 'Master Python: 4 weeks', 'Learn Tableau: 2 weeks'
4. User accounts: Save profiles, track progress over months

**Phase 3 (2-3 months):**
1. Fine-tuned NLP model: Train on 10k job descriptions, better accuracy
2. OpenAI integration: Use GPT-4 as fallback for skill extraction
3. Recommendation ML model: Personalize resource suggestions per learning style
4. Mobile app: React Native / Flutter for on-the-go access

**Phase 4 (Production):**
1. API (FastAPI): Expose gap analysis as service
2. Database (PostgreSQL): Replace JSON, support user accounts
3. Docker/cloud: Deploy on AWS/GCP, scale to 100k users
4. Analytics: Track what skills students actually learn
5. Feedback loop: Students rate recommendations, improve model

**Priority:** Multi-role comparison first (highest request from early users)."

---

### Q8.1.1 (Follow-up): How would you measure success?

**What They're Testing:** Product thinking, metrics mindset

**Sample Answer:**
"**Success metrics (what matters):**

| Metric | Target | Why |
|--------|--------|-----|
| Daily Active Users | 1000 | Adoption |
| Report accuracy (user feedback) | 90%+ | Quality |
| Resource completion rate | 40%+ | Impact (students actually use recommendations) |
| Time-to-skill-improvement | 8 weeks | Real-world outcome |
| NPS (Net Promoter Score) | 60+ | Satisfaction |

**Secondary metrics:**
- Scraper success rate: 95%+ without fallback
- NLP accuracy: 85%+ (student survey validation)
- App uptime: 99.5% (reliability)

**How measure:**
- User feedback form: 'Did this recommendation help?'
- Surveys: 'Did you complete the recommended course?'
- Wait 6 months, interview successful students
- Track which resources are most clicked (popularity signal)

**Not metric:** 'Most accurate NLP model' (doesn't mean students benefit)"

---

## ROUND 9: CODE WALKTHROUGH

### Q9.1: Show us the core gap analysis function. How does it work?

**Expected Answer:** Walk through actual code logic

**Sample Answer:**
"Here's the core logic (analysis/gap_analyzer.py):

```python
def analyze(student_profile: StudentProfile, jobs: List[JobPosting]):
    # 1. Aggregate skills from all jobs
    industry_skills = aggregate_skills(jobs)  # Dict[skill → frequency]
    
    # 2. Normalize student skills
    student_skills = normalize_skills(student_profile.skills)
    
    matched = []
    partial = []
    gaps = []
    
    # 3. For each industry skill, classify
    for skill, freq in industry_skills.items():
        result = classify_skill(skill, student_skills)
        result.industry_frequency = freq
        
        if result.classification == 'matched':
            matched.append(result)
        elif result.classification == 'partial':
            partial.append(result)
        else:  # gap
            gaps.append(result)
    
    # 4. Calculate match score
    total = len(matched) + len(partial) + len(gaps)
    match_score = (len(matched) / total) * 100
    
    # 5. Build report
    return GapReport(
        student_name=student_profile.name,
        match_score=match_score,
        matched=matched,
        partial=partial,
        gaps=gaps,
        total_jobs_analyzed=len(jobs)
    )
```

**Key insight:** Classification happens per-industry-skill using classify_skill() function."

---

## SCORING YOUR ANSWERS

### Strong Answer Traits ✅
- Explains the "why" not just "what"
- Uses concrete examples
- Acknowledges trade-offs
- Shows knowledge of your own code
- Relates to real-world impact
- Handles follow-ups smoothly

### Weak Answer Traits ❌
- Vague or hand-wavy ("I used ML to...")  
- No examples ("...some data processing...")
- Defensive ("I didn't think about that")
- Can't explain own code
- Ignores trade-offs ("best approach is...")

---

## Final Tips for Success

1. **Pause before answering**: 2-3 seconds of thinking is OK
2. **Structure responses**: Problem → Approach → Solution → Trade-offs
3. **Use whiteboard**: Sketch pipeline, decision trees, data flow
4. **Admit unknowns**: "I didn't consider that, but here's how I'd approach it"
5. **Show enthusiasm**: This is your project; you should know and like it
6. **Give examples**: "For instance, when analyzing Data Analyst jobs..."
7. **Be prepared to debug live**: "Let me run the test suite and show you..."
8. **Know your limitations**: "We handle 20 jobs; beyond that would need different approach"

---

**Good luck!** Remember: viva panels want to see:
- ✅ Clear thinking (not just code)
- ✅ Engineering discipline (tests, docs, modularity)  
- ✅ Problem solving (trade-offs, fallbacks)
- ✅ Communication (explain complex ideas simply)

Your project has all of these. Relax and let it show. 🎯
