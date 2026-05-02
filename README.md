<<<<<<< HEAD
# CareerCompass AI (Phase 3: Data Ingestion)

## Overview
This branch adds automated data ingestion capabilities to CareerCompass AI, specifically focusing on Resume Parsing.

## Key Accomplishments
- **PDF Extraction**: Integrated `PyMuPDF` to extract text from user-uploaded resumes.
- **NLP Processing**: Linked extracted text to our spaCy-based skill extraction engine.
- **Persistence**: Extracted skills are now automatically saved to the user's persistent profile in PostgreSQL.
- **Upload UI**: Added a user-friendly drag-and-drop resume upload component to the dashboard.

## Setup
Refer to individual `backend/` and `frontend/` directories for setup instructions.
=======
# CareerCompass AI

## Overview
CareerCompass AI is a full-stack platform that helps users identify, track, and close skill gaps for their target roles. It transforms a synchronous prototype into an asynchronous, persistent, and intelligent system.

## 🚀 Transformation Phases

### ✅ Phase 1: Backend Foundation & Authentication
- **FastAPI Server**: Scalable and asynchronous core.
- **PostgreSQL Database**: Persistent storage for users, profiles, and historical analyses.
- **JWT Auth**: Secure login and registration with OAuth2 Password Bearer.

### ✅ Phase 2: Modern Frontend & Dashboard
- **Next.js 14**: Modern React framework with App Router.
- **Tailwind CSS**: Sleek, responsive design.
- **Dashboard UI**: Comprehensive overview of skills, match scores, and progress.

### ✅ Phase 3: Automated Data Ingestion
- **Resume Parsing**: Upload PDF resumes to automatically extract skills.
- **NLP Integration**: Seamlessly connects extraction logic to user profiles.

### ✅ Phase 4: High-Performance Async Engine
- **Redis & Celery**: Heavy scraping and analysis tasks are offloaded to background workers.
- **Real-time Status**: Frontend polling keeps users informed of progress.

### ✅ Phase 5: Intelligence & Roadmaps
- **Roadmap.sh Integration**: Maps skill gaps to industry-standard learning paths.
- **Interactive Visualization**: Zoomable, clickable learning trees powered by `react-flow`.

## Project Structure
- `backend/` — FastAPI application, Celery workers, and database logic.
- `frontend/` — Next.js application and dashboard components.
- `nlp/` — Skill extraction and similarity matching services.
- `scraper/` — Job market data collection modules.
- `scripts/` — Utility scripts for data synchronization.
- `data/` — Local data store for mock jobs and roadmaps.

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
>>>>>>> feat/intelligence-roadmap
