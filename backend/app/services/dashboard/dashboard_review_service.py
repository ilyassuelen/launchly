import json
import logging

from openai import AsyncOpenAI
from sqlalchemy.orm import Session

from backend.app.core.config import settings

from backend.app.models.dashboard.dashboard_review import DashboardReview
from backend.app.models.dashboard.dashboard_snapshot import DashboardSnapshot

from backend.app.prompts.dashboard.dashboard_review_prompts import (
    DASHBOARD_REVIEW_SYSTEM_PROMPT,
    build_dashboard_review_prompt,
)

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

from backend.app.services.dashboard.dashboard_data_collector import (
    collect_dashboard_data,
)

from backend.app.services.dashboard.dashboard_scoring_service import (
    build_activity_heatmap,
    build_career_growth,
    build_fallback_insights,
    build_market_fit,
    build_missing_skills,
    build_profile_strength,
    build_weekly_plan,
    calculate_core_scores,
    score_to_grade,
)

from backend.app.services.privacy.llm_privacy import prepare_data

client = AsyncOpenAI(
    api_key=settings.OPENAI_API_KEY,
)

logger = logging.getLogger(__name__)


async def _run_llm_review(
    *,
    data: dict,
    scores: dict,
    language: str,
) -> dict:
    if not settings.OPENAI_API_KEY:
        logger.warning(
            "Dashboard review using fallback because OPENAI_API_KEY is missing language=%s",
            language,
        )
        return {}

    clean_data = prepare_data(data)

    prompt = build_dashboard_review_prompt(
        data=clean_data,
        scores=scores,
        language=language,
    )
    try:
        response = await client.chat.completions.create(
            model="gpt-4o-mini",
            temperature=0.4,
            response_format={
                "type": "json_object",
            },
            messages=[
                {
                    "role": "system",
                    "content": DASHBOARD_REVIEW_SYSTEM_PROMPT,
                },
                {
                    "role": "user",
                    "content": prompt,
                },
            ],
        )
    except Exception:
        logger.exception(
            "Dashboard review AI request failed language=%s career_score=%s",
            language,
            scores.get("career_score"),
        )
        return {}

    content = response.choices[0].message.content or "{}"

    try:
        parsed = json.loads(content)
    except Exception:
        logger.exception(
            "Dashboard review JSON parsing failed language=%s response_preview=%s",
            language,
            content[:500],
        )
        return {}

    if not isinstance(parsed, dict):
        logger.error(
            "Dashboard review AI response is not a dictionary language=%s response_type=%s",
            language,
            type(parsed).__name__,
        )
        return {}

    return parsed


def _normalize_list(
    value,
) -> list:
    if isinstance(value, list):
        return value

    return []


async def build_dashboard_review(
    *,
    db: Session,
    user_id: int,
    language: str,
    persist: bool = True,
) -> DashboardSummaryResponse:
    data = collect_dashboard_data(
        db=db,
        user_id=user_id,
        language=language,
    )

    scores = calculate_core_scores(
        data,
    )

    previous_score = (
        data.get("previous_snapshot", {})
        .get("career_score", 0)
    )

    profile_strength = build_profile_strength(
        scores,
    )

    market_fit = build_market_fit(
        scores=scores,
        data=data,
    )

    career_growth = build_career_growth(
        current_score=scores["career_score"],
        previous_score=previous_score,
    )

    activity = build_activity_heatmap(
        applications=data.get("applications", {}),
    )

    llm_result = await _run_llm_review(
        data=data,
        scores=scores,
        language=language,
    )

    insights = (
        _normalize_list(llm_result.get("insights"))
        or build_fallback_insights(scores=scores)
    )[:4]

    missing_skills = (
        _normalize_list(llm_result.get("missing_skills"))
        or build_missing_skills(scores=scores)
    )[:6]

    next_best_actions = (
        _normalize_list(llm_result.get("next_best_actions"))
        or insights
    )[:5]

    weekly_plan = (
        _normalize_list(llm_result.get("weekly_plan"))
        or build_weekly_plan(scores=scores)
    )[:5]

    application_pipeline = data.get("applications", {}).get("recent", [])

    system_health = {
        "resume": scores["resume_score"],
        "recruiter_view": scores["recruiter_score"],
        "linkedin": scores["linkedin_score"],
        "portfolio": scores["portfolio_score"],
        "applications": scores["applications_score"],
        "interview": scores["interview_score"],
    }

    review_payload = {
        "source_data": data,
        "scores": scores,
        "llm_result": llm_result,
    }

    snapshot = None

    if persist:
        try:
            snapshot = DashboardSnapshot(
                user_id=user_id,
                language=language,
                career_score=scores["career_score"],
                recruiter_impression_score=scores["recruiter_score"],
                resume_health_score=scores["resume_score"],
                linkedin_score=scores["linkedin_score"],
                portfolio_score=scores["portfolio_score"],
                applications_score=scores["applications_score"],
                interview_readiness_score=scores["interview_score"],
                summary={
                    **scores,
                    "market_fit": market_fit,
                },
                profile_strength=profile_strength,
                career_growth=career_growth,
                application_pipeline=application_pipeline,
                insights=insights,
                missing_skills=missing_skills,
                activity=activity,
                market_fit=market_fit,
                next_best_actions=next_best_actions,
                system_health=system_health,
                weekly_plan=weekly_plan,
                skill_gaps=missing_skills,
                review_payload=review_payload,
            )

            db.add(snapshot)
            db.commit()
            db.refresh(snapshot)

            review = DashboardReview(
                user_id=user_id,
                status="completed",
                input_data=data,
                result=review_payload,
            )

            db.add(review)
            db.commit()
        except Exception:
            db.rollback()
            logger.exception(
                "Failed to persist dashboard review user_id=%s language=%s career_score=%s",
                user_id,
                language,
                scores.get("career_score"),
            )
            raise

    return DashboardSummaryResponse(
        id=snapshot.id if snapshot else None,
        language=language,
        career_score=DashboardMetric(
            value=scores["career_score"],
            delta="latest review",
        ),
        recruiter_impression=DashboardMetric(
            value=scores["recruiter_score"],
            label=score_to_grade(scores["recruiter_score"]),
            delta="saved recruiter scans",
        ),
        resume_health=DashboardMetric(
            value=scores["resume_score"],
            delta="average ATS score",
        ),
        interview_readiness=DashboardMetric(
            value=scores["interview_score"],
            delta="coming soon",
        ),
        market_fit=market_fit,
        profile_strength=profile_strength,
        career_growth=[
            CareerGrowthPoint(**item)
            for item in career_growth
        ],
        application_pipeline=[
            DashboardApplicationItem(**item)
            for item in application_pipeline
        ],
        insights=[
            DashboardInsight(**item)
            for item in insights
        ],
        missing_skills=[
            DashboardMissingSkill(**item)
            for item in missing_skills
        ],
        activity=DashboardActivity(**activity),
        next_best_actions=[
            DashboardActionItem(**item)
            for item in next_best_actions
        ],
        system_health=DashboardSystemHealth(**system_health),
        weekly_plan=[
            DashboardWeeklyPlanItem(**item)
            for item in weekly_plan
        ],
        review_payload=review_payload,
        created_at=snapshot.created_at if snapshot else None,
        updated_at=snapshot.updated_at if snapshot else None,
    )
