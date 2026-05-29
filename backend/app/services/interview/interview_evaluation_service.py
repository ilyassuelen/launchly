import json
import logging

from fastapi import HTTPException
from openai import AsyncOpenAI
from sqlalchemy.orm import Session

from backend.app.core.config import settings

from backend.app.models.interview.interview_message import InterviewMessage
from backend.app.models.interview.interview_result import InterviewResult
from backend.app.models.interview.interview_session import InterviewSession

from backend.app.schemas.interview.interview import InterviewResultResponse

from backend.app.prompts.interview.interview_prompts import (
    INTERVIEW_EVALUATION_SYSTEM_PROMPT,
    build_interview_evaluation_prompt,
)


logger = logging.getLogger(__name__)


def _score_from_label(value) -> int | None:
    """
    Convert common AI-generated score labels
    into approximate numeric scores.
    """
    if not isinstance(value, str):
        return None

    normalized = value.strip().lower()

    label_scores = {
        "excellent": 90,
        "strong": 82,
        "high": 82,
        "good": 75,
        "medium": 65,
        "moderate": 65,
        "promising": 65,
        "low": 45,
        "weak": 40,
        "poor": 30,
        "unknown": 0,
        "pending": 0,
    }

    return label_scores.get(normalized)


def _clamp_score(value) -> int:
    """
    Convert a score-like value into an integer
    between 0 and 100.
    """
    label_score = _score_from_label(value)

    if label_score is not None:
        return label_score

    try:
        return max(0, min(100, round(float(value))))
    except Exception:
        return 0


def _first_present_score(
    evaluation: dict,
    keys: list[str],
) -> int:
    """
    Find the first usable score value from
    multiple possible AI response keys.
    """
    for key in keys:
        value = evaluation.get(key)

        if value not in [None, "", [], {}]:
            score = _clamp_score(value)

            if score > 0:
                return score

    return 0


def _average_scores(values: list[int]) -> int:
    """Calculate the average of valid positive scores."""
    clean_values = [
        value
        for value in values
        if isinstance(value, int) and value > 0
    ]

    if not clean_values:
        return 0

    return _clamp_score(sum(clean_values) / len(clean_values))


def _weighted_overall_score(
    *,
    confidence_score: int,
    communication_score: int,
    structure_score: int,
    specificity_score: int,
) -> int:
    """
    Calculate the final interview score from
    weighted evaluation categories.
    """
    scores = [
        confidence_score,
        communication_score,
        structure_score,
        specificity_score,
    ]

    if not any(score > 0 for score in scores):
        return 0

    weighted_score = (
        confidence_score * 0.22
        + communication_score * 0.24
        + structure_score * 0.25
        + specificity_score * 0.29
    )

    return _clamp_score(weighted_score)


def _normalize_scores(evaluation: dict) -> dict:
    """
    Normalize AI and fallback evaluation scores
    into the expected interview result fields.
    """
    normalized = dict(evaluation)

    overall_score = _first_present_score(
        normalized,
        [
            "overall_score",
            "overall",
            "score",
            "final_score",
        ],
    )

    structure_score = _first_present_score(
        normalized,
        [
            "structure_score",
            "star_score",
            "star_structure_score",
            "structure",
        ],
    )

    specificity_score = _first_present_score(
        normalized,
        [
            "specificity_score",
            "specificity",
            "detail_score",
            "technical_depth_score",
        ],
    )

    communication_score = _first_present_score(
        normalized,
        [
            "communication_score",
            "communication",
            "clarity_score",
            "clarity",
        ],
    )

    confidence_score = _first_present_score(
        normalized,
        [
            "confidence_score",
            "confidence",
            "estimated_confidence_score",
            "ownership_score",
        ],
    )

    if communication_score == 0:
        communication_score = _average_scores([
            overall_score,
            structure_score,
            specificity_score,
        ])

    if confidence_score == 0:
        confidence_score = _average_scores([
            overall_score,
            communication_score,
            structure_score,
        ])

    calculated_overall_score = _weighted_overall_score(
        confidence_score=confidence_score,
        communication_score=communication_score,
        structure_score=structure_score,
        specificity_score=specificity_score,
    )

    if overall_score == 0:
        overall_score = calculated_overall_score

    if overall_score in [70, 75, 80] and calculated_overall_score > 0:
        if abs(overall_score - calculated_overall_score) >= 2:
            overall_score = calculated_overall_score

    normalized["overall_score"] = overall_score
    normalized["confidence_score"] = confidence_score
    normalized["communication_score"] = communication_score
    normalized["structure_score"] = structure_score
    normalized["specificity_score"] = specificity_score

    return normalized


