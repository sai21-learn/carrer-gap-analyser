# Design Specification: CareerCompass AI (Full-Stack Transformation)

**Date:** 2026-05-02  
**Status:** Draft  
**Topic:** Transitioning AI Skill Gap Analyzer prototype into a full-stack product.

## 1. Overview
CareerCompass AI is a full-stack career development platform that helps users identify, track, and close skill gaps for their target roles. It transforms a synchronous prototype into an asynchronous, persistent, and intelligent system.

## 2. Goals & Objectives
*   **Persistence:** Move from session-only data to long-term user profiles and history.
*   **Performance:** Offload heavy scraping and NLP tasks to background workers.
*   **Intelligence:** Integrate with Roadmap.sh for actionable learning paths.
*   **Modern UI:** Transition from Streamlit to a production-grade React/Next.js frontend.

## 3. System Architecture
The system follows a decoupled Client-Server architecture.

### 3.1 Components
*   **Frontend (Web Console):** Next.js (TypeScript, Tailwind CSS, NextAuth.js).
*   **Backend (Core API):** FastAPI (Python).
*   **Task Queue (Processing):** Celery with Redis as the message broker.
*   **Database:** PostgreSQL (SQLAlchemy/SQLModel).
*   **Data Ingestion:** Resume Parser (PyMuPDF + NLP).
*   **External APIs:** Adzuna (Jobs), Roadmap.sh (Intelligence).

### 3.2 High-Level Diagram (Conceptual)
```
[Next.js Frontend] <--> [FastAPI Backend] <--> [PostgreSQL]
                            |
                            +--> [Redis] <--> [Celery Worker]
                                               |
                                               +--> [Adzuna/Scrapers]
                                               +--> [NLP Processing]
```

## 4. Functional Requirements

### 4.1 User Authentication & Management
*   **Sign Up / Login:** Secure authentication system using **NextAuth.js** on the frontend and **OAuth2 with Password Bearer (JWT)** on the FastAPI backend.
*   **Providers:** Support for Credentials (Email/Password) and Social Login (GitHub/Google).
*   **Security:** 
    *   Passwords hashed using `bcrypt` or `argon2`.
    *   Secure JWT tokens for API authorization.
    *   Protected routes on both Frontend (Middleware) and Backend (Dependency Injection).
*   **User Profiles:** Store name, skills, target roles, and analysis history.
*   **Resume Parsing:** Upload PDF/DOCX; extract skills automatically using the existing NLP module.
*   **Database Schema:**
    *   `users`: ID, email, hashed_password, full_name, created_at.
    *   `profiles`: user_id, bio, current_skills (JSONB), target_role.
    *   `analyses`: user_id, target_role, match_score, gaps (JSONB), timestamp.

### 4.2 Asynchronous Gap Analysis
*   When a user triggers an analysis:
    1.  Backend creates an `analysis` record with status `PENDING`.
    2.  Dispatches a Celery task for scraping and NLP extraction.
    3.  Worker updates the record to `COMPLETED` when finished.
    4.  Frontend polls or receives a notification to display the report.

### 4.3 Intelligence (Roadmap.sh Integration)
*   **Mapping Engine:** Logic to link "Gap Skills" to corresponding Roadmap.sh paths.
*   **Actionable Items:** Each gap skill in the report includes a "Start Learning" button linking to the specific roadmap.

## 5. Non-Functional Requirements
*   **Scalability:** Celery workers can be scaled horizontally.
*   **Reliability:** Implements retries for scraper failures and Adzuna rate limits.
*   **Security:** Hashed passwords; protected API endpoints; sanitized inputs.

## 6. Implementation Strategy
1.  **Phase 1: Backend Foundation.** Set up FastAPI, PostgreSQL, and basic models.
2.  **Phase 2: UI Migration.** Initialize Next.js app and build the Dashboard shell.
3.  **Phase 3: Async Engine.** Integrate Redis and Celery; port scraper and NLP logic to workers.
4.  **Phase 4: Resume Parsing.** Implement PDF extraction.
5.  **Phase 5: Roadmap.sh Integration.** Map gaps to learning paths.

## 7. Testing Strategy
*   **Unit Tests:** Port existing NLP and scraper tests to the new architecture.
*   **API Tests:** Test FastAPI endpoints using `TestClient`.
*   **E2E Tests:** Use Playwright to verify the User Login -> Upload Resume -> Run Analysis flow.
