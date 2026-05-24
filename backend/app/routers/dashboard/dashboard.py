from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from backend.app.core.database import get_db
from backend.app.core.deps import get_current_user
from backend.app.models.user.user import User

from backend.app.schemas.dashboard.dashboard import DashboardSummaryResponse

from backend.app.services.dashboard.dashboard_service import (
    get_latest_dashboard_summary,
    refresh_dashboard_summary,
)

router = APIRouter(
    prefix="/dashboard",
    tags=["Dashboard"],
)


@router.get("/summary", response_model=DashboardSummaryResponse)
async def get_dashboard_summary(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return await get_latest_dashboard_summary(
        db=db,
        user_id=current_user.id,
    )


@router.post("/review", response_model=DashboardSummaryResponse)
async def run_dashboard_review(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return await refresh_dashboard_summary(
        db=db,
        user_id=current_user.id,
    )
