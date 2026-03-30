# Repository Guidelines

## Project Structure & Module Organization
This repo is a Python + Streamlit “Skill Gap Analyzer.” The intended layout is documented in `ARCHITECTURE.md` and includes:
- `app.py` as the Streamlit entry point.
- Core packages: `scraper/`, `nlp/`, `analysis/`, `recommender/`, `ui/`.
- Configuration in `config/settings.py` with env toggles in `.env.example`.
- Data files in `data/` (e.g., `mock_jobs.json`, `skill_aliases.json`, `resources_db.json`).
- Tests in `tests/` with fixtures under `tests/fixtures/`.
- Logs in `logs/app.log` (gitignored).

## Build, Test, and Development Commands
- `pip install -r requirements.txt` installs dependencies.
- `python -m spacy download en_core_web_md` installs the required spaCy model.
- `streamlit run app.py` starts the app locally.
- `pytest tests/ -v` runs the full test suite (uses fixtures, no live scraping).

## Coding Style & Naming Conventions
- Python 3, 4-space indentation, PEP 8 conventions.
- Use `snake_case` for functions/variables, `PascalCase` for classes, `UPPER_SNAKE_CASE` for constants.
- Prefer explicit types for public APIs (see module specs in `MODULES.md`).
- Logging is required for scraping and analysis flows; write logs to `logs/app.log`.
- No formatter/linter is specified yet; keep diffs clean and consistent.

## Testing Guidelines
- Framework: `pytest`.
- Tests live in `tests/`, and all tests rely on `tests/fixtures/sample_jobs.json`.
- Naming: `tests/test_*.py`, test functions `test_*`.
- Avoid live network calls; use mock data and fixtures.

## Commit & Pull Request Guidelines
- Git history is empty, so no established commit message convention yet.
- Recommended: short, imperative subjects (e.g., “Add skill normalizer”), one logical change per commit.
- PRs should include a concise summary, testing notes (commands run), and any UI screenshots if Streamlit views change.

## Configuration & Safety Tips
- Toggle `USE_MOCK_DATA` and `ENABLE_BERT` in `.env` or `config/settings.py`.
- Do not add secrets or credentials to the repo; keep `.env` local.
