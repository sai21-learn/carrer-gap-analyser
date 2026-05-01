from fastapi import FastAPI

from .db import init_db

app = FastAPI(title="CareerCompass AI API")


@app.get("/health")
def health_check():
    return {"status": "ok"}


@app.on_event("startup")
def on_startup():
    init_db()
