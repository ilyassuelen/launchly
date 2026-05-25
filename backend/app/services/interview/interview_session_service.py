from datetime import datetime

from fastapi import HTTPException
from openai import AsyncOpenAI
from sqlalchemy.orm import Session

from backend.app.core.config import settings

from backend.app.models.interview.interview_message import InterviewMessage
from backend.app.models.interview.interview_result import InterviewResult
from backend.app.models.interview.interview_session import InterviewSession

from backend.app.schemas.interview.interview import (
    InterviewAnswerRequest,
    InterviewAnswerResponse,
    InterviewMessageResponse,
    InterviewSessionDetailResponse,
    InterviewSessionResponse,
    InterviewStartRequest,
    InterviewStartResponse,
)

from backend.app.services.interview.interview_data_collector import (
    collect_interview_resume_context,
)

from backend.app.prompts.interview.interview_prompts import (
    build_closing_message,
    build_first_question_prompt,
    build_interview_system_prompt,
    build_next_question_prompt,
)

from backend.app.services.interview.interview_evaluation_service import (
    evaluate_interview_session,
)


def _get_client() -> AsyncOpenAI:
    if not settings.OPENAI_API_KEY:
        raise HTTPException(
            status_code=500,
            detail="OpenAI API key is not configured.",
        )

    return AsyncOpenAI(
        api_key=settings.OPENAI_API_KEY,
    )


async def _generate_ai_message(
    *,
    system_prompt: str,
    user_prompt: str,
) -> str:
    client = _get_client()

    response = await client.chat.completions.create(
        model="gpt-4o-mini",
        temperature=0.55,
        messages=[
            {
                "role": "system",
                "content": system_prompt,
            },
            {
                "role": "user",
                "content": user_prompt,
            },
        ],
    )

    return (
        response.choices[0].message.content
        or "Tell me more about your experience."
    ).strip()


def _message_to_response(
    message: InterviewMessage,
) -> InterviewMessageResponse:
    return InterviewMessageResponse.model_validate(
        message,
        from_attributes=True,
    )


def _session_to_response(
    session: InterviewSession,
) -> InterviewSessionResponse:
    return InterviewSessionResponse.model_validate(
        session,
        from_attributes=True,
    )


def _result_to_response(
    result: InterviewResult | None,
):
    if not result:
        return None

    return result


def _get_session_or_404(
    *,
    db: Session,
    user_id: int,
    session_id: int,
) -> InterviewSession:
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

    return session


def _get_session_messages(
    *,
    db: Session,
    session_id: int,
) -> list[InterviewMessage]:
    return (
        db.query(InterviewMessage)
        .filter(InterviewMessage.session_id == session_id)
        .order_by(InterviewMessage.created_at.asc())
        .all()
    )


def _messages_for_prompt(
    messages: list[InterviewMessage],
) -> list[dict]:
    return [
        {
            "role": message.role,
            "content": message.content,
            "question_index": message.question_index,
            "message_type": message.message_type,
        }
        for message in messages
    ]


async def start_interview_session(
    *,
    db: Session,
    user_id: int,
    payload: InterviewStartRequest,
) -> InterviewStartResponse:
    resume_context = collect_interview_resume_context(
        db=db,
        user_id=user_id,
    )

    session_context = {
        "mode": payload.mode,
        "role": payload.role,
        "difficulty": payload.difficulty,
        "language": payload.language,
        "max_questions": payload.max_questions,
    }

    session = InterviewSession(
        user_id=user_id,
        mode=payload.mode,
        role=payload.role,
        difficulty=payload.difficulty,
        language=payload.language,
        status="active",
        current_question_index=1,
        max_questions=payload.max_questions,
        resume_context=resume_context,
        session_context=session_context,
    )

    db.add(session)
    db.commit()
    db.refresh(session)

    system_prompt = build_interview_system_prompt(
        language=payload.language,
    )

    first_question = await _generate_ai_message(
        system_prompt=system_prompt,
        user_prompt=build_first_question_prompt(
            payload=payload,
            resume_context=resume_context,
        ),
    )

    first_message = InterviewMessage(
        session_id=session.id,
        user_id=user_id,
        role="assistant",
        content=first_question,
        question_index=1,
        message_type="question",
        meta={},
    )

    db.add(first_message)
    db.commit()
    db.refresh(first_message)

    return InterviewStartResponse(
        session=_session_to_response(session),
        first_message=_message_to_response(first_message),
    )


