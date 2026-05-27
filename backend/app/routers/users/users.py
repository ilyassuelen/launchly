from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from backend.app.core.database import get_db
from backend.app.core.deps import get_current_user
from backend.app.core.security import hash_password, verify_password
from backend.app.models.user.user import User
from backend.app.schemas.user.user import (
    UpdatePasswordRequest,
    UpdateUserRequest,
    UserResponse,
)


router = APIRouter(
    prefix="/users",
    tags=["Users"],
)


def _normalize_ai_response_language(language: str | None) -> str:
    normalized = (language or "english").lower().strip()

    if normalized in ["german", "de", "deutsch"]:
        return "german"

    return "english"


@router.get("/me", response_model=UserResponse)
def get_me(current_user: User = Depends(get_current_user)):
    """Return the currently authenticated user."""
    return current_user


@router.put("/me", response_model=UserResponse)
def update_me(
    data: UpdateUserRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    existing_username = (
        db.query(User)
        .filter(
            User.username == data.username,
            User.id != current_user.id,
        )
        .first()
    )

    if existing_username:
        raise HTTPException(
            status_code=400,
            detail="Username is already taken.",
        )

    existing_email = (
        db.query(User)
        .filter(
            User.email == data.email,
            User.id != current_user.id,
        )
        .first()
    )

    if existing_email:
        raise HTTPException(
            status_code=400,
            detail="Email is already taken.",
        )

    current_user.first_name = data.first_name
    current_user.last_name = data.last_name
    current_user.username = data.username
    current_user.email = data.email
    current_user.ai_response_language = _normalize_ai_response_language(data.ai_response_language)

    db.commit()
    db.refresh(current_user)

    return current_user


@router.put("/me/password")
def update_password(
    data: UpdatePasswordRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    if not verify_password(
        data.current_password,
        current_user.hashed_password,
    ):
        raise HTTPException(
            status_code=400,
            detail="Current password is incorrect.",
        )

    if verify_password(
        data.new_password,
        current_user.hashed_password,
    ):
        raise HTTPException(
            status_code=400,
            detail="New password must be different from the current password.",
        )

    current_user.hashed_password = hash_password(
        data.new_password,
    )

    db.commit()

    return {
        "success": True,
        "message": "Password updated successfully.",
    }