def _safe_list(value) -> list:
    if isinstance(value, list):
        return value

    return []


def _safe_string(value) -> str | None:
    if value is None:
        return None

    return str(value).strip()


def _get_client() -> AsyncOpenAI:
    """
    Create an OpenAI client and fail early
    if the API key is missing.
    """
    if not settings.OPENAI_API_KEY:
        logger.error(
            "Interview evaluation failed because OPENAI_API_KEY is missing",
        )
        raise HTTPException(
            status_code=500,
            detail="OpenAI API key is not configured.",
        )

    return AsyncOpenAI(
        api_key=settings.OPENAI_API_KEY,
    )


def _result_to_response(
    result: InterviewResult,
) -> InterviewResultResponse:
    return InterviewResultResponse.model_validate(
        result,
        from_attributes=True,
    )


async def _run_interview_evaluation(
    *,
    session: InterviewSession,
    messages: list[InterviewMessage],
) -> dict:
    """
    Run the AI evaluation for a completed interview
    session and return the parsed response.
    """
    client = _get_client()

    prompt = build_interview_evaluation_prompt(
        session={
            "id": session.id,
            "mode": session.mode,
            "role": session.role,
            "difficulty": session.difficulty,
            "language": session.language,
            "max_questions": session.max_questions,
            "resume_context": session.resume_context or {},
            "session_context": session.session_context or {},
        },
        messages=[
            {
                "role": message.role,
                "content": message.content,
                "question_index": message.question_index,
                "message_type": message.message_type,
            }
            for message in messages
        ],
    )

    try:
        response = await client.chat.completions.create(
            model="gpt-4o-mini",
            temperature=0.3,
            response_format={
                "type": "json_object",
            },
            messages=[
                {
                    "role": "system",
                    "content": INTERVIEW_EVALUATION_SYSTEM_PROMPT,
                },
                {
                    "role": "user",
                    "content": prompt,
                },
            ],
        )

    except Exception:
        logger.exception(
            "Interview evaluation AI request failed session_id=%s role=%s difficulty=%s",
            session.id,
            session.role,
            session.difficulty,
        )
        return {}

    content = response.choices[0].message.content or "{}"

    try:
        parsed = json.loads(content)

    except Exception:
        logger.exception(
            "Interview evaluation JSON parsing failed session_id=%s response_preview=%s",
            session.id,
            content[:500],
        )
        return {}

    if not isinstance(parsed, dict):
        logger.error(
            "Interview evaluation response is not a dictionary session_id=%s response_type=%s",
            session.id,
            type(parsed).__name__,
        )
        return {}

    return parsed


