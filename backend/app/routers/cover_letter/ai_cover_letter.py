from fastapi import APIRouter, Depends

from backend.app.core.deps import get_current_user
from backend.app.models.user.user import User

from backend.app.schemas.cover_letter.cover_letter_ai import (
    CoverLetterGenerateRequest,
    CoverLetterGenerateResponse,
)

from backend.app.services.cover_letter.cover_letter_ai_service import (
    generate_cover_letter,
)

router = APIRouter(
    prefix="/ai/cover-letter",
    tags=["AI Cover Letter"],
)


@router.post("/generate", response_model=CoverLetterGenerateResponse)
async def generate_cover_letter_endpoint(
    payload: CoverLetterGenerateRequest,
    current_user: User = Depends(get_current_user),
):
    payload.language = current_user.ai_response_language or "english"

    return await generate_cover_letter(payload)
