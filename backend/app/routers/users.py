from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from backend.app.models.user import User
from backend.app.schemas.user import UserResponse, UpdateUserRequest
from backend.app.core.deps import get_current_user

from backend.app.core.database import get_db


router = APIRouter(
    prefix="/users",
    tags=["Users"],
)


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
    current_user.first_name = data.first_name
    current_user.last_name = data.last_name
    current_user.email = data.email

    db.commit()
    db.refresh(current_user)

    return current_user
