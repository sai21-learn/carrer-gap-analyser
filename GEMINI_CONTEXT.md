# Project Context: CareerCompass AI Migration

## Current Phase: Phase 3/4 (Full-Stack Transformation)
Integrating Resume Parsing (Backend Complete) with the Next.js Dashboard and initiating Phase 5 (Roadmaps).

## Recent Activity
- **Backend**: `/profile/resume` endpoint created for PDF skill extraction.
- **Frontend**: Next.js scaffold created with Dashboard routes.
- **Cleanup**: Redundant `.md` files removed from `documentation/` and root (if duplicated).

## Immediate Task List
1. [x] Create progress tracking file (`GEMINI_CONTEXT.md`).
2. [x] Remove redundant documentation files.
3. [x] Implement API proxy route in Frontend.
4. [x] Connect Frontend Dashboard to Backend `/profile/` to display extracted skills.
5. [x] Initialize Roadmap service (Phase 5).
6. [x] Implement Roadmap sync script and backend mapping service.
7. [x] Implement Roadmap visualization on Frontend using `react-flow`.
8. [ ] Add skill normalization logic to Frontend before sending to Backend.
9. [ ] Implement deep intelligence mapping (matching specific Roadmap nodes to exact learning resources).

## Notes
- Using FastAPI (Backend) and Next.js (Frontend).
- PostgreSQL/SQLModel for persistence.
- Celery/Redis for background tasks.
