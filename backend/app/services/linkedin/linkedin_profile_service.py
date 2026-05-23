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

    db.commit()
    db.refresh(profile)

    return profile
