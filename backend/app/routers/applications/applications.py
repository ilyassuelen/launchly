from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from backend.app.core.database import get_db
from backend.app.models.user.user import User
from backend.app.schemas.applications.application import (
    ApplicationCreate,
    ApplicationListResponse,
    ApplicationResponse,
    ApplicationUpdate,
)

from backend.app.services.applications.application_service import (
    create_application,
    delete_application,
    list_applications,
    update_application,
)

from backend.app.core.deps import get_current_user


router = APIRouter(
    prefix="/applications",
    tags=["Applications"],
)


@router.get(
    "",
    response_model=ApplicationListResponse,
)
def get_applications(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return list_applications(
        db=db,
        user_id=current_user.id,
    )


@router.post(
    "",
    response_model=ApplicationResponse,
)
def create_new_application(
    payload: ApplicationCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return create_application(
        db=db,
        user_id=current_user.id,
        payload=payload,
    )


@router.patch(
    "/{application_id}",
    response_model=ApplicationResponse,
)
def update_existing_application(
    application_id: int,
    payload: ApplicationUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return update_application(
        db=db,
        user_id=current_user.id,
        application_id=application_id,
        payload=payload,
    )


@router.delete(
    "/{application_id}",
)
def delete_existing_application(
    application_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    delete_application(
        db=db,
        user_id=current_user.id,
        application_id=application_id,
    )

    return {
        "message": "Application deleted successfully",
    }
