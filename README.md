# CareerCompass AI

## Overview
CareerCompass AI is a full-stack platform that helps users identify, track, and close skill gaps for their target roles. It transforms a synchronous prototype into an asynchronous, persistent, and intelligent system.

## Project Structure
- `backend/` — FastAPI application, Celery workers, and all core Python logic.
- `frontend/` — Next.js application and dashboard components.
- `docs/` — All project documentation, including architecture and design specifications.
- `scripts/` — Utility scripts for data synchronization and other tasks.
- `tests/` — Automated tests for the backend and core logic.

## Setup & Development

### Backend
```bash
cd backend
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
# Start FastAPI
uvicorn app.main:app --reload
# Start Celery Worker
celery -A app.celery_worker worker --loglevel=info
```

### Frontend
```bash
cd frontend
npm install
npm run dev
```

### Infrastructure
- **Redis**: Required for Celery (running on `localhost:6379`).
- **PostgreSQL**: Required for data persistence.

## Testing
```bash
pytest tests/
```

## License
MIT
