from copy import deepcopy

from fastapi import APIRouter, Depends, Header, HTTPException, Response
from sqlalchemy.orm import Session

from backend.app.core.database import get_db

from backend.app.models.cover_letter.cover_letter import CoverLetter
from backend.app.models.user.user import User

from backend.app.schemas.cover_letter.cover_letter import CoverLetterCreate

from backend.app.core.deps import get_current_user
from backend.app.services.cover_letter.cover_letter_pdf_service import (
    generate_cover_letter_pdf,
)

router = APIRouter(prefix="/cover-letters",)


def serialize_cover_letter(cover_letter: CoverLetter):
    return {
        "id": cover_letter.id,
        "title": cover_letter.title,
        "template": cover_letter.template,
        "data": cover_letter.data,
        "created_at": cover_letter.created_at,
        "updated_at": cover_letter.updated_at,
        "latest_cover_letter_analysis": cover_letter.latest_cover_letter_analysis,
        "latest_cover_letter_analysis_created_at": cover_letter.latest_cover_letter_analysis_created_at,
    }


@router.get("/")
def get_cover_letters(
    db: Session = Depends(get_db),
    current_user: User = Depends(
        get_current_user,
    ),
):
    cover_letters = (
        db.query(CoverLetter)
        .filter(
            CoverLetter.user_id
            == current_user.id
        )
        .order_by(
            CoverLetter.updated_at.desc()
        )
        .all()
    )

    return [
        serialize_cover_letter(cover_letter)
        for cover_letter in cover_letters
    ]


@router.post("/")
def create_cover_letter(
    payload: CoverLetterCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(
        get_current_user,
    ),
):
    cover_letter = CoverLetter(
        title=payload.title,
        template=payload.template,
        user_id=current_user.id,
        data=payload.data,
    )

    db.add(cover_letter)
    db.commit()
    db.refresh(cover_letter)

    return serialize_cover_letter(
        cover_letter
    )


@router.get("/{cover_letter_id}")
def get_cover_letter(
    cover_letter_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(
        get_current_user,
    ),
):
    cover_letter = (
        db.query(CoverLetter)
        .filter(
            CoverLetter.id
            == cover_letter_id,
            CoverLetter.user_id
            == current_user.id,
        )
        .first()
    )

    if not cover_letter:
        raise HTTPException(
            status_code=404,
            detail="Cover letter not found",
        )

    return serialize_cover_letter(cover_letter)


@router.put("/{cover_letter_id}")
def update_cover_letter(
    cover_letter_id: str,
    payload: dict,
    db: Session = Depends(get_db),
    current_user: User = Depends(
        get_current_user,
    ),
):
    cover_letter = (
        db.query(CoverLetter)
        .filter(
            CoverLetter.id
            == cover_letter_id,
            CoverLetter.user_id
            == current_user.id,
        )
        .first()
    )

    if not cover_letter:
        raise HTTPException(
            status_code=404,
            detail="Cover letter not found",
        )

    if "data" in payload:
        cover_letter.data = payload["data"]

    if "title" in payload:
        cover_letter.title = payload["title"]

    if "template" in payload:
        cover_letter.template = payload["template"]

    db.commit()
    db.refresh(cover_letter)

    return serialize_cover_letter(cover_letter)


@router.post("/{cover_letter_id}/duplicate")
def duplicate_cover_letter(
    cover_letter_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(
        get_current_user,
    ),
):
    cover_letter = (
        db.query(CoverLetter)
        .filter(
            CoverLetter.id
            == cover_letter_id,
            CoverLetter.user_id
            == current_user.id,
        )
        .first()
    )

    if not cover_letter:
        raise HTTPException(
            status_code=404,
            detail="Cover letter not found",
        )

    duplicated_cover_letter = CoverLetter(
        user_id=current_user.id,
        title=f"{cover_letter.title} (Copy)",
        template=cover_letter.template,
        data=deepcopy(cover_letter.data),
        latest_cover_letter_analysis=deepcopy(cover_letter.latest_cover_letter_analysis),
        latest_cover_letter_analysis_created_at=cover_letter.latest_cover_letter_analysis_created_at,
    )

    db.add(duplicated_cover_letter)
    db.commit()
    db.refresh(duplicated_cover_letter)

    return serialize_cover_letter(duplicated_cover_letter)


@router.delete("/{cover_letter_id}")
def delete_cover_letter(
    cover_letter_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(
        get_current_user,
    ),
):
    cover_letter = (
        db.query(CoverLetter)
        .filter(
            CoverLetter.id
            == cover_letter_id,
            CoverLetter.user_id
            == current_user.id,
        )
        .first()
    )

    if not cover_letter:
        raise HTTPException(
            status_code=404,
            detail="Cover letter not found",
        )

    db.delete(cover_letter)
    db.commit()

    return {
        "success": True,
        "message":
            "Cover letter deleted",
    }


@router.get("/{cover_letter_id}/export-pdf")
async def export_cover_letter_pdf(
    cover_letter_id: str,
    authorization: str = Header(...),
    db: Session = Depends(get_db),
    current_user: User = Depends(
        get_current_user,
    ),
):
    cover_letter = (
        db.query(CoverLetter)
        .filter(
            CoverLetter.id
            == cover_letter_id,
            CoverLetter.user_id
            == current_user.id,
        )
        .first()
    )

    if not cover_letter:
        raise HTTPException(
            status_code=404,
            detail="Cover letter not found",
        )

    access_token = authorization.replace(
        "Bearer ",
        "",
    ).strip()

    pdf_bytes = await generate_cover_letter_pdf(
        cover_letter_id=cover_letter_id,
        access_token=access_token,
    )

    first_name = current_user.first_name.strip()
    last_name = current_user.last_name.strip()

    safe_first_name = "".join(
        char for char in first_name
        if char.isalnum() or char in ["-", "_"]
    )

    safe_last_name = "".join(
        char for char in last_name
        if char.isalnum() or char in ["-", "_"]
    )

    filename = f"{safe_first_name}_{safe_last_name}_Cover_Letter.pdf"

    return Response(
        content=pdf_bytes,
        media_type="application/pdf",
        headers={
            "Content-Disposition": f'attachment; filename="{filename}"',
            "Access-Control-Expose-Headers": "Content-Disposition",
        },
    )
