# --- Feature Toggles ---
USE_MOCK_DATA = True
ENABLE_BERT = False

# --- Scraping ---
MAX_JOBS_PER_PLATFORM = 20
REQUEST_DELAY_SECONDS = 2
SCRAPE_TIMEOUT_SECONDS = 10

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

# --- Platforms ---
SCRAPE_PLATFORMS = ["linkedin", "naukri"]
