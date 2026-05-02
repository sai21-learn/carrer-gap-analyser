# VIVA WHITEBOARD DIAGRAMS GUIDE

Print this page and practice drawing these diagrams on a whiteboard during viva.

---

## DIAGRAM 1: 5-Stage Pipeline (Most Important!)

```
┌──────────────┐
│ Student Form │
│ (name, role, │
│  skills)     │
└──────┬───────┘
       │
       ▼
┌──────────────────────┐
│ 1️⃣ STREAMING UI      │
│   - Input form       │
│   - Parameters:      │
│     • name: str      │
│     • role: str      │
│     • skills: List   │
└──────┬───────────────┘
       │
       ▼
┌──────────────────────┐
│ 2️⃣ JOB SCRAPER      │
│   - LinkedIn         │
│   - Naukri           │
│   - Adzuna API       │
│   Output:            │
│   List[JobPosting]   │
└──────┬───────────────┘
       │
       ▼
┌──────────────────────┐
│ 3️⃣ NLP ENGINE       │
│   - Extract skills   │
│   - Normalize        │
│   - Word vectors     │
│   Output:            │
│   Dict[skill→freq]   │
└──────┬───────────────┘
       │
       ▼
┌──────────────────────┐
│ 4️⃣ GAP ANALYZER    │
│   - Classify each    │
│     skill            │
│   - Matched/Partial/ │
│     Gap              │
│   Output:            │
│   GapReport          │
└──────┬───────────────┘
       │
       ▼
┌──────────────────────┐
│ 5️⃣ RECOMMENDER     │
│   - Map gaps to      │
│     resources        │
│   Output:            │
│   List[Resource]     │
└──────┬───────────────┘
       │
       ▼
┌──────────────────────┐
│ 📊 DASHBOARD        │
│   - Match score      │
│   - Skill cards      │
│   - Resources list   │
│   - Charts           │
└──────────────────────┘
```

**Talking Point:** "The app is a 5-stage pipeline. Each stage is independent—if scraper fails, we use mock data. If NLP has an error, we skip normalization but continue. This resilience design ensures the app never crashes."

---

## DIAGRAM 2: Gap Classification Decision Tree

```
                 ┌─────────────────────────┐
                 │   Industry Skill:       │
                 │   "SQL"                 │
                 └────────────┬────────────┘
                              │
                              ▼
              ┌───────────────────────────────────┐
              │ Is "SQL" in student_skills list? │
              └────┬──────────────────────┬───────┘
                   │                      │
                YES│                      │NO
                   │                      │
                   ▼                      ▼
           ┌──────────────┐       ┌──────────────────────┐
           │ MATCHED ✓    │       │ For each student     │
           │              │       │ skill, check         │
           │ Similarity = │       │ similarity to "SQL"  │
           │ 1.0 (exact)  │       └──────┬───────────────┘
           └──────────────┘              │
                                         ▼
                        ┌────────────────────────────────┐
                        │ "MySQL" similarity = 0.85      │
                        │ Is 0.85 ≥ 0.7 threshold?      │
                        └───────┬──────────────┬─────────┘
                                │              │
                              YES│              │NO
                                │              │
                                ▼              ▼
                          ┌──────────────┐  ┌──────────────┐
                          │ PARTIAL ⚠    │  │ GAP ✗        │
                          │              │  │              │
                          │ matched_to = │  │ No match     │
                          │ "MySQL"      │  │ found        │
                          └──────────────┘  └──────────────┘
```

**Talking Point:** "Classification is a 3-way decision tree. First we check exact match. If not, we check semantic similarity using spaCy word vectors. Threshold of 0.7 was empirically tuned on our 5 test jobs."

---

## DIAGRAM 3: Skill Extraction Pipeline

