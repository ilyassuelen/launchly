from fastapi import APIRouter, Depends, HTTPException
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session

from backend.app.core.database import get_db
from backend.app.schemas.auth.auth import RegisterRequest, TokenResponse
from backend.app.schemas.user.user import UserResponse
from backend.app.services.auth.auth_service import login_user, register_user

router = APIRouter()


@router.post("/register", response_model=UserResponse)
def register(user_data: RegisterRequest, db: Session = Depends(get_db)):
    """Create a new user account."""
    try:
        user = register_user(
            db=db,
            user_data=user_data,
        )

        return user

    except ValueError as e:
        raise HTTPException(
            status_code=400,
            detail=str(e),
        )


@router.post("/login", response_model=TokenResponse)
def login(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    """Authenticate a user and return a JWT token."""
    try:
        return login_user(
            db=db,
            login_value=form_data.username,
            password=form_data.password,
        )

    except ValueError as e:
        raise HTTPException(
            status_code=401,
            detail=str(e),
        )
