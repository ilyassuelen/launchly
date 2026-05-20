from uuid import uuid4
from pathlib import Path

from fastapi import (
    UploadFile,
    HTTPException,
)

from PIL import Image

UPLOAD_DIR = Path(
    "uploads/resume_photos"
)

UPLOAD_DIR.mkdir(
    parents=True,
    exist_ok=True,
)

MAX_FILE_SIZE = (
    5 * 1024 * 1024
)


def delete_resume_photo(
    photo_url: str,
):
    """
    Delete old resume photo
    from local storage.
    """

    if not photo_url:
        return

    relative_path = (
        photo_url.replace(
            "/uploads/",
            "",
        )
    )

    file_path = (
        Path("uploads")
        / relative_path
    )

    if file_path.exists():
        file_path.unlink()


async def save_resume_photo(
    file: UploadFile,
    user_id: int,
) -> str:
    """
    Save uploaded resume photo locally
    and return public URL.
    """

    contents = await file.read()

    if len(contents) > MAX_FILE_SIZE:
        raise HTTPException(
            status_code=400,
            detail="Image exceeds 5MB limit",
        )

    filename = (
        f"user_{user_id}_{uuid4()}.jpg"
    )

    file_path = (
        UPLOAD_DIR / filename
    )

    with open(file_path, "wb") as f:
        f.write(contents)

    image = Image.open(file_path)

    image = image.convert("RGB")

    image.thumbnail((512, 512))

    image.save(
        file_path,
        format="JPEG",
        quality=82,
        optimize=True,
    )

    return (
        f"/uploads/resume_photos/{filename}"
    )
