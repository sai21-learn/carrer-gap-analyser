# 🎯 CareerCompass AI

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Python 3.11+](https://img.shields.io/badge/python-3.11+-blue.svg)](https://www.python.org/downloads/)
[![Next.js 14](https://img.shields.io/badge/Next.js-14-black.svg)](https://nextjs.org/)
[![Clerk Auth](https://img.shields.io/badge/Auth-Clerk-6C47FF.svg)](https://clerk.com/)

An intelligent, full-stack platform designed to identify, analyze, and bridge the gap between your current skills and your dream career. CareerCompass AI leverages NLP and asynchronous processing to deliver personalized learning roadmaps and job market insights.

---

## ✨ Key Features

- **📄 Smart Resume Parsing**: Extracts skills and experience using spaCy NLP models.
- **🔍 Industry Alignment**: Real-time job scraping to compare your skills against live market requirements.
- **🗺️ Interactive Roadmaps**: Visual learning paths powered by React Flow.
- **🔐 Secure Identity**: Enterprise-grade authentication via Clerk with JWKS verification.
- **🚀 High-Performance Backend**: FastAPI with asynchronous task processing via Celery & Redis.
- **🎨 Premium UI/UX**: Minimalist 'techy' dark mode designed for focus and clarity.

---

## 🛠️ Tech Stack

| Layer | Technologies |
| :--- | :--- |
| **Frontend** | Next.js 14 (App Router), TypeScript, Tailwind CSS, Framer Motion, React Flow |
| **Backend** | FastAPI, Pydantic V2 (Settings & Schemas), SQLModel (PostgreSQL/SQLite) |
| **Security** | Clerk Auth, PyJWT (JWKS Verification), CORS Middleware |
| **Data & NLP** | spaCy, BeautifulSoup4, Selenium (Job Scraping) |
| **Task Queue** | Celery, Redis |

---

## 🚀 Getting Started

Follow these instructions to get a development environment up and running on your local machine.

### 📋 Prerequisites

| Requirement | Windows | macOS | Linux (Debian/Ubuntu) |
| :--- | :--- | :--- | :--- |
| **Python 3.11+** | [Download](https://www.python.org/downloads/) | `brew install python` | `sudo apt install python3.11` |
| **Node.js 18+** | [Download](https://nodejs.org/) | `brew install node` | `sudo apt install nodejs npm` |
| **Redis** | [WSL2](https://learn.microsoft.com/en-us/windows/wsl/install) + `sudo apt install redis-server` | `brew install redis` | `sudo apt install redis-server` |
| **Git** | [Download](https://git-scm.com/) | `brew install git` | `sudo apt install git` |

---

### 1. Clone the Repository

```bash
git clone https://github.com/sai21-learn/carrer-gap-analyser.git
cd carrer-gap-analyser
```

### 2. Backend Setup

#### Create Virtual Environment
```bash
cd backend
python -m venv .venv

# Activate (Linux/macOS)
source .venv/bin/activate

# Activate (Windows)
.venv\Scripts\activate
```

#### Install Dependencies
```bash
pip install -r requirements.txt
python -m spacy download en_core_web_md
```

#### Environment Configuration (`backend/.env`)
Create a `.env` file in the `backend` directory:
```env
DATABASE_URL=sqlite:///./career_gap.db
REDIS_URL=redis://localhost:6379/0
CLERK_JWKS_URL=https://<your-clerk-domain>/.well-known/jwks.json
ADZUNA_APP_ID=your_adzuna_app_id
ADZUNA_APP_KEY=your_adzuna_app_key
```

### 3. Frontend Setup

#### Install Packages
```bash
cd ../frontend
npm install
```

#### Environment Configuration (`frontend/.env.local`)
Create a `.env.local` file in the `frontend` directory:
```env
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/dashboard
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/onboarding
```

---

## 🔑 Obtaining API Keys

### 🔐 Clerk (Authentication)
1. Sign up at [Clerk.com](https://clerk.com/).
2. Create a new application.
3. In the dashboard, go to **API Keys**.
4. Copy the **Publishable Key** and **Secret Key**.
5. For `CLERK_JWKS_URL`, use `https://<your-clerk-frontend-api-url>/.well-known/jwks.json`.

### 💼 Adzuna (Job Data)
1. Register at [Adzuna Developer Portal](https://developer.adzuna.com/).
2. Create a new application.
3. Copy your **App ID** and **API Key**.

---

## 🗄️ Database Setup

The project uses **SQLModel** and supports multiple databases.

### 🔹 Option 1: MariaDB (Recommended)
Ideal for production-like local development.
```env
DATABASE_URL=mysql+pymysql://user:password@localhost:3306/career_gap
```

### 🔹 Option 2: SQLite
Ideal for quick local testing without a database server.
```env
DATABASE_URL=sqlite:///./career_gap.db
```

### 🔹 Option 3: MongoDB (Future Support)
*Note: The current backend is SQL-based. MongoDB support is planned for the resource caching layer.*

---

## 🏃 Running the Application

### 1. Start Redis / Valkey
Ensure your message broker is running. On Arch Linux, Redis has been replaced by Valkey.
```bash
# Linux (Arch)
sudo systemctl start valkey

# Linux (Debian/Ubuntu)
sudo systemctl start redis-server

# macOS
brew services start redis
```

### 2. Start Backend API
Run this from the project root:
```bash
cd backend
./.venv/bin/python -m uvicorn app.main:app --reload
```

### 3. Start Celery Worker (In a new terminal)
Run this from the project root:
```bash
cd backend
./.venv/bin/python -m celery -A app.celery_worker worker --loglevel=info
```

### 4. Start Frontend
```bash
cd frontend
npm run dev
```

Visit `http://localhost:3000` to see the app!

---

## 🏗️ Architecture

The project follows **Clean Architecture** principles to ensure scalability and maintainability:

```mermaid
graph TD
    A[Frontend: Next.js] -->|API Calls| B[FastAPI Gateway]
    B -->|Auth| C[Clerk JWKS Verify]
    B -->|Sync Tasks| D[SQLModel DB]
    B -->|Async Tasks| E[Celery/Redis]
    E -->|Scraping| F[Job Portals]
    E -->|NLP| G[Skill Extraction]
```

- **Models**: Pure database entities (SQLModel).
- **Schemas**: Decoupled API request/response models (Pydantic).
- **Services**: Business logic (Roadmap generation, Gap analysis).
- **Core**: Shared utilities, NLP engine, and scraper drivers.

---

## 📁 Project Structure

```bash
.
├── backend/
│   ├── app/
│   │   ├── api/          # API Routers (v1)
│   │   ├── core/         # NLP, Scrapers, Config (Pydantic Settings)
│   │   ├── models.py     # Database Entities
│   │   ├── schemas.py    # API Data Models
│   │   └── auth.py       # Clerk Security Logic
│   └── requirements.txt
├── frontend/
│   ├── app/              # Next.js App Router
│   ├── components/       # Reusable UI/Dashboard components
│   └── tailwind.config.ts
└── README.md
```

---

## 🤝 Contributing

Contributions are what make the open-source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.

---sly, if the Scraping phase took 5 minutes, the UI would reach 90% (its cap) and just sit there, mak
<p align="center">
  Built with ❤️ for the future of career development.
</p>
