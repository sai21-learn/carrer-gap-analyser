import logging
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from .api import analysis, feedback, profile
from .core.config.settings import settings
from .db import init_db

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s",
)
logger = logging.getLogger(__name__)

app = FastAPI(
    title=settings.PROJECT_NAME,
    openapi_url=f"{settings.API_V1_STR}/openapi.json"
)

# Set all CORS enabled origins
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, specify actual origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include Routers
app.include_router(profile.router, prefix=f"{settings.API_V1_STR}/profile", tags=["profile"])
app.include_router(analysis.router, prefix=f"{settings.API_V1_STR}/analysis", tags=["analysis"])
app.include_router(feedback.router, prefix=f"{settings.API_V1_STR}/feedback", tags=["feedback"])


@app.get("/health")
def health_check():
    return {"status": "ok", "project": settings.PROJECT_NAME}


@app.on_event("startup")
def on_startup():
    logger.info("Initializing database...")
    init_db()
    
    logger.info("Checking NLP models...")
    try:
        import spacy
        try:
            spacy.load("en_core_web_md")
        except OSError:
            logger.warning("spaCy model 'en_core_web_md' not found. Downloading now (this may take a minute)...")
            import subprocess
            import sys
            subprocess.run([sys.executable, "-m", "spacy", "download", "en_core_web_md"], check=True)
    except ImportError:
        logger.error("spaCy is not installed! Please run: pip install spacy")
        
    logger.info("Application startup complete.")
