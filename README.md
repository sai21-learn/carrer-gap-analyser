# AI Skill Gap Analyzer

## Overview
AI Skill Gap Analyzer is a Python + Streamlit application that compares a student’s skills to real job market demand and generates a skill gap report with curated learning resources. It supports mock data for offline development and optional live scraping for LinkedIn and Naukri.

## Key Features
- Skill extraction with spaCy phrase matching and normalization
- Semantic similarity matching (spaCy vectors; optional BERT)
- Gap analysis with ranked missing skills
- Resource recommendations per gap
- Streamlit dashboard with metrics and charts

## Project Structure
- `app.py` — Streamlit entry point
- `config/` — configuration and feature toggles
- `scraper/` — job scraping modules
- `nlp/` — skill extraction and similarity matching
- `analysis/` — gap analysis logic
- `recommender/` — resource lookup
- `ui/` — Streamlit views and charts
- `data/` — mock jobs, skill aliases, resource database
- `tests/` — pytest suite and fixtures

## Requirements
- Python 3.11+ recommended
- Virtual environment (venv)

## Setup
```bash
python -m venv .venv
.venv/bin/pip install -r requirements.txt
.venv/bin/python -m spacy download en_core_web_md
```

## Configuration
Copy `.env.example` to `.env` if you want to manage toggles via environment variables. The main toggles in `config/settings.py` are:
- `USE_MOCK_DATA`: use mock job postings instead of live scraping
- `ENABLE_BERT`: enable BERT-based similarity (slower, more accurate)

## Run Locally
```bash
streamlit run app.py
```

## Testing
```bash
PYTHONPATH=. .venv/bin/pytest tests/ -v
```

## Notes
- Tests do not use live scraping; they rely on fixtures in `tests/fixtures/`.
- Logs are written to `logs/app.log`.

## License
Add your license information here.
