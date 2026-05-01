from fastapi import FastAPI

from .api import auth, profile
from .db import init_db

app = FastAPI(title="CareerCompass AI API")

app.include_router(auth.router, prefix="/auth", tags=["auth"])
app.include_router(profile.router, prefix="/profile", tags=["profile"])


@app.get("/health")
def health_check():
    return {"status": "ok"}


@app.on_event("startup")
def on_startup():
    init_db()
