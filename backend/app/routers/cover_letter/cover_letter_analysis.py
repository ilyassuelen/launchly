from fastapi import APIRouter

from backend.app.schemas.cover_letter.cover_letter_analysis import (
    CoverLetterAnalysisRequest,
    CoverLetterAnalysisResponse,
)

from backend.app.services.cover_letter.cover_letter_analysis_service import (
    analyze_cover_letter,
)

router = APIRouter(
    prefix="/ai/cover-letter-analysis",
    tags=["AI Cover Letter Analysis"],
)


@router.post(
    "/analyze",
    response_model=CoverLetterAnalysisResponse,
)
async def analyze_cover_letter_endpoint(
    payload: CoverLetterAnalysisRequest,
):
    return await analyze_cover_letter(payload)
