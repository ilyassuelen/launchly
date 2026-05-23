from datetime import date, timedelta

from fastapi import HTTPException
from sqlalchemy.orm import Session

from backend.app.models.applications.application import Application
from backend.app.schemas.applications.application import (
    ApplicationCreate,
    ApplicationListResponse,
    ApplicationResponse,
    ApplicationStats,
    ApplicationUpdate,
)


RESPONSE_STATUSES = {
    "phone_screen",
    "onsite",
    "offer",
    "rejected",
}


ACTIVE_STATUSES = {
    "applied",
    "phone_screen",
    "onsite",
    "offer",
}


def _get_application_or_404(
    db: Session,
    user_id: int,
    application_id: int,
) -> Application:
    application = (
        db.query(Application)
        .filter(
            Application.id == application_id,
            Application.user_id == user_id,
        )
        .first()
    )

    if not application:
        raise HTTPException(
            status_code=404,
            detail="Application not found",
        )

    return application


def _calculate_stats(
    applications: list[Application],
) -> ApplicationStats:
    total = len(applications)

    active = sum(
        1
        for application in applications
        if application.status in ACTIVE_STATUSES
    )

    responses = sum(
        1
        for application in applications
        if application.status in RESPONSE_STATUSES
    )

    offers = sum(
        1
        for application in applications
        if application.status == "offer"
    )

    today = date.today()

    follow_ups_due = 0

    for application in applications:
        if application.status != "applied":
            continue

        if application.follow_up_date and application.follow_up_date <= today:
            follow_ups_due += 1
            continue

        if application.applied_date <= today - timedelta(days=7):
            follow_ups_due += 1

    response_rate = int(
        round((responses / total) * 100)
    ) if total else 0

    return ApplicationStats(
        active=active,
        response_rate=response_rate,
        offers=offers,
        follow_ups_due=follow_ups_due,
    )


def list_applications(
    db: Session,
    user_id: int,
) -> ApplicationListResponse:
    applications = (
        db.query(Application)
        .filter(Application.user_id == user_id)
        .order_by(Application.created_at.desc())
        .all()
    )

    return ApplicationListResponse(
        applications=[
            ApplicationResponse.model_validate(application)
            for application in applications
        ],
        stats=_calculate_stats(applications),
    )


def create_application(
    db: Session,
    user_id: int,
    payload: ApplicationCreate,
) -> Application:
    application = Application(
        user_id=user_id,
        company_name=payload.company_name,
        job_title=payload.job_title,
        status=payload.status,
        applied_date=payload.applied_date,
        phone_screen_date=payload.phone_screen_date,
        onsite_date=payload.onsite_date,
        offer_date=payload.offer_date,
        rejected_date=payload.rejected_date,
        follow_up_date=payload.follow_up_date,
        notes=payload.notes,
    )

    db.add(application)
    db.commit()
    db.refresh(application)

    return application


def update_application(
    db: Session,
    user_id: int,
    application_id: int,
    payload: ApplicationUpdate,
) -> Application:
    application = _get_application_or_404(
        db=db,
        user_id=user_id,
        application_id=application_id,
    )

    update_data = payload.model_dump(
        exclude_unset=True,
    )

    for field, value in update_data.items():
        setattr(application, field, value)

    db.commit()
    db.refresh(application)

    return application


def delete_application(
    db: Session,
    user_id: int,
    application_id: int,
) -> None:
    application = _get_application_or_404(
        db=db,
        user_id=user_id,
        application_id=application_id,
    )

    db.delete(application)
    db.commit()
