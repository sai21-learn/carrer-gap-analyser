from fastapi import APIRouter, File, HTTPException, UploadFile

from backend.app.services.resume_parser import extract_text_from_pdf
from nlp.skill_extractor import extract_skills

router = APIRouter()


@router.post("/resume")
async def upload_resume(file: UploadFile = File(...)):
    if file.content_type != "application/pdf":
        raise HTTPException(status_code=400, detail="Only PDF files are supported.")

    try:
        content = await file.read()
        text = extract_text_from_pdf(content)
        skills = extract_skills(text)
        return {"filename": file.filename, "skills": skills}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error parsing PDF: {str(e)}")
