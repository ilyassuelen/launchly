from sqlalchemy.orm import Session

from backend.app.models.portfolio.portfolio_profile import PortfolioProfile
from backend.app.schemas.portfolio.portfolio_profile import PortfolioProfileUpdate


def get_portfolio_profile(
    db: Session,
    user_id: int,
) -> PortfolioProfile | None:
    return (
        db.query(PortfolioProfile)
        .filter(PortfolioProfile.user_id == user_id)
        .first()
    )


def upsert_portfolio_profile(
    db: Session,
    user_id: int,
    payload: PortfolioProfileUpdate,
) -> PortfolioProfile:
    profile = get_portfolio_profile(
        db=db,
        user_id=user_id,
    )

    if not profile:
        profile = PortfolioProfile(
            user_id=user_id,
        )
        db.add(profile)

    profile.github_username = payload.github_username
    profile.language = payload.language
    profile.analysis = payload.analysis

    db.commit()
    db.refresh(profile)

    return profile
