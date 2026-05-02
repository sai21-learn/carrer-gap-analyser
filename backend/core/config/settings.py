import os

try:
    from dotenv import load_dotenv
except Exception:  # noqa: BLE001
    load_dotenv = None

if load_dotenv:
    load_dotenv()

# --- Feature Toggles ---
USE_MOCK_DATA = os.getenv("USE_MOCK_DATA", "true").lower() == "true"
ENABLE_BERT = os.getenv("ENABLE_BERT", "false").lower() == "true"

# --- Scraping ---
MAX_JOBS_PER_PLATFORM = 20
REQUEST_DELAY_SECONDS = 2
SCRAPE_TIMEOUT_SECONDS = 10

# --- Adzuna ---
ADZUNA_APP_ID = os.getenv("ADZUNA_APP_ID", "")
ADZUNA_APP_KEY = os.getenv("ADZUNA_APP_KEY", "")
ADZUNA_COUNTRY = os.getenv("ADZUNA_COUNTRY", "in")
ADZUNA_DEFAULT_LOCATION = os.getenv("ADZUNA_DEFAULT_LOCATION", "India")
ADZUNA_SORT_BY = os.getenv("ADZUNA_SORT_BY", "")
ADZUNA_WHAT_EXCLUDE = os.getenv("ADZUNA_WHAT_EXCLUDE", "")
ADZUNA_SALARY_MIN = os.getenv("ADZUNA_SALARY_MIN", "")
ADZUNA_SALARY_MAX = os.getenv("ADZUNA_SALARY_MAX", "")
ADZUNA_FULL_TIME = os.getenv("ADZUNA_FULL_TIME", "")
ADZUNA_PART_TIME = os.getenv("ADZUNA_PART_TIME", "")
ADZUNA_PERMANENT = os.getenv("ADZUNA_PERMANENT", "")
ADZUNA_CONTRACT = os.getenv("ADZUNA_CONTRACT", "")

# --- NLP ---
SPACY_MODEL = "en_core_web_md"
SIMILARITY_THRESHOLD = 0.75

# --- Analysis ---
PARTIAL_MATCH_MIN_SCORE = 0.5
PARTIAL_MATCH_MAX_SCORE = 0.75

# --- Supported Roles ---
SUPPORTED_ROLES = [
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

# --- Skills by Role ---
ROLE_SKILLS = {
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

# --- Platforms ---
SCRAPE_PLATFORMS = ["adzuna"]
