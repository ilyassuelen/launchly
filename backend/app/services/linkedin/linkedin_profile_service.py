from datetime import datetime
from typing import Any, Dict

from sqlalchemy.orm import Session

from backend.app.models.linkedin.linkedin_profile import LinkedInProfile
from backend.app.schemas.linkedin.linkedin_profile import (
    LinkedInProfileUpdate,
)


def get_linkedin_profile(
    db: Session,
    user_id: int,
) -> LinkedInProfile | None:
    return (
        db.query(LinkedInProfile)
        .filter(LinkedInProfile.user_id == user_id)
        .first()
    )


def upsert_linkedin_profile(
    db: Session,
    user_id: int,
    payload: LinkedInProfileUpdate,
) -> LinkedInProfile:
    profile = get_linkedin_profile(
        db=db,
        user_id=user_id,
    )

    if not profile:
        profile = LinkedInProfile(
            user_id=user_id,
        )
        db.add(profile)

    profile.language = payload.language
    profile.headline = payload.headline
    profile.about = payload.about
    profile.skills = payload.skills
    profile.projects = payload.projects
    profile.target_role = payload.target_role
    profile.analysis = payload.analysis
    profile.latest_profile_score = payload.latest_profile_score
    profile.analyzed_at = payload.analyzed_at

    db.commit()
    db.refresh(profile)

    return profile


def save_linkedin_analysis(
    *,
    db: Session,
    user_id: int,
    language: str,
    headline: str,
    about: str,
    skills: list[str],
    projects: list[str],
    target_role: str,
    analysis: Dict[str, Any],
    profile_score: int,
) -> LinkedInProfile:
    profile = get_linkedin_profile(
        db=db,
        user_id=user_id,
    )

    if not profile:
        profile = LinkedInProfile(
            user_id=user_id,
        )
        db.add(profile)

    profile.language = language
    profile.headline = headline
    profile.about = about
    profile.skills = skills
    profile.projects = projects
    profile.target_role = target_role
    profile.analysis = analysis
    profile.latest_profile_score = profile_score
    profile.analyzed_at = datetime.utcnow()

    db.commit()
    db.refresh(profile)

    return profile
