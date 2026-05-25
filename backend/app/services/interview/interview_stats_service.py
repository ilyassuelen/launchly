from sqlalchemy.orm import Session

from backend.app.models.interview.interview_result import InterviewResult

from backend.app.schemas.interview.interview import (
    InterviewResultResponse,
    InterviewStatsBucket,
    InterviewStatsResponse,
)


def _average(values: list[int]) -> int:
    clean_values = [
        value
        for value in values
        if value is not None and value > 0
    ]

    if not clean_values:
        return 0

    return int(sum(clean_values) / len(clean_values))


def get_interview_stats(
    *,
    db: Session,
    user_id: int,
) -> InterviewStatsResponse:
    results = (
        db.query(InterviewResult)
        .filter(InterviewResult.user_id == user_id)
        .order_by(InterviewResult.created_at.desc())
        .all()
    )

    if not results:
        return InterviewStatsResponse()

    scores = [
        result.overall_score
        for result in results
        if result.overall_score is not None
    ]

    difficulties = [
        "Junior",
        "Mid",
        "Senior",
    ]

    buckets = []

    for difficulty in difficulties:
        difficulty_results = [
            result
            for result in results
            if result.difficulty.lower() == difficulty.lower()
        ]

        difficulty_scores = [
            result.overall_score
            for result in difficulty_results
            if result.overall_score is not None
        ]

        buckets.append(
            InterviewStatsBucket(
                difficulty=difficulty,
                sessions=len(difficulty_results),
                average_score=_average(difficulty_scores),
                best_score=max(difficulty_scores)
                if difficulty_scores
                else 0,
            )
        )

    return InterviewStatsResponse(
        total_sessions=len(results),
        average_score=_average(scores),
        best_score=max(scores) if scores else 0,
        by_difficulty=buckets,
        recent_results=[
            InterviewResultResponse.model_validate(
                result,
                from_attributes=True,
            )
            for result in results[:5]
        ],
    )
