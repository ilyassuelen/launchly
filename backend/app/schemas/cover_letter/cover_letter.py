from datetime import datetime
from typing import Any, Dict

from pydantic import BaseModel


class CoverLetterBase(BaseModel):
    title: str

    template: str

    data: Dict[str, Any]

    latest_cover_letter_analysis: dict | None = None


class CoverLetterCreate(CoverLetterBase):
    pass


class CoverLetterResponse(CoverLetterBase):
    id: int

    created_at: datetime

    updated_at: datetime

    latest_cover_letter_analysis_created_at: datetime | None = None

    class Config:
        from_attributes = True