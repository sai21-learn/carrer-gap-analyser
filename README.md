# 🎯 CareerCompass AI

<p align="center">
  <img src="https://img.shields.io/badge/license-MIT-blue.svg" alt="License">
  <img src="https://img.shields.io/badge/python-3.11+-blue.svg" alt="Python Version">
  <img src="https://img.shields.io/badge/typescript-5+-yellow.svg" alt="TypeScript Version">
  <img src="https://img.shields.io/badge/status-active-success.svg" alt="Status">
</p>

<p align="center">
  An intelligent platform to help you identify, track, and close skill gaps for your target career roles.
</p>

---

## ✨ Key Features

- **📄 Resume Analysis**: Upload your resume in PDF format to automatically extract and analyze your current skills using NLP.
- **✏️ Skill Normalization**: Review, edit, and approve your extracted skills to ensure your profile is accurate.
- **🎯 Gap Analysis**: Compares your skills against the requirements of your target job roles to identify skill gaps.
- **🗺️ Personalized Roadmaps**: Generates a dynamic, interactive learning roadmap to help you close your skill gaps.
- **📚 Resource Recommendations**: Provides curated learning resources for each skill in your roadmap.
- **🚀 Asynchronous Processing**: Heavy analysis and scraping tasks are handled by background workers, ensuring a smooth user experience.

## 🛠️ Tech Stack

### Backend
- **Python 3.11+**
- **FastAPI**: For high-performance APIs.
- **Celery & Redis**: For asynchronous task processing.
- **PostgreSQL & SQLModel**: For data persistence.
- **spaCy**: For Natural Language Processing.

### Frontend
- **Next.js 14**: For a modern, server-rendered React application.
- **TypeScript**: For type-safe code.
- **Tailwind CSS**: For a utility-first styling workflow.
- **React Flow**: for interactive roadmap visualizations.

## 🚀 Getting Started

### Prerequisites

- Python 3.11+
- Node.js 18+
- PostgreSQL
- Redis

### Installation & Setup

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/sai21-learn/carrer-gap-analyser.git
    cd carrer-gap-analyser
    ```

2.  **Setup the Backend:**
    ```bash
    cd backend
    python -m venv .venv
    source .venv/bin/activate
    pip install -r requirements.txt
    ```
    - Create a `.env` file and set your `DATABASE_URL` and other environment variables (see `.env.example`).
    - Start the backend server (from the `backend` directory):
      ```bash
      uvicorn app.main:app --reload
      ```
    - Start the Celery worker (from the `backend` directory):
      ```bash
      celery -A app.celery_worker worker --loglevel=info
      ```

3.  **Setup the Frontend:**
    ```bash
    cd frontend
    npm install
    npm run dev
    ```

4.  **Access the application:**
    - The frontend will be available at `http://localhost:3000`.
    - The backend API will be available at `http://localhost:8000`.

## 📁 Project Structure

```
.
├── backend/        # FastAPI application, Celery workers, and all core Python logic
├── frontend/       # Next.js application and dashboard components
├── docs/           # All project documentation
├── scripts/        # Utility scripts
└── tests/          # Automated tests for the backend and core logic
```

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a pull request.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
