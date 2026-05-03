from pathlib import Path
from typing import Dict, List, Optional
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    # --- Paths ---
    BASE_DIR: Path = Path(__file__).resolve().parents[3]
    DATA_STORE_DIR: Path = BASE_DIR / "data_store"

    # --- Project Metadata ---
    PROJECT_NAME: str = "CareerCompass AI"
    API_V1_STR: str = "/api/v1"

    # --- Feature Toggles ---
    USE_MOCK_DATA: bool = True
    ENABLE_BERT: bool = False

    # For MariaDB, use mysql+pymysql://user:password@host:port/db
    DATABASE_URL: str = "sqlite:///./career_gap.db"
    CLERK_JWKS_URL: str = "https://meet-narwhal-62.clerk.accounts.dev/.well-known/jwks.json"
    CLERK_SECRET_KEY: Optional[str] = None

    # --- Redis & Celery ---
    REDIS_URL: str = "redis://localhost:6379/0"

    # --- Scraping ---
    MAX_JOBS_PER_PLATFORM: int = 20
    REQUEST_DELAY_SECONDS: int = 2
    SCRAPE_TIMEOUT_SECONDS: int = 10

    # --- Adzuna ---
    ADZUNA_APP_ID: str = ""
    ADZUNA_APP_KEY: str = ""
    ADZUNA_COUNTRY: str = "in"
    ADZUNA_DEFAULT_LOCATION: str = "India"
    ADZUNA_SORT_BY: str = ""
    ADZUNA_WHAT_EXCLUDE: str = ""
    ADZUNA_SALARY_MIN: str = ""
    ADZUNA_SALARY_MAX: str = ""
    ADZUNA_FULL_TIME: str = ""
    ADZUNA_PART_TIME: str = ""
    ADZUNA_PERMANENT: str = ""
    ADZUNA_CONTRACT: str = ""

    # --- NLP ---
    SPACY_MODEL: str = "en_core_web_md"
    SIMILARITY_THRESHOLD: float = 0.75

    # --- Analysis ---
    PARTIAL_MATCH_MIN_SCORE: float = 0.5
    PARTIAL_MATCH_MAX_SCORE: float = 0.75

    # --- Supported Roles & Skills ---
    SUPPORTED_ROLES: List[str] = [
        "Data Analyst",
        "Data Scientist",
        "Machine Learning Engineer",
        "Software Engineer",
        "Frontend Developer",
        "Backend Developer",
        "DevOps Engineer",
        "UI/UX Designer",
        "Cybersecurity Analyst",
        "Cloud Engineer",
    ]

    ROLE_SKILLS: Dict[str, List[str]] = {
        "Data Analyst": [
            "Python", "SQL", "Excel", "Tableau", "Power BI", "Pandas", "NumPy", "Statistics",
            "Data Visualization", "ETL", "R", "Machine Learning", "Data Cleaning", "Jupyter"
        ],
        "Data Scientist": [
            "Python", "R", "SQL", "Machine Learning", "Deep Learning", "Pandas", "NumPy", "Scikit-learn",
            "TensorFlow", "PyTorch", "Statistics", "Data Visualization", "Jupyter", "Git", "AWS"
        ],
        "Machine Learning Engineer": [
            "Python", "Machine Learning", "Deep Learning", "TensorFlow", "PyTorch", "Scikit-learn",
            "MLOps", "Docker", "Kubernetes", "AWS", "GCP", "Azure", "Git", "CI/CD", "Model Deployment"
        ],
        "Software Engineer": [
            "Python", "Java", "JavaScript", "C++", "Git", "Docker", "SQL", "REST APIs",
            "Microservices", "Agile", "Testing", "Design Patterns", "Linux", "AWS"
        ],
        "Frontend Developer": [
            "JavaScript", "TypeScript", "React", "Vue.js", "Angular", "HTML", "CSS", "Sass",
            "Webpack", "Git", "Responsive Design", "Figma", "Testing", "Node.js"
        ],
        "Backend Developer": [
            "Python", "Java", "Node.js", "SQL", "MongoDB", "REST APIs", "GraphQL", "Docker",
            "Kubernetes", "AWS", "Redis", "Microservices", "Git", "Testing"
        ],
        "DevOps Engineer": [
            "Docker", "Kubernetes", "AWS", "Terraform", "Jenkins", "Git", "Linux", "Python",
            "Monitoring", "CI/CD", "Infrastructure as Code", "Ansible", "Prometheus", "Grafana"
        ],
        "UI/UX Designer": [
            "Figma", "Sketch", "Adobe XD", "Prototyping", "User Research", "Wireframing",
            "Usability Testing", "Design Systems", "HTML", "CSS", "JavaScript", "InVision"
        ],
        "Cybersecurity Analyst": [
            "Network Security", "Ethical Hacking", "SIEM", "Firewalls", "Cryptography", "Risk Assessment",
            "Compliance", "Incident Response", "Python", "Linux", "Kali Linux", "Penetration Testing"
        ],
        "Cloud Engineer": [
            "AWS", "Azure", "GCP", "Docker", "Kubernetes", "Terraform", "Python", "Linux",
            "CI/CD", "Monitoring", "Infrastructure as Code", "Serverless", "Networking"
        ]
    }

    SCRAPE_PLATFORMS: List[str] = ["adzuna"]

    model_config = SettingsConfigDict(
        env_file=str(Path(__file__).resolve().parents[3] / ".env"),
        env_file_encoding="utf-8",
        case_sensitive=True,
        extra="ignore"
    )


settings = Settings()

# --- Backward Compatibility Exports ---
USE_MOCK_DATA = settings.USE_MOCK_DATA
ENABLE_BERT = settings.ENABLE_BERT
MAX_JOBS_PER_PLATFORM = settings.MAX_JOBS_PER_PLATFORM
REQUEST_DELAY_SECONDS = settings.REQUEST_DELAY_SECONDS
SCRAPE_TIMEOUT_SECONDS = settings.SCRAPE_TIMEOUT_SECONDS
ADZUNA_APP_ID = settings.ADZUNA_APP_ID
ADZUNA_APP_KEY = settings.ADZUNA_APP_KEY
ADZUNA_COUNTRY = settings.ADZUNA_COUNTRY
ADZUNA_DEFAULT_LOCATION = settings.ADZUNA_DEFAULT_LOCATION
ADZUNA_SORT_BY = settings.ADZUNA_SORT_BY
ADZUNA_WHAT_EXCLUDE = settings.ADZUNA_WHAT_EXCLUDE
ADZUNA_SALARY_MIN = settings.ADZUNA_SALARY_MIN
ADZUNA_SALARY_MAX = settings.ADZUNA_SALARY_MAX
ADZUNA_FULL_TIME = settings.ADZUNA_FULL_TIME
ADZUNA_PART_TIME = settings.ADZUNA_PART_TIME
ADZUNA_PERMANENT = settings.ADZUNA_PERMANENT
ADZUNA_CONTRACT = settings.ADZUNA_CONTRACT
SPACY_MODEL = settings.SPACY_MODEL
SIMILARITY_THRESHOLD = settings.SIMILARITY_THRESHOLD
PARTIAL_MATCH_MIN_SCORE = settings.PARTIAL_MATCH_MIN_SCORE
PARTIAL_MATCH_MAX_SCORE = settings.PARTIAL_MATCH_MAX_SCORE
SUPPORTED_ROLES = settings.SUPPORTED_ROLES
ROLE_SKILLS = settings.ROLE_SKILLS
SCRAPE_PLATFORMS = settings.SCRAPE_PLATFORMS
DATA_STORE_DIR = settings.DATA_STORE_DIR
