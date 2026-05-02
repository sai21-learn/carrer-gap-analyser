# Async Analysis Engine Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ] syntax for tracking.

**Goal:** Integrate Redis and Celery to handle job scraping and NLP analysis in the background, making the UI non-blocking.

**Architecture:** A Celery worker consumes tasks from a Redis broker. FastAPI dispatches tasks and the Next.js frontend polls for results.

**Tech Stack:** Celery, Redis, FastAPI, Next.js.

---

### Task 1: Setup Celery & Redis

**Files:**
- Modify: `backend/requirements.txt`
- Create: `backend/app/celery_worker.py`
- Create: `backend/app/celery_utils.py`

- [ ] **Step 1: Update requirements.txt**
Add `celery` and `redis`.

```text
# Add to existing requirements.txt
celery
redis
```

- [ ] **Step 2: Create Celery App**
In `backend/app/celery_utils.py`, create the Celery app instance.

```python
from celery import Celery

celery_app = Celery(
    "tasks",
    broker="redis://localhost:6379/0",
    backend="redis://localhost:6379/0"
)

celery_app.conf.update(
    task_track_started=True,
)
```

- [ ] **Step 3: Create a simple test task**
In `backend/app/celery_worker.py`, define a basic task to verify the setup.

```python
from .celery_utils import celery_app

@celery_app.task
def add(x, y):
    return x + y
```

- [ ] **Step 4: Commit**

```bash
git checkout -b feat/async-analysis
git add backend/requirements.txt backend/app/celery_worker.py backend/app/celery_utils.py
git commit -m "chore: setup celery and redis for background tasks"
```

---

### Task 2: Port Scraper & NLP to Celery Task

**Files:**
- Modify: `backend/app/celery_worker.py`
- Create: `backend/app/api/analysis.py`

- [ ] **Step 1: Create the main analysis task**
Move the `fetch_jobs` and `aggregate_skills` logic into a Celery task in `celery_worker.py`.

```python
from .celery_utils import celery_app
# Assume these are refactored from the root directory
from scraper.job_scraper import fetch_jobs
from nlp.skill_extractor import aggregate_skills

@celery_app.task(bind=True)
def run_gap_analysis_task(self, target_role: str, user_skills: list):
    # ... (logic to run fetch_jobs, aggregate_skills, and analyze)
    # ... this will be a large function
    return {"status": "Completed"}
```

- [ ] **Step 2: Create API to dispatch the task**
In `backend/app/api/analysis.py`, create an endpoint `/analysis/start` that dispatches the Celery task and returns a `task_id`.

- [ ] **Step 3: Commit**

```bash
git add backend/app/celery_worker.py backend/app/api/analysis.py
git commit -m "feat: move analysis logic into a celery task"
```

---

### Task 3: Task Status API & Frontend Polling

**Files:**
- Modify: `backend/app/api/analysis.py`
- Modify: `frontend/components/dashboard/AnalysisRunner.tsx`

- [ ] **Step 1: Create a task status endpoint**
In `analysis.py`, add a `GET /analysis/status/{task_id}` endpoint that checks the state of the Celery task.

- [ ] **Step 2: Build Frontend Polling Component**
Create `AnalysisRunner.tsx` in the frontend. When a user starts an analysis, this component will:
    1. Call `/analysis/start`.
    2. Poll `/analysis/status/{task_id}` every few seconds.
    3. Display a loading spinner and status updates.
    4. On completion, fetch the full report and display it.

- [ ] **Step 3: Commit**

```bash
git add backend/app/api/analysis.py frontend/components/dashboard/AnalysisRunner.tsx
git commit -m "feat: implement task status endpoint and frontend polling"
```