def list_interview_sessions(
    *,
    db: Session,
    user_id: int,
) -> list[InterviewSession]:
    return (
        db.query(InterviewSession)
        .filter(InterviewSession.user_id == user_id)
        .order_by(InterviewSession.created_at.desc())
        .limit(30)
        .all()
    )


def get_interview_session_detail(
    *,
    db: Session,
    user_id: int,
    session_id: int,
) -> InterviewSessionDetailResponse:
    session = _get_session_or_404(
        db=db,
        user_id=user_id,
        session_id=session_id,
    )

    messages = _get_session_messages(
        db=db,
        session_id=session.id,
    )

    result = (
        db.query(InterviewResult)
        .filter(
            InterviewResult.session_id == session.id,
            InterviewResult.user_id == user_id,
        )
        .first()
    )

    return InterviewSessionDetailResponse(
        session=_session_to_response(session),
        messages=[
            _message_to_response(message)
            for message in messages
        ],
        result=_result_to_response(result),
    )


async def submit_interview_answer(
    *,
    db: Session,
    user_id: int,
    session_id: int,
    payload: InterviewAnswerRequest,
) -> InterviewAnswerResponse:
    session = _get_session_or_404(
        db=db,
        user_id=user_id,
        session_id=session_id,
    )

    if session.status != "active":
        raise HTTPException(
            status_code=400,
            detail="Interview session is already completed.",
        )

    user_message = InterviewMessage(
        session_id=session.id,
        user_id=user_id,
        role="user",
        content=payload.answer,
        question_index=session.current_question_index,
        message_type="answer",
        meta={},
    )

    db.add(user_message)
    db.commit()
    db.refresh(user_message)

    if session.current_question_index >= session.max_questions:
        closing_message = InterviewMessage(
            session_id=session.id,
            user_id=user_id,
            role="assistant",
            content=build_closing_message(
                language=session.language,
            ),
            question_index=session.current_question_index,
            message_type="closing",
            meta={},
        )

        session.status = "completed"
        session.ended_at = datetime.utcnow()

        db.add(closing_message)
        db.commit()
        db.refresh(session)
        db.refresh(closing_message)

        result = await evaluate_interview_session(
            db=db,
            user_id=user_id,
            session_id=session.id,
        )

        return InterviewAnswerResponse(
            session=_session_to_response(session),
            user_message=_message_to_response(user_message),
            ai_message=_message_to_response(closing_message),
            result=result,
        )

    messages = _get_session_messages(
        db=db,
        session_id=session.id,
    )

    next_question_index = session.current_question_index + 1

    system_prompt = build_interview_system_prompt(
        language=session.language,
    )

    next_question = await _generate_ai_message(
        system_prompt=system_prompt,
        user_prompt=build_next_question_prompt(
            session_context=session.session_context or {},
            resume_context=session.resume_context or {},
            messages=_messages_for_prompt(messages),
            current_question_index=next_question_index,
            max_questions=session.max_questions,
        ),
    )

    ai_message = InterviewMessage(
        session_id=session.id,
        user_id=user_id,
        role="assistant",
        content=next_question,
        question_index=next_question_index,
        message_type="question",
        meta={},
    )

    session.current_question_index = next_question_index

    db.add(ai_message)
    db.commit()
    db.refresh(session)
    db.refresh(ai_message)

    return InterviewAnswerResponse(
        session=_session_to_response(session),
        user_message=_message_to_response(user_message),
        ai_message=_message_to_response(ai_message),
        result=None,
    )


def delete_all_interview_sessions(
    *,
    db: Session,
    user_id: int,
) -> dict:
    sessions = (
        db.query(InterviewSession)
        .filter(InterviewSession.user_id == user_id)
        .all()
    )

    deleted_count = len(sessions)

    for session in sessions:
        db.delete(session)

    db.commit()

    return {
        "success": True,
        "deleted_sessions": deleted_count,
    }