```
Job Description Text
"Looking for Data Analyst with Python, SQL, Pandas, 
 NumPy, Tableau, and Excel skills. Machine learning 
 knowledge is a plus."
        │
        ▼
┌──────────────────────┐
│ TOKENIZATION         │
│ (spaCy tokenizer)    │
└──────────────────────┘
        │
        ▼
┌──────────────────────┐
│ NER (Named Entity    │
│ Recognition)         │
│ Find: TECHNOLOGY,    │
│ SKILL entities       │
└──────────────────────┘
        │
     [Python, SQL, Pandas, NumPy, Tableau, Excel, 
      Machine Learning, knowledge, etc.]
        │
        ▼
┌──────────────────────┐
│ RULE-BASED PATTERNS  │
│ Regex: \b[A-Z]+\+\b  │
│ Keyword: 'Python',   │
│ 'Java', etc.         │
└──────────────────────┘
        │
     [Python, SQL, Pandas, NumPy, Tableau, Excel, 
      Machine Learning]
        │
        ▼
┌──────────────────────┐
│ NORMALIZATION        │
│ (skill_aliases.json) │
│ "ML" → "Machine      │
│  Learning"           │
└──────────────────────┘
        │
        ▼
┌──────────────────────┐
│ DEDUPLICATION &      │
│ LOWERCASE            │
│                      │
└──────────────────────┘
        │
        ▼
   Final Skills:
[python, sql, pandas, numpy, tableau, excel, 
 machine learning]
```

**Talking Point:** "Skill extraction is a hybrid approach. spaCy handles most cases, but we add rule-based patterns for edge cases (like 'C++' or 'AWS'). Normalization handles synonyms. The whole pipeline is ~90% accurate on our test data."

---

## DIAGRAM 4: Data Models & Flow

```
┌────────────────────────────────┐
│   StudentProfile               │
├────────────────────────────────┤
│ name: "Rajesh"                 │
│ target_role: "Data Analyst"    │
│ skills: [Python, Excel, SQL]   │
│ submitted_at: 2024-04-28       │
└────────────┬───────────────────┘
             │
             ▼
┌────────────────────────────────┐
│   JobPosting (repeated)        │
├────────────────────────────────┤
│ title: "Data Analyst"          │
│ company: "TechCorp"            │
│ location: "Bangalore"          │
│ description: "...Python...SQL.."│
│ platform: "linkedin"           │
│ scraped_at: 2024-04-28         │
└────────────┬───────────────────┘
             │
             ▼
┌────────────────────────────────┐
│   SkillResult (repeated)       │
├────────────────────────────────┤
│ skill: "Python"                │
│ classification: "matched"      │
│ similarity_score: 1.0          │
│ industry_frequency: 18         │
│ matched_to: null               │
└────────────┬───────────────────┘
             │
             ▼
┌────────────────────────────────┐
│   GapReport                    │
├────────────────────────────────┤
│ student_name: "Rajesh"         │
│ target_role: "Data Analyst"    │
│ match_score: 68.5%             │
│ matched: [Python, SQL]         │
│ partial: [Excel → Tableau]     │
│ gaps: [Tableau, Power BI, ...]  │
│ total_jobs_analyzed: 20        │
└────────────────────────────────┘
```

**Talking Point:** "Data flows through typed dataclasses. Each stage transforms data and passes to next. StudentProfile → JobPostings → SkillResults → GapReport. This creates clear contracts between modules."

---

## DIAGRAM 5: Module Dependencies

```
                    ┌─────────────┐
                    │  app.py     │
                    │(Orchestrator)
                    └──────┬──────┘
                           │
        ┌──────────────────┼──────────────────┐
        │                  │                  │
        ▼                  ▼                  ▼
    ┌────────┐      ┌─────────────┐   ┌──────────┐
    │   UI   │      │  Scraper    │   │ Analysis │
    │  (UI)  │      │ (scraper/)  │   │(analysis)│
    └────────┘      └──────┬──────┘   └────┬─────┘
        │                  │               │
        │         ┌────────┼──────┐        │
        │         │        │      │        │
        │         ▼        ▼      ▼        │
        │    ┌────────┬────────┬────────┐  │
        │    │LinkedIn│ Naukri │Adzuna  │  │
        │    │scraper │scraper │scraper │  │
        │    └────────┴────────┴────────┘  │
        │                                   │
        │                ┌──────────────────┤
        │                │                  │
        ├────────────────┤                  │
        │                │                  │
        ▼                ▼                  ▼
    ┌──────────┐   ┌──────────┐   ┌──────────────┐
    │   NLP    │   │Recomm-   │   │Data Models   │
    │ (nlp/)   │   │ender     │   │(models.py)   │
    │          │   │(recomm-  │   │              │
    │ Extract  │   │ender/)   │   │              │
    │Normalize │   │          │   │              │
    │Similaity │   │Lookup    │   │              │
    │          │   │resources │   │              │
    └──────────┘   └──────────┘   └──────────────┘

Key insight: app.py is hub. Each service (scraper, NLP, etc.)
independent. Can be tested separately.
```

