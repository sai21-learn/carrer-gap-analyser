# Data Ingestion & Profile Management Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ] syntax for tracking.

**Goal:** Implement resume parsing (PDF) and persist user skills and profiles to the database.

**Architecture:** Integrate `PyMuPDF` for PDF extraction. Use the existing NLP `skill_extractor` to parse skills from the text. Store results in the PostgreSQL `Profile` table.

**Tech Stack:** FastAPI, SQLModel, PyMuPDF (fitz), Existing NLP modules.

---

### Task 1: Resume Upload & Text Extraction

**Files:**
- Create: `backend/app/services/resume_parser.py`
- Create: `backend/app/api/profile.py`

- [ ] **Step 1: Implement PDF extraction service**
Use `fitz` (PyMuPDF) to extract text from an uploaded file.

```python
import fitz  # PyMuPDF

def extract_text_from_pdf(file_content: bytes) -> str:
    doc = fitz.open(stream=file_content, filetype="pdf")
    text = ""
    for page in doc:
        text += page.get_text()
    return text
```

- [ ] **Step 2: Create Profile API with Upload endpoint**
Create a POST endpoint `/profile/resume` that accepts a file and returns extracted text.

- [ ] **Step 3: Commit**

```bash
git checkout -b feat/resume-ingestion
git add backend/app/services/ backend/app/api/profile.py
git commit -m "feat: add resume upload and text extraction service"
```

---

### Task 2: Skill Extraction Integration

**Files:**
- Modify: `backend/app/services/resume_parser.py`
- Modify: `backend/app/api/profile.py`

- [ ] **Step 1: Link text extraction to NLP skill_extractor**
Import `extract_skills` from the existing `nlp/` module and use it on the extracted resume text.

- [ ] **Step 2: Update API to return extracted skills**
The `/profile/resume` endpoint should now return a list of skills instead of raw text.

- [ ] **Step 3: Commit**

```bash
git add backend/app/services/resume_parser.py backend/app/api/profile.py
git commit -m "feat: integrate NLP skill extraction with resume parser"
```

---

### Task 3: Profile Persistence

**Files:**
- Modify: `backend/app/api/profile.py`

- [ ] **Step 1: Save extracted skills to database**
When a resume is parsed, update the authenticated user's `Profile` record in PostgreSQL with the new skills.

- [ ] **Step 2: Create GET /profile endpoint**
Returns the user's current profile, including their parsed skills and target role.

- [ ] **Step 3: Commit**

```bash
git add backend/app/api/profile.py
git commit -m "feat: persist parsed skills to user profile database"
```

---

### Task 4: Frontend Resume Upload UI

**Files:**
- Create: `frontend/components/dashboard/ResumeUpload.tsx`
- Modify: `frontend/app/dashboard/page.tsx`

- [ ] **Step 1: Build the Upload component**
A drag-and-drop or file picker for PDFs. Sends the file to the backend API with the user's JWT token.

- [ ] **Step 2: Integrate into Dashboard**
Place the upload component on the dashboard overview so users can easily update their skills.

- [ ] **Step 3: Commit**

```bash
git add frontend/components/dashboard/ResumeUpload.tsx frontend/app/dashboard/page.tsx
git commit -m "feat: implement resume upload UI on dashboard"
```
