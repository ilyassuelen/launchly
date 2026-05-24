from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from backend.app.core.database import get_db
from backend.app.core.deps import get_current_user
from backend.app.models.user.user import User

from backend.app.schemas.resume.resume_analysis import (
    ResumeAnalysisRequest,
)

from backend.app.services.resume.resume_analysis_service import (
    analyze_resume,
)

router = APIRouter(
    prefix="/ai/resume-analysis",
    tags=["Resume Analysis"],
)


@router.post("/analyze")
async def analyze_resume_route(
    payload: ResumeAnalysisRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return await analyze_resume(
        payload=payload,
        db=db,
        user_id=current_user.id,
    )
