from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from backend.app.core.database import get_db
from backend.app.models.user.user import User
from backend.app.core.deps import get_current_user

from backend.app.schemas.linkedin.linkedin_analyzer import (
    LinkedInAnalyzerRequest,
    LinkedInAnalyzerResponse,
)

from backend.app.schemas.linkedin.linkedin_profile import (
    LinkedInProfileUpdate,
    LinkedInProfileResponse,
)

from backend.app.services.linkedin.linkedin_analyzer_service import (
    analyze_linkedin_profile,
)

from backend.app.services.linkedin.linkedin_profile_service import (
    get_linkedin_profile,
    upsert_linkedin_profile,
)

router = APIRouter(
    prefix="/linkedin",
    tags=["LinkedIn"],
)


def normalize_linkedin_language(value: str | None) -> str:
    if not value:
        return "en"

    value = value.lower().strip()

    if value in {"de", "deutsch", "german", "germany"}:
        return "de"

    return "en"


@router.post(
    "/analyze",
    response_model=LinkedInAnalyzerResponse,
)
async def analyze_linkedin(
    payload: LinkedInAnalyzerRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    payload.language = normalize_linkedin_language(payload.language)
    payload.analysis_language = normalize_linkedin_language(
        current_user.ai_response_language
    )

    return await analyze_linkedin_profile(
        payload=payload,
        db=db,
        user_id=current_user.id,
    )


@router.get(
    "/profile",
    response_model=LinkedInProfileResponse | None,
)
def read_linkedin_profile(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return get_linkedin_profile(
        db=db,
        user_id=current_user.id,
    )


@router.put(
    "/profile",
    response_model=LinkedInProfileResponse,
)
def save_linkedin_profile(
    payload: LinkedInProfileUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    payload.language = normalize_linkedin_language(
        payload.language
    )

    return upsert_linkedin_profile(
        db=db,
        user_id=current_user.id,
        payload=payload,
    )
