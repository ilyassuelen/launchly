from fastapi import APIRouter

from backend.app.schemas.resume.resume_analysis import (
    ResumeAnalysisRequest,
)

from backend.app.services.resume.resume_analysis_service import (
    analyze_resume,
)

router = APIRouter(
    prefix="/ai/resume-analysis",
    tags=["Resume Analysis"],
)


@router.post("/analyze")
async def analyze_resume_route(
    payload: ResumeAnalysisRequest,
):
    return await analyze_resume(payload)