**Talking Point:** "Modular architecture. Each component can be swapped. If we want to use BERT instead of spaCy, we change just NLP module. If we add a new scraper, we don't touch anything else."

---

## DIAGRAM 6: Match Score Calculation

```
Industry Skills (from all jobs):
[Python:18, SQL:15, Tableau:12, Power BI:10, 
 Statistical Analysis:8, Excel:7, Pandas:6]

Total = 7 skills

Student Skills: [Python, SQL, Excel]

Classification Results:
┌─────────────────┬────────────────────────┐
│     Skill       │   Classification       │
├─────────────────┼────────────────────────┤
│ Python          │ MATCHED (exact)        │
│ SQL             │ MATCHED (exact)        │
│ Tableau         │ GAP (no match)         │
│ Power BI        │ GAP (similarity=0.5)   │
│ Statistical...  │ PARTIAL (Excel match)  │
│ Excel           │ MATCHED (exact)        │
│ Pandas          │ GAP (no match)         │
└─────────────────┴────────────────────────┘

Match Score Calculation:
─────────────────────────────────
Matched Skills Count = 3 (Python, SQL, Excel)
Total Industry Skills = 7
Total Partial = 1 (but NOT counted)
Total Gap = 3 (but NOT counted)

Match Score = (Matched / Total) × 100%
            = (3 / 7) × 100%
            = 42.9%

Interpretation:
"You have 42.9% of the skills the market wants 
for Data Analyst. Focus on: Tableau, Power BI, 
Statistical Analysis."
```

**Talking Point:** "Match score is deliberately conservative—only Matched skills counted. This avoids false confidence. If we counted Partial, we'd overstate readiness."

---

## DIAGRAM 7: Fallback Strategy (Resilience Design)

```
┌────────────────────────┐
│ fetch_jobs(role)       │
└────────────┬───────────┘
             │
      ┌──────▼──────┐
      │ Try Scraper │
      └──────┬──────┘
             │
   ┌─────────┴──────────┐
   │                    │
  Success             Failure
(20+ jobs)           (<3 jobs)
   │                    │
   ▼                    ▼
Return          ┌──────────────┐
Jobs            │Log: WARNING  │
                │Use MOCK data │
                │as supplement │
                └──────────────┘
                        │
                        ▼
                  Return 20 jobs
                (real + mock)

Key Point: App NEVER crashes.
If all scrapers fail → use pure mock data.
If scrapers get < 3 jobs → supplement with mock.
Always shows: "Using sample data (live unavailable)"
```

**Talking Point:** "Resilience by design. Each scraper can fail independently. If all fail, we gracefully fall back to mock data. User still gets recommendations, just not from latest jobs. This is practical—better to help with old data than crash."

---

## DIAGRAM 8: Similarity Matching Logic

```
Student Skill: "Machine Learning"
Industry Skill: "ML"

┌──────────────────────────────────┐
│ Compute Similarity Score         │
│ Using spaCy Word Vectors         │
│                                  │
│ vector("ML") • vector("Machine   │
│ Learning") / (|vector1| |vector2│
│                                  │
│ Cosine Similarity = 0.92         │
└──────────┬───────────────────────┘
           │
           ▼
┌──────────────────────────────────┐
│ Compare to Threshold (0.7)       │
│                                  │
│ Is 0.92 ≥ 0.7?                  │
│ YES → PARTIAL MATCH              │
│                                  │
│ Would be:                         │
│ 0.92 < 0.7? NO                  │
└──────────────────────────────────┘

┌─────────────────────────────────────────┐
│ Similarity Score Spectrum                │
├─────────────────────────────────────────┤
│ 1.0     Exact Match (e.g., Python-Pyhton)
│ 0.85    Very Similar (e.g., ML-Machine Learning)
│ 0.7     Threshold (configurable)
│ 0.5     Somewhat Similar (e.g., Git-GitHub)
│ 0.2     Weak (e.g., Python-JavaScript)
│ 0.0     No Relation
└─────────────────────────────────────────┘
```

**Talking Point:** "Similarity threshold of 0.7 is the sweet spot. Below 0.7, too many false positives. Above 0.7, we miss valid synonyms. Configurable in settings.py for different use cases."

---

## DIAGRAM 9: User Journey Through App