def _build_fallback_evaluation(
    *,
    messages: list[InterviewMessage],
) -> dict:
    """
    Build a local interview evaluation fallback
    when the AI response is unavailable or invalid.
    """
    user_answers = [
        message.content
        for message in messages
        if message.role == "user"
    ]

    answer_count = len(user_answers)
    average_answer_length = (
        sum(len(answer.split()) for answer in user_answers) / answer_count
        if answer_count
        else 0
    )

    specificity_score = 54

    if average_answer_length >= 60:
        specificity_score = 73

    if average_answer_length >= 100:
        specificity_score = 84

    structure_score = 61

    if any(
        keyword in " ".join(user_answers).lower()
        for keyword in [
            "result",
            "outcome",
            "impact",
            "therefore",
            "because",
            "learned",
            "improved",
        ]
    ):
        structure_score = 74

    communication_score = min(
        84,
        max(
            56,
            int(average_answer_length),
        ),
    )

    confidence_score = _clamp_score(
        (
            communication_score
            + structure_score
            + specificity_score
        ) / 3
    )

    overall_score = _weighted_overall_score(
        confidence_score=confidence_score,
        communication_score=communication_score,
        structure_score=structure_score,
        specificity_score=specificity_score,
    )

    return {
        "overall_score": overall_score,
        "confidence_score": confidence_score,
        "communication_score": communication_score,
        "structure_score": structure_score,
        "specificity_score": specificity_score,
        "recruiter_engagement": "Medium" if overall_score < 78 else "High",
        "filler_words": "Unknown",
        "estimated_confidence": "Medium" if confidence_score < 78 else "High",
        "strengths": [
            "Completed the interview simulation",
            "Provided answers across multiple questions",
        ],
        "weaknesses": [
            "Add more measurable outcomes to strengthen recruiter trust",
        ],
        "recruiter_insights": [
            {
                "title": "Interview completed",
                "description": "Your answers gave enough signal for a first interview performance estimate.",
                "impact": "medium",
            }
        ],
        "coaching_tips": [
            "Lead with the outcome before explaining the situation.",
            "Use one concrete metric or result in each answer.",
            "Structure behavioral answers with situation, action and result.",
        ],
    }


async def evaluate_interview_session(
    *,
    db: Session,
    user_id: int,
    session_id: int,
) -> InterviewResultResponse:
    """
    Evaluate a completed interview session, persist
    the result and return the saved evaluation.
    """
    existing_result = (
        db.query(InterviewResult)
        .filter(
            InterviewResult.session_id == session_id,
            InterviewResult.user_id == user_id,
        )
        .first()
    )

    if existing_result:
        return _result_to_response(existing_result)

    session = (
        db.query(InterviewSession)
        .filter(
            InterviewSession.id == session_id,
            InterviewSession.user_id == user_id,
        )
        .first()
    )

    if not session:
        raise HTTPException(
            status_code=404,
            detail="Interview session not found.",
        )

    messages = (
        db.query(InterviewMessage)
        .filter(InterviewMessage.session_id == session.id)
        .order_by(InterviewMessage.created_at.asc())
        .all()
    )

    logger.info(
        "Starting interview evaluation session_id=%s user_id=%s message_count=%s",
        session.id,
        user_id,
        len(messages),
    )

    llm_evaluation = await _run_interview_evaluation(
        session=session,
        messages=messages,
    )

    fallback_evaluation = _build_fallback_evaluation(
        messages=messages,
    )

    evaluation = {
        **fallback_evaluation,
        **{
            key: value
            for key, value in llm_evaluation.items()
            if value not in [None, "", [], {}]
        },
    }

    evaluation = _normalize_scores(evaluation)

    result = InterviewResult(
        session_id=session.id,
        user_id=user_id,
        mode=session.mode,
        role=session.role,
        difficulty=session.difficulty,
        language=session.language,
        overall_score=evaluation["overall_score"],
        confidence_score=evaluation["confidence_score"],
        communication_score=evaluation["communication_score"],
        structure_score=evaluation["structure_score"],
        specificity_score=evaluation["specificity_score"],
        recruiter_engagement=_safe_string(
            evaluation.get("recruiter_engagement"),
        ),
        filler_words=_safe_string(
            evaluation.get("filler_words"),
        ),
        estimated_confidence=_safe_string(
            evaluation.get("estimated_confidence"),
        ),
        strengths=_safe_list(
            evaluation.get("strengths"),
        ),
        weaknesses=_safe_list(
            evaluation.get("weaknesses"),
        ),
        recruiter_insights=_safe_list(
            evaluation.get("recruiter_insights"),
        ),
        coaching_tips=_safe_list(
            evaluation.get("coaching_tips"),
        ),
        raw_evaluation=evaluation,
    )

    try:
        db.add(result)
        db.commit()
        db.refresh(result)

    except Exception:
        db.rollback()

        logger.exception(
            "Failed to persist interview evaluation session_id=%s user_id=%s",
            session.id,
            user_id,
        )

        raise

    logger.info(
        "Interview evaluation completed session_id=%s overall_score=%s",
        session.id,
        result.overall_score,
    )

    return _result_to_response(result)
