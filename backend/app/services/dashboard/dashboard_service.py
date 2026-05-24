from sqlalchemy.orm import Session

from backend.app.models.dashboard.dashboard_snapshot import DashboardSnapshot

from backend.app.schemas.dashboard.dashboard import (
    CareerGrowthPoint,
    DashboardActionItem,
    DashboardActivity,
    DashboardApplicationItem,
    DashboardInsight,
    DashboardMetric,
    DashboardMissingSkill,
    DashboardSummaryResponse,
    DashboardSystemHealth,
    DashboardWeeklyPlanItem,
)

from backend.app.services.dashboard.dashboard_review_service import build_dashboard_review
from backend.app.services.dashboard.dashboard_scoring_service import score_to_grade


async def get_latest_dashboard_summary(
    *,
    db: Session,
    user_id: int,
) -> DashboardSummaryResponse:
    latest_snapshot = (
        db.query(DashboardSnapshot)
        .filter(DashboardSnapshot.user_id == user_id)
        .order_by(DashboardSnapshot.created_at.desc())
        .first()
    )

    if not latest_snapshot:
        return await build_dashboard_review(
            db=db,
            user_id=user_id,
            persist=True,
        )

    return DashboardSummaryResponse(
        id=latest_snapshot.id,
        career_score=DashboardMetric(
            value=latest_snapshot.career_score,
            delta="latest review",
        ),
        recruiter_impression=DashboardMetric(
            value=latest_snapshot.recruiter_impression_score,
            label=score_to_grade(
                latest_snapshot.recruiter_impression_score,
            ),
            delta="saved recruiter scans",
        ),
        resume_health=DashboardMetric(
            value=latest_snapshot.resume_health_score,
            delta="average ATS score",
        ),
        interview_readiness=DashboardMetric(
            value=latest_snapshot.interview_readiness_score,
            delta="coming soon",
        ),
        market_fit=(
            latest_snapshot.market_fit
            or (
                latest_snapshot.summary.get("market_fit", {})
                if latest_snapshot.summary
                else {}
            )
        ),
        profile_strength=latest_snapshot.profile_strength or {},
        career_growth=[
            CareerGrowthPoint(**item)
            for item in latest_snapshot.career_growth or []
        ],
        application_pipeline=[
            DashboardApplicationItem(**item)
            for item in latest_snapshot.application_pipeline or []
        ],
        insights=[
            DashboardInsight(**item)
            for item in latest_snapshot.insights or []
        ],
        missing_skills=[
            DashboardMissingSkill(**item)
            for item in latest_snapshot.missing_skills or []
        ],
        activity=DashboardActivity(
            **(latest_snapshot.activity or {})
        ),
        next_best_actions=[
            DashboardActionItem(**item)
            for item in latest_snapshot.next_best_actions or []
        ],
        system_health=DashboardSystemHealth(
            **(latest_snapshot.system_health or {})
        ),
        weekly_plan=[
            DashboardWeeklyPlanItem(**item)
            for item in latest_snapshot.weekly_plan or []
        ],
        review_payload=latest_snapshot.review_payload or {},
        created_at=latest_snapshot.created_at,
        updated_at=latest_snapshot.updated_at,
    )


async def refresh_dashboard_summary(
    *,
    db: Session,
    user_id: int,
) -> DashboardSummaryResponse:
    return await build_dashboard_review(
        db=db,
        user_id=user_id,
        persist=True,
    )
