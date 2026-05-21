from fastapi import APIRouter

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
async def generate_cover_letter_endpoint(payload: CoverLetterGenerateRequest):
    return await generate_cover_letter(payload)
