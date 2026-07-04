from fastapi import APIRouter, Depends, File, UploadFile

from backend.app.core.deps import get_current_user
from backend.app.models.user.user import User
from backend.app.schemas.resume.resume_import import ResumeImportResponse
from backend.app.services.resume.resume_import_service import (
    import_resume_from_file,
)


router = APIRouter(
    prefix="/resumes",
    tags=["Resume Import"],
)


@router.post("/import", response_model=ResumeImportResponse)
async def import_resume_route(
    file: UploadFile = File(...),
    current_user: User = Depends(get_current_user),
):
    return await import_resume_from_file(
        file=file,
        user_id=current_user.id,
    )
