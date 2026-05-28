from io import BytesIO
import logging
from uuid import uuid4

import boto3
from botocore.exceptions import BotoCoreError, ClientError
from fastapi import HTTPException, UploadFile
from PIL import Image

from backend.app.core.config import settings

logger = logging.getLogger(__name__)

MAX_FILE_SIZE = 5 * 1024 * 1024
MAX_IMAGE_SIZE = (512, 512)
JPEG_QUALITY = 82
R2_FOLDER = "resume_photos"


def _get_r2_client():
    """
    Create a Cloudflare R2 S3-compatible client.
    """

    required_values = [
        settings.R2_ACCOUNT_ID,
        settings.R2_ACCESS_KEY_ID,
        settings.R2_SECRET_ACCESS_KEY,
        settings.R2_BUCKET_NAME,
        settings.R2_PUBLIC_URL,
    ]

    if not all(required_values):
        logger.error(
            "Cloudflare R2 storage configuration is incomplete",
        )
        raise HTTPException(
            status_code=500,
            detail="Cloudflare R2 storage is not configured",
        )

    return boto3.client(
        "s3",
        endpoint_url=(
            f"https://{settings.R2_ACCOUNT_ID}.r2.cloudflarestorage.com"
        ),
        aws_access_key_id=settings.R2_ACCESS_KEY_ID,
        aws_secret_access_key=settings.R2_SECRET_ACCESS_KEY,
        region_name="auto",
    )


def _build_public_url(object_key: str) -> str:
    """
    Build the public URL for an uploaded R2 object.
    """

    return (
        f"{settings.R2_PUBLIC_URL.rstrip('/')}/{object_key}"
    )


def _extract_object_key(photo_url: str) -> str | None:
    """
    Extract the R2 object key from a stored public URL.
    """

    if not photo_url:
        return None

    public_base_url = settings.R2_PUBLIC_URL.rstrip("/")

    if photo_url.startswith(public_base_url):
        return photo_url.replace(
            f"{public_base_url}/",
            "",
            1,
        )

    if photo_url.startswith(f"/{R2_FOLDER}/"):
        return photo_url.lstrip("/")

    if photo_url.startswith("/uploads/"):
        return None

    return None


def delete_resume_photo(
    photo_url: str,
):
    """
    Delete old resume photo from Cloudflare R2.
    """

    object_key = _extract_object_key(photo_url)

    logger.info(
        "Attempting to delete resume photo object_key=%s",
        object_key,
    )

    if not object_key:
        logger.warning(
            "Skipping resume photo deletion because object key could not be extracted photo_url=%s",
            photo_url,
        )
        return

    client = _get_r2_client()

    try:
        client.delete_object(
            Bucket=settings.R2_BUCKET_NAME,
            Key=object_key,
        )
        logger.info(
            "Deleted resume photo object_key=%s",
            object_key,
        )
    except (BotoCoreError, ClientError):
        logger.exception(
            "Failed to delete resume photo object_key=%s",
            object_key,
        )
        return


def delete_resume_photos(
    photo_urls: list[str],
):
    """
    Delete multiple resume photos from Cloudflare R2.
    Used when an account is deleted and all saved resume photos
    should be cleaned up before the user row is removed.
    """

    seen_photo_urls = set()

    for photo_url in photo_urls:
        if not photo_url or photo_url in seen_photo_urls:
            logger.info(
                "Skipping duplicate or empty resume photo during cleanup photo_url=%s",
                photo_url,
            )
            continue

        seen_photo_urls.add(photo_url)
        delete_resume_photo(photo_url)

    logger.info(
        "Completed bulk resume photo cleanup total_unique_photos=%s",
        len(seen_photo_urls),
    )


async def save_resume_photo(
    file: UploadFile,
    user_id: int,
) -> str:
    """
    Optimize uploaded resume photo, store it in Cloudflare R2,
    and return the public URL.
    """

    contents = await file.read()

    logger.info(
        "Received resume photo upload user_id=%s filename=%s size_bytes=%s",
        user_id,
        file.filename,
        len(contents),
    )

    if len(contents) > MAX_FILE_SIZE:
        logger.warning(
            "Resume photo exceeds size limit user_id=%s filename=%s size_bytes=%s",
            user_id,
            file.filename,
            len(contents),
        )
        raise HTTPException(
            status_code=400,
            detail="Image exceeds 5MB limit",
        )

    try:
        image = Image.open(BytesIO(contents))
        image = image.convert("RGB")
        image.thumbnail(MAX_IMAGE_SIZE)
    except Exception as exc:
        logger.exception(
            "Invalid resume image upload user_id=%s filename=%s",
            user_id,
            file.filename,
        )
        raise HTTPException(
            status_code=400,
            detail="Invalid image file",
        ) from exc

    output = BytesIO()

    image.save(
        output,
        format="JPEG",
        quality=JPEG_QUALITY,
        optimize=True,
    )

    output.seek(0)

    filename = f"user_{user_id}_{uuid4()}.jpg"
    object_key = f"{R2_FOLDER}/{filename}"
    logger.info(
        "Uploading optimized resume photo user_id=%s object_key=%s",
        user_id,
        object_key,
    )

    client = _get_r2_client()

    try:
        client.put_object(
            Bucket=settings.R2_BUCKET_NAME,
            Key=object_key,
            Body=output.getvalue(),
            ContentType="image/jpeg",
            CacheControl="public, max-age=31536000, immutable",
        )
    except (BotoCoreError, ClientError) as exc:
        logger.exception(
            "Failed to upload resume photo user_id=%s object_key=%s",
            user_id,
            object_key,
        )
        raise HTTPException(
            status_code=500,
            detail="Failed to upload resume photo",
        ) from exc

    logger.info(
        "Successfully uploaded resume photo user_id=%s object_key=%s",
        user_id,
        object_key,
    )

    return _build_public_url(object_key)
