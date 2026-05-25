from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from backend.app.core.database import get_db
from backend.app.core.deps import get_current_user
from backend.app.models.user.user import User

from backend.app.schemas.interview.interview import (
    InterviewAnswerRequest,
    InterviewAnswerResponse,
    InterviewSessionDetailResponse,
    InterviewSessionResponse,
    InterviewStartRequest,
    InterviewStartResponse,
    InterviewStatsResponse,
)

from backend.app.services.interview.interview_session_service import (
    delete_all_interview_sessions,
    get_interview_session_detail,
    list_interview_sessions,
    start_interview_session,
    submit_interview_answer,
)

from backend.app.services.interview.interview_stats_service import get_interview_stats

router = APIRouter(
    prefix="/interview",
    tags=["Interview Simulator"],
)


@router.post(
    "/sessions",
    response_model=InterviewStartResponse,
)
async def create_interview_session(
    payload: InterviewStartRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return await start_interview_session(
        db=db,
        user_id=current_user.id,
        payload=payload,
    )


@router.get(
    "/sessions",
    response_model=list[InterviewSessionResponse],
)
def get_interview_sessions(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return list_interview_sessions(
        db=db,
        user_id=current_user.id,
    )


@router.get(
    "/sessions/{session_id}",
    response_model=InterviewSessionDetailResponse,
)
def get_interview_session(
    session_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return get_interview_session_detail(
        db=db,
        user_id=current_user.id,
        session_id=session_id,
    )


@router.post(
    "/sessions/{session_id}/answer",
    response_model=InterviewAnswerResponse,
)
async def answer_interview_question(
    session_id: int,
    payload: InterviewAnswerRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return await submit_interview_answer(
        db=db,
        user_id=current_user.id,
        session_id=session_id,
        payload=payload,
    )


@router.get(
    "/stats",
    response_model=InterviewStatsResponse,
)
def get_stats(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return get_interview_stats(
        db=db,
        user_id=current_user.id,
    )


@router.delete(
    "/sessions",
)
def delete_interview_sessions(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return delete_all_interview_sessions(
        db=db,
        user_id=current_user.id,
    )
