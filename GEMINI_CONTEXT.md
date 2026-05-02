# Project Context: CareerCompass AI Migration

## Current Phase: Phase 3/4 (Full-Stack Transformation)
Integrating Resume Parsing (Backend Complete) with the Next.js Dashboard and initiating Phase 5 (Roadmaps).

## Recent Activity
- **Backend**: `/profile/resume` endpoint created for PDF skill extraction.
- **Frontend**: Next.js scaffold created with Dashboard routes.
- **Cleanup**: Redundant `.md` files removed from `documentation/` and root (if duplicated).

## Immediate Task List
1. [ ] Create progress tracking file (`GEMINI_CONTEXT.md`).
2. [ ] Remove redundant documentation files.
3. [ ] Verify Frontend Dashboard's resume upload functionality.
4. [ ] Connect Frontend to Backend `/profile/resume` endpoint.
5. [ ] Initialize Roadmap service (Phase 5).

## Notes
- Using FastAPI (Backend) and Next.js (Frontend).
- PostgreSQL/SQLModel for persistence.
- Celery/Redis for background tasks.
