# CareerCompass AI (Phase 1: Backend Foundation)

## Overview
This branch contains the core backend foundation for CareerCompass AI, moving beyond the initial Streamlit prototype to a scalable FastAPI architecture.

## Key Accomplishments
- **FastAPI Server**: Initialized the core API service.
- **Database Schema**: Created PostgreSQL models for Users and Profiles using SQLModel.
- **JWT Authentication**: Implemented secure registration and login using OAuth2 Password Bearer.

## Setup
```bash
cd backend
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
uvicorn app.main:app --reload
```
