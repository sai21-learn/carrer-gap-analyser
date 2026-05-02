from fastapi import FastAPI

from .api import analysis, auth, profile
from .api import analysis, auth, profile, feedback

app = FastAPI(title="CareerCompass AI API")

app.include_router(auth.router, prefix="/auth", tags=["auth"])
app.include_router(profile.router, prefix="/profile", tags=["profile"])
app.include_router(analysis.router, prefix="/analysis", tags=["analysis"])
app.include_router(feedback.router, prefix="/feedback", tags=["feedback"])



@app.get("/health")
def health_check():
    return {"status": "ok"}


@app.on_event("startup")
def on_startup():
    init_db()
