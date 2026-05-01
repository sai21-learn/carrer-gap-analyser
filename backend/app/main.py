from fastapi import FastAPI

from backend.app.api.profile import router as profile_router

app = FastAPI(title="CareerCompass AI API")

app.include_router(profile_router, prefix="/profile", tags=["profile"])


@app.get("/")
async def root():
    return {"message": "Welcome to CareerCompass AI API"}
