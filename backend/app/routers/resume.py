from copy import deepcopy

from fastapi import (
    APIRouter,
    Depends,
    HTTPException,
    UploadFile,
    File,
)

from sqlalchemy.orm import Session

from backend.app.core.database import (
    get_db,
)

from backend.app.models.resume import (
    Resume,
)

from backend.app.models.user import User

from backend.app.schemas.resume import (
    ResumeCreate,
)

from backend.app.core.deps import (
    get_current_user,
)

from backend.app.services.storage.resume_photo_storage import (
    save_resume_photo,
    delete_resume_photo,
)

router = APIRouter(
    prefix="/resumes",
)


def serialize_resume(resume: Resume):
    return {
        "id": resume.id,
        "title": resume.title,
        "template": resume.template,
        "data": resume.data,
        "created_at": resume.created_at,
        "updated_at": resume.updated_at,
    }


@router.post("/upload-photo")
async def upload_resume_photo(
    file: UploadFile = File(...),
    current_user: User = Depends(
        get_current_user,
    ),
    db: Session = Depends(get_db),
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

    photo_url = (
        await save_resume_photo(
            file,
            current_user.id,
        )
    )

    return {
        "url": photo_url,
    }


@router.get("/")
def get_resumes(
    db: Session = Depends(get_db),
    current_user: User = Depends(
        get_current_user,
    ),
):
    resumes = (
        db.query(Resume)
        .filter(
            Resume.user_id
            == current_user.id
        )
        .order_by(
            Resume.updated_at.desc()
        )
        .all()
    )

    return [
        {
            "id": resume.id,
            "title": resume.title,
            "template": resume.template,
            "updated_at": resume.updated_at,
            "created_at": resume.created_at,
            "data": resume.data,
        }
        for resume in resumes
    ]


@router.post("/")
def create_resume(
    payload: ResumeCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(
        get_current_user,
    ),
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

    return serialize_resume(
        resume
    )


@router.get("/{resume_id}")
def get_resume(
    resume_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(
        get_current_user,
    ),
):
    resume = (
        db.query(Resume)
        .filter(
            Resume.id == resume_id,
            Resume.user_id
            == current_user.id,
        )
        .first()
    )

    if not resume:
        raise HTTPException(
            status_code=404,
            detail="Resume not found",
        )

    return serialize_resume(
        resume
    )


@router.put("/{resume_id}")
def update_resume(
    resume_id: str,
    payload: dict,
    db: Session = Depends(get_db),
    current_user: User = Depends(
        get_current_user,
    ),
):
    resume = (
        db.query(Resume)
        .filter(
            Resume.id == resume_id,
            Resume.user_id
            == current_user.id,
        )
        .first()
    )

    if not resume:
        raise HTTPException(
            status_code=404,
            detail="Resume not found",
        )

    if "data" in payload:
        resume.data = payload["data"]

    if "title" in payload:
        resume.title = payload["title"]

    if "template" in payload:
        resume.template = payload["template"]

    db.commit()

    db.refresh(resume)

    return serialize_resume(
        resume
    )


@router.post("/{resume_id}/duplicate")
def duplicate_resume(
    resume_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(
        get_current_user,
    ),
):
    resume = (
        db.query(Resume)
        .filter(
            Resume.id == resume_id,
            Resume.user_id
            == current_user.id,
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

        data=deepcopy(
            resume.data
        ),
    )

    db.add(
        duplicated_resume
    )

    db.commit()

    db.refresh(
        duplicated_resume
    )

    return serialize_resume(
        duplicated_resume
    )


@router.delete("/{resume_id}")
def delete_resume(
    resume_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(
        get_current_user,
    ),
):
    resume = (
        db.query(Resume)
        .filter(
            Resume.id == resume_id,
            Resume.user_id
            == current_user.id,
        )
        .first()
    )

    if not resume:
        raise HTTPException(
            status_code=404,
            detail="Resume not found",
        )

    current_photo = (
        resume.data.get(
            "basics",
            {},
        ).get("photo")
        if resume.data
        else None
    )

    if current_photo:
        delete_resume_photo(
            current_photo
        )

    db.delete(resume)

    db.commit()

    return {
        "success": True,
        "message":
            "Resume deleted",
    }
