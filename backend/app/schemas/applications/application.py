from datetime import date, datetime
from typing import Literal, Optional

from pydantic import BaseModel


ApplicationStatus = Literal[
    "applied",
    "phone_screen",
    "onsite",
    "offer",
    "rejected",
]


class ApplicationBase(BaseModel):
    company_name: str
    job_title: str
    status: ApplicationStatus = "applied"

    applied_date: date
    phone_screen_date: Optional[date] = None
    onsite_date: Optional[date] = None
    offer_date: Optional[date] = None
    rejected_date: Optional[date] = None

    follow_up_date: Optional[date] = None

    notes: str = ""


class ApplicationCreate(ApplicationBase):
    pass


class ApplicationUpdate(BaseModel):
    company_name: Optional[str] = None
    job_title: Optional[str] = None
    status: Optional[ApplicationStatus] = None

    applied_date: Optional[date] = None
    phone_screen_date: Optional[date] = None
    onsite_date: Optional[date] = None
    offer_date: Optional[date] = None
    rejected_date: Optional[date] = None

    follow_up_date: Optional[date] = None

    notes: Optional[str] = None


class ApplicationResponse(ApplicationBase):
    id: int
    user_id: int
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


class ApplicationStats(BaseModel):
    active: int
    response_rate: int
    offers: int
    follow_ups_due: int


class ApplicationListResponse(BaseModel):
    applications: list[ApplicationResponse]
    stats: ApplicationStats
