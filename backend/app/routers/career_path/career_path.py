from typing import Optional

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from backend.app.core.database import get_db
from backend.app.core.deps import get_current_user
from backend.app.models.user.user import User
from backend.app.schemas.career_path.career_path import (
    CareerPathGenerateRequest,
    CareerPathResponse,
)
from backend.app.services.career_path.career_path_service import (
    generate_career_path,
    get_user_career_paths,
    get_latest_career_path,
    get_career_path_by_id,
    delete_career_path,
)

router = APIRouter(prefix="/career-path", tags=["career-path"])


def normalize_career_path_language(value: str | None) -> str:
    if not value:
        return "en"

    value = value.lower().strip()

    if value in {"de", "deutsch", "german", "germany"}:
        return "de"

    return "en"


@router.post(
    "/generate",
    response_model=CareerPathResponse,
    status_code=status.HTTP_201_CREATED,
)
async def generate_user_career_path(
    request: CareerPathGenerateRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    request.language = normalize_career_path_language(
        current_user.ai_response_language,
    )

    return await generate_career_path(
        db=db,
        user_id=current_user.id,
        request=request,
    )


@router.get(
    "",
    response_model=list[CareerPathResponse],
)
def list_user_career_paths(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return get_user_career_paths(
        db=db,
        user_id=current_user.id,
    )


@router.get(
    "/latest",
    response_model=Optional[CareerPathResponse],
)
def get_latest_user_career_path(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return get_latest_career_path(
        db=db,
        user_id=current_user.id,
    )


@router.get(
    "/{career_path_id}",
    response_model=CareerPathResponse,
)
def get_user_career_path(
    career_path_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    career_path = get_career_path_by_id(
        db=db,
        user_id=current_user.id,
        career_path_id=career_path_id,
    )

    if not career_path:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Career path not found",
        )

    return career_path


@router.delete(
    "/{career_path_id}",
    status_code=status.HTTP_204_NO_CONTENT,
)
def delete_user_career_path(
    career_path_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    deleted = delete_career_path(
        db=db,
        user_id=current_user.id,
        career_path_id=career_path_id,
    )

    if not deleted:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Career path not found",
        )

    return None
