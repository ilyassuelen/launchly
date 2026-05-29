from datetime import datetime
import json
from copy import deepcopy

from fastapi import (
    APIRouter,
    Depends,
    HTTPException,
    UploadFile,
    File,
)

from sqlalchemy.orm import Session

from backend.app.core.database import get_db
from backend.app.models.resume.resume import Resume
from backend.app.models.user.user import User
from backend.app.schemas.resume.resume import ResumeCreate
from backend.app.core.deps import get_current_user

from backend.app.services.storage.resume_photo_storage import (
    save_resume_photo,
    delete_resume_photo,
)

router = APIRouter(
    prefix="/resumes",
)


def _get_resume_photo(data: dict | None) -> str | None:
    if not isinstance(data, dict):
        return None

    basics = data.get("basics")

    if not isinstance(basics, dict):
        return None

    photo = basics.get("photo")

    if isinstance(photo, str) and photo.strip():
        return photo

    return None


def _is_photo_used_by_other_resume(
    db: Session,
    user_id: int,
    photo_url: str,
    exclude_resume_id: int | None = None,
) -> bool:
    if not photo_url:
        return False

    query = db.query(Resume).filter(
        Resume.user_id == user_id,
    )

    if exclude_resume_id is not None:
        query = query.filter(
            Resume.id != exclude_resume_id,
        )

    resumes = query.all()

    return any(
        _get_resume_photo(resume.data) == photo_url
        for resume in resumes
    )


def _delete_photo_if_unused(
    db: Session,
    user_id: int,
    photo_url: str | None,
    exclude_resume_id: int | None = None,
):
    if not photo_url:
        return

    if _is_photo_used_by_other_resume(
        db=db,
        user_id=user_id,
        photo_url=photo_url,
        exclude_resume_id=exclude_resume_id,
    ):
        return

    delete_resume_photo(photo_url)


def _normalize_jsonb_value(value):
    if isinstance(value, str):
        try:
            return json.loads(value)
        except Exception:
            return value

    return value


def serialize_resume(resume: Resume):
    return {
        "id": resume.id,
        "title": resume.title,
        "template": resume.template,
        "data": resume.data,
        "latest_ats_score": resume.latest_ats_score,
        "latest_resume_analysis": resume.latest_resume_analysis,
        "analyzed_at": resume.analyzed_at,
        "created_at": resume.created_at,
        "updated_at": resume.updated_at,
    }


@router.post("/upload-photo")
async def upload_resume_photo(
    file: UploadFile = File(...),
    current_user: User = Depends(get_current_user)
):
    allowed_types = [
        "image/jpeg",
        "image/png",
        "image/webp",
    ]

    if file.content_type not in allowed_types:
        raise HTTPException(
            status_code=400,
            detail="Invalid image type",
        )

    photo_url = await save_resume_photo(
        file,
        current_user.id,
    )

    return {
        "url": photo_url,
    }


@router.get("/")
def get_resumes(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    resumes = (
        db.query(Resume)
        .filter(Resume.user_id == current_user.id)
        .order_by(Resume.updated_at.desc())
        .all()
    )

    return [
        serialize_resume(resume)
        for resume in resumes
    ]


@router.post("/")
def create_resume(
    payload: ResumeCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    resume = Resume(
        title=payload.title,
        template=payload.template,
        user_id=current_user.id,
        data=payload.data,
    )

    db.add(resume)

    db.commit()

    db.refresh(resume)

    return serialize_resume(resume)


@router.get("/latest")
def get_latest_resume(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    resume = (
        db.query(Resume)
        .filter(Resume.user_id == current_user.id)
        .order_by(Resume.updated_at.desc())
        .first()
    )

    if not resume:
        raise HTTPException(
            status_code=404,
            detail="No resume found",
        )

    return serialize_resume(resume)


@router.get("/{resume_id}")
def get_resume(
    resume_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    resume = (
        db.query(Resume)
        .filter(
            Resume.id == resume_id,
            Resume.user_id == current_user.id,
        )
        .first()
    )

    if not resume:
        raise HTTPException(
            status_code=404,
            detail="Resume not found",
        )

    return serialize_resume(resume)


@router.put("/{resume_id}")
def update_resume(
    resume_id: int,
    payload: dict,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    resume = (
        db.query(Resume)
        .filter(
            Resume.id == resume_id,
            Resume.user_id == current_user.id,
        )
        .first()
    )

    if not resume:
        raise HTTPException(
            status_code=404,
            detail="Resume not found",
        )

    old_photo = _get_resume_photo(resume.data)

    if "data" in payload:
        new_photo = _get_resume_photo(payload["data"])

        resume.data = payload["data"]

        if old_photo and old_photo != new_photo:
            _delete_photo_if_unused(
                db=db,
                user_id=current_user.id,
                photo_url=old_photo,
                exclude_resume_id=resume.id,
            )

    if "title" in payload:
        resume.title = payload["title"]

    if "template" in payload:
        resume.template = payload["template"]

    if "latest_ats_score" in payload:
        resume.latest_ats_score = payload["latest_ats_score"]

    if "latest_resume_analysis" in payload:
        resume.latest_resume_analysis = _normalize_jsonb_value(
            payload["latest_resume_analysis"]
        )

    if "analyzed_at" in payload:
        analyzed_at = payload["analyzed_at"]

        if isinstance(analyzed_at, str):
            resume.analyzed_at = datetime.fromisoformat(
                analyzed_at.replace("Z", "+00:00")
            ).replace(tzinfo=None)
        else:
            resume.analyzed_at = analyzed_at

    db.commit()

    db.refresh(resume)

    return serialize_resume(resume)


@router.post("/{resume_id}/duplicate")
def duplicate_resume(
    resume_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    resume = (
        db.query(Resume)
        .filter(
            Resume.id == resume_id,
            Resume.user_id == current_user.id,
        )
        .first()
    )

    if not resume:
        raise HTTPException(
            status_code=404,
            detail="Resume not found",
        )

    duplicated_resume = Resume(
        user_id=current_user.id,
        title=f"{resume.title} (Copy)",
        template=resume.template,
        data=deepcopy(resume.data),
        latest_ats_score=resume.latest_ats_score,
        latest_resume_analysis=deepcopy(resume.latest_resume_analysis),
        analyzed_at=resume.analyzed_at,
    )

    db.add(duplicated_resume)
    db.commit()
    db.refresh(duplicated_resume)

    return serialize_resume(duplicated_resume)


@router.delete("/{resume_id}")
def delete_resume(
    resume_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    resume = (
        db.query(Resume)
        .filter(
            Resume.id == resume_id,
            Resume.user_id == current_user.id,
        )
        .first()
    )

    if not resume:
        raise HTTPException(
            status_code=404,
            detail="Resume not found",
        )

    current_photo = _get_resume_photo(resume.data)

    db.delete(resume)
    db.commit()

    if current_photo:
        _delete_photo_if_unused(
            db=db,
            user_id=current_user.id,
            photo_url=current_photo,
        )

    return {
        "success": True,
        "message": "Resume deleted",
    }