```
┌─────────────────────────────────────────────────────────┐
│ START: Student visits app.py                            │
└────────────────────┬────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────┐
│ SCREEN 1: Input Form (ui/input_form.py)               │
│ ┌──────────────────────────────────────────────────┐   │
│ │ Enter Name: [____________]                       │   │
│ │ Select Role: [Data Analyst ▼]                   │   │
│ │ Enter Skills (comma-sep): [________, ________]  │   │
│ │ [Submit Button]                                  │   │
│ └──────────────────────────────────────────────────┘   │
└────────────────────┬────────────────────────────────────┘
                     │
         (user fills & clicks Submit)
                     │
         ┌───────────▼───────────┐
         │ Processing...         │
         │ 1. Scraping jobs      │
         │ 2. Extracting skills  │
         │ 3. Analyzing gaps     │
         │ 4. Recommending...    │
         └───────────┬───────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────┐
│ SCREEN 2: Gap Report (ui/report_view.py)              │
│ ┌──────────────────────────────────────────────────┐   │
│ │ Student: Rajesh | Role: Data Analyst             │   │
│ │                                                   │   │
│ │ Overall Match: 68.5% ████████░░░░░               │   │
│ │                                                   │   │
│ │ MATCHED (3) | PARTIAL (1) | GAPS (8)             │   │
│ │ [Python]    | [Excel→BI]  | [Tableau]           │   │
│ │ [SQL]       |             | [Power BI]          │   │
│ │ [Pandas]    |             | [Stat Analysis]... │   │
│ │                                                   │   │
│ │ TOP RESOURCES:                                   │   │
│ │ • Tableau Desktop for Data Analysis [Udemy] ⭐⭐⭐│   │
│ │ • Power BI Fundamentals [Coursera]    ⭐⭐⭐⭐   │   │
│ │ • Statistical Analysis with Python [LinkedIn]  │   │
│ └──────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────┘
```

**Talking Point:** "User journey is simple: fill form → wait 5-10 seconds → see report with actionable gaps and resources. Dark-mode dashboard makes insights clear."

---

## DIAGRAM 10: Configuration & Toggles

```
config/settings.py
┌────────────────────────────────────────────┐
│ Feature Toggles (Can Change Behavior)     │
├────────────────────────────────────────────┤
│ USE_MOCK_DATA = True                       │
│   └─ Offline mode? Or live scraping?      │
│                                            │
│ ENABLE_BERT = False                        │
│   └─ Speed (spaCy) or accuracy (BERT)?   │
│                                            │
│ MAX_JOBS_PER_PLATFORM = 20                │
│   └─ More jobs = slower, more accurate   │
│                                            │
│ SIMILARITY_THRESHOLD = 0.7                │
│   └─ More strict/lenient?                │
│                                            │
│ SUPPORTED_ROLES = [                        │
│   "Data Analyst",                          │
│   "ML Engineer",                           │
│   "Software Engineer",                     │
│   ...                                      │
│ ]                                          │
└────────────────────────────────────────────┘

Environment Variables (.env):
┌────────────────────────────────────────────┐
│ ADZUNA_APP_ID = xxx                        │
│ ADZUNA_APP_KEY = yyy                       │
│ ADZUNA_COUNTRY = "in"                      │
│                                            │
│ (Optional: only needed for live Adzuna)   │
└────────────────────────────────────────────┘
```

**Talking Point:** "All config in one place. Can toggle between offline/online mode, accuracy/speed trade-offs, etc. No need to change code."

---

## Practice: Draw These Quickly

Time yourself:
- **Pipeline**: 1 minute
- **Classification Tree**: 1.5 minutes
- **Data Models**: 1 minute
- **Fallback Strategy**: 1 minute
- **Similarity Logic**: 1 minute

Total: ~5-6 minutes for core diagrams. Enough for a live viva.

---

## Tips for Using Diagrams in Viva

1. **Start with Pipeline** - Sets context for entire discussion
2. **Draw as you explain** - Don't prepare finished diagram, draw live
3. **Label clearly** - Use exact names from code (app.py, job_scraper.py, etc.)
4. **Erase & redraw** - If you made mistake, no biggie. Shows thinking
5. **Ask to use whiteboard** - "Can I sketch the architecture?" builds rapport
6. **Point while explaining** - "Stage 2 here calls LinkedIn scraper here"
7. **Keep it simple** - Don't over-detail. Boxes and arrows enough

---

**Good luck! You've got this.** 🎯
