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
