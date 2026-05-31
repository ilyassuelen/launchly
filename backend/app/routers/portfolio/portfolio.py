from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from backend.app.core.database import get_db
from backend.app.core.deps import get_current_user
from backend.app.models.user.user import User

from backend.app.schemas.portfolio.portfolio_analyzer import (
    PortfolioAnalyzerRequest,
    PortfolioAnalyzerResponse,
)

from backend.app.schemas.portfolio.portfolio_profile import (
    PortfolioProfileResponse,
    PortfolioProfileUpdate,
)

from backend.app.services.portfolio.portfolio_analyzer_service import (
    analyze_portfolio,
)

from backend.app.services.portfolio.portfolio_profile_service import (
    get_portfolio_profile,
    upsert_portfolio_profile,
)


router = APIRouter(
    prefix="/portfolio",
    tags=["Portfolio"],
)


def normalize_portfolio_language(value: str | None) -> str:
    if not value:
        return "en"

    value = value.lower().strip()

    if value in {"de", "deutsch", "german", "germany"}:
        return "de"

    return "en"


@router.get(
    "/profile",
    response_model=PortfolioProfileResponse | None,
)
async def get_saved_portfolio_profile(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return get_portfolio_profile(
        db=db,
        user_id=current_user.id,
    )


@router.post(
    "/analyze",
    response_model=PortfolioAnalyzerResponse,
)
async def analyze_github_portfolio(
    payload: PortfolioAnalyzerRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    payload.language = normalize_portfolio_language(
        current_user.ai_response_language
    )

    analysis = await analyze_portfolio(
        payload,
    )

    upsert_portfolio_profile(
        db=db,
        user_id=current_user.id,
        payload=PortfolioProfileUpdate(
            github_username=payload.github_username,
            language=payload.language,
            analysis=analysis.model_dump(),
        ),
    )

    return analysis
