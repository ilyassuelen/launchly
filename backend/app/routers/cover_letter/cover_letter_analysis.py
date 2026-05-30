from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from backend.app.core.database import get_db
from backend.app.core.deps import get_current_user
from backend.app.models.user.user import User

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
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    payload.language = current_user.ai_response_language or "english"

    return await analyze_cover_letter(
        payload=payload,
        db=db,
        user_id=current_user.id,
    )
