from sqlalchemy import or_
from sqlalchemy.orm import Session

from backend.app.core.security import create_access_token, hash_password, verify_password
from backend.app.models.user.user import User
from backend.app.schemas.auth.auth import RegisterRequest


def register_user(db: Session, user_data: RegisterRequest):
    """Create a new user account."""
    existing_email = (
        db.query(User)
        .filter(User.email == user_data.email)
        .first()
    )

    if existing_email:
        raise ValueError("Email already exists")

    existing_username = (
        db.query(User)
        .filter(User.username == user_data.username)
        .first()
    )

    if existing_username:
        raise ValueError("Username already exists")

    new_user = User(
        first_name=user_data.first_name,
        last_name=user_data.last_name,
        username=user_data.username,
        email=user_data.email,
        hashed_password=hash_password(user_data.password),
    )

    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    return new_user


def login_user(db: Session, login_value: str, password: str):
    """Authenticate a user and return an access token."""
    user = (
        db.query(User)
        .filter(
            or_(
                User.email == login_value,
                User.username == login_value,
            )
        )
        .first()
    )

    if not user:
        raise ValueError("Invalid credentials")

    valid_password = verify_password(
        password,
        user.hashed_password,
    )

    if not valid_password:
        raise ValueError("Invalid credentials")

    access_token = create_access_token(
        data={
            "sub": str(user.id),
        }
    )

    return {
        "access_token": access_token,
        "token_type": "bearer",
    }
