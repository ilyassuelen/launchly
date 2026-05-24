from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from backend.app.core.database import get_db
from backend.app.core.deps import get_current_user
from backend.app.models.user.user import User

from backend.app.schemas.recruiter.recruiter_view import (
    RecruiterViewRequest,
    RecruiterViewResponse,
    SavedRecruiterViewResponse,
)

from backend.app.services.recruiter.recruiter_view_service import (
    analyze_recruiter_view,
    get_saved_recruiter_view_analysis,
)

router = APIRouter(
    prefix="/recruiter",
    tags=["Recruiter"],
)


@router.post(
    "/analyze",
    response_model=RecruiterViewResponse,
)
async def analyze_recruiter(
    payload: RecruiterViewRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return await analyze_recruiter_view(
        payload=payload,
        db=db,
        user_id=current_user.id,
    )


@router.get(
    "/resumes/{resume_id}/analysis",
    response_model=SavedRecruiterViewResponse,
)
def get_recruiter_analysis_for_resume(
    resume_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    saved_analysis = get_saved_recruiter_view_analysis(
        db=db,
        user_id=current_user.id,
        resume_id=resume_id,
    )

    if not saved_analysis:
        raise HTTPException(
            status_code=404,
            detail="No recruiter analysis found for this resume",
        )

    return saved_analysis
